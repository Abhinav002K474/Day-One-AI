const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { summarizeText } = require('../services/summarizer.client');
const db = require('../db');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client dynamically
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Service Role Key allows everything
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

async function ensureTable() {
    await db.pool.query(`
        CREATE TABLE IF NOT EXISTS study_materials (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            class TEXT NOT NULL,
            file_data BYTEA,
            file_name TEXT NOT NULL,
            uploaded_by TEXT DEFAULT 'admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            storage_path TEXT
        )
    `);
}
ensureTable().catch(err => console.error('study_materials table init error:', err));

// ------------------------------------------------------------------
// 1. GET SIGNED UPLOAD URL (Bypasses Vercel 4.5MB limit)
// ------------------------------------------------------------------
router.post('/admin/study-material/get-upload-url', async (req, res) => {
    try {
        if (!supabase) return res.status(500).json({ error: "Supabase not configured in .env" });
        if (req.headers['x-user-role'] !== 'admin') return res.status(403).json({ error: "Admins only" });

        const { fileName } = req.body;
        if (!fileName) return res.status(400).json({ error: "fileName required" });

        const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        // Create a signed upload URL valid for 10 minutes
        const { data, error } = await supabase.storage
            .from('study-materials')
            .createSignedUploadUrl(safeName);

        if (error) {
            console.error('Supabase Signed URL Error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ success: true, signedUrl: data.signedUrl, path: data.path });
    } catch (err) {
        console.error("Get Upload URL Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------
// 2. CONFIRM UPLOAD & SAVE TO DATABASE
// ------------------------------------------------------------------
router.post('/admin/study-material/confirm-upload', async (req, res) => {
    try {
        if (req.headers['x-user-role'] !== 'admin') return res.status(403).json({ error: "Admins only" });

        const { class: className, subject, title, path, fileName } = req.body;
        
        if (!className || !subject || !title || !path) {
            return res.status(400).json({ error: 'Missing metadata required for DB insertion' });
        }

        const materialId = `mat_${Date.now()}`;

        await db.pool.query(
            `INSERT INTO study_materials (id, title, subject, class, file_name, storage_path, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [materialId, title, subject, className, fileName || 'Unknown PDF', path, 'admin_dashboard']
        );

        res.json({ success: true, message: 'Study material uploaded & indexed successfully', data: { id: materialId } });

        // Trigger indexing securely in background
        const { indexDocument } = require('../services/studyMaterialIndex.service');
        const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/study-materials/${path}`;
        
        console.log("Downloading from Supabase for indexing...");
        fetch(fileUrl).then(response => response.buffer()).then(buffer => {
            const tempFsPath = require('path').join(require('os').tmpdir(), fileName);
            require('fs').writeFileSync(tempFsPath, buffer);
            indexDocument(tempFsPath, { subject, class_level: className }).catch(e => console.error(e));
        }).catch(e => console.error("Background fetch for index failed:", e));

    } catch (err) {
        console.error("Confirm Upload Error:", err);
        res.status(500).json({ error: "Database save failed" });
    }
});

// ------------------------------------------------------------------
// STUDENT: List Materials
// ------------------------------------------------------------------
router.get('/student/study-materials', async (req, res) => {
    const subject = req.query.subject;
    if (!subject) return res.status(400).json({ success: false, error: 'Subject is required' });

    try {
        const result = await db.pool.query(
            `SELECT id, title, subject, class, uploaded_by, created_at, storage_path
             FROM study_materials
             WHERE LOWER(subject) = LOWER($1) AND is_active = TRUE
             ORDER BY created_at DESC`,
            [subject]
        );

        const materials = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            subject: row.subject,
            class: row.class,
            uploadedBy: row.uploaded_by,
            createdAt: row.created_at,
            // Point directly to view route to handle both old BYTEA and new Supabase Storage methods transparently
            filePath: `/api/student/study-materials/view/${row.id}`
        }));

        res.json({ success: true, materials });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch materials' });
    }
});

// ------------------------------------------------------------------
// STUDENT: Stream / View PDF (Supports both BYTEA and Supabase URL)
// ------------------------------------------------------------------
router.get('/student/study-materials/view/:materialId', async (req, res) => {
    const materialId = req.params.materialId;

    try {
        const result = await db.pool.query(
            `SELECT title, file_data, file_name, storage_path FROM study_materials WHERE id = $1 AND is_active = TRUE`,
            [materialId]
        );

        if (result.rows.length === 0) return res.status(404).send('Material not found');

        const { title, file_data, file_name, storage_path } = result.rows[0];

        // 1. If it's a recently uploaded Supabase File
        if (storage_path && supabaseUrl) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/study-materials/${storage_path}`;
            // Fetch dynamically and pipe to keep URL native or act as a transparent proxy
            const fileRes = await fetch(publicUrl);
            if (!fileRes.ok) return res.status(404).send("Supabase file missing");
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${title || file_name}.pdf"`);
            return fileRes.body.pipe(res);
        }

        // 2. If it's a legacy file stored natively in PG BYTEA
        if (file_data) {
            const buffer = Buffer.from(file_data);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${title || file_name}.pdf"`);
            res.setHeader('Content-Length', buffer.length);
            return res.send(buffer);
        }

        res.status(404).send("File content empty");

    } catch (err) {
        console.error('Stream Material Error:', err);
        res.status(500).send('Server Error');
    }
});

// ------------------------------------------------------------------
// AI: Summarize Material
// ------------------------------------------------------------------
router.post('/pdf/summarize', async (req, res) => {
    try {
        const { materialId } = req.body;
        if (!materialId) return res.status(400).json({ success: false, message: 'Material ID required' });

        const result = await db.pool.query(
            `SELECT file_data, storage_path FROM study_materials WHERE id = $1 AND is_active = TRUE`,
            [materialId]
        );

        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Material not found' });

        let buffer;
        const { file_data, storage_path } = result.rows[0];

        if (storage_path && supabaseUrl) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/study-materials/${storage_path}`;
            const fileRes = await fetch(publicUrl);
            buffer = await fileRes.buffer();
        } else if (file_data) {
            buffer = Buffer.from(file_data);
        } else {
             return res.status(404).json({ success: false, message: 'No file content found to summarize' });
        }

        const pdfData = await pdf(buffer);
        const text = pdfData.text.substring(0, 2000);

        const summary = await summarizeText(text);
        res.json({ success: true, summary });

    } catch (err) {
        console.error('Summarize Error:', err);
        res.status(500).json({ success: false, message: 'AI Summarization Failed' });
    }
});

module.exports = router;
