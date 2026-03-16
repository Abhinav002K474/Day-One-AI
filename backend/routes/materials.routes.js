const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { summarizeText } = require('../services/summarizer.client');
const db = require('../db');

// ✅ Use memory storage — works on Vercel (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// ------------------------------------------------------------------
// DB SETUP: Ensure study_materials table exists
// ------------------------------------------------------------------
async function ensureTable() {
    await db.pool.query(`
        CREATE TABLE IF NOT EXISTS study_materials (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            class TEXT NOT NULL,
            file_data BYTEA NOT NULL,
            file_name TEXT NOT NULL,
            uploaded_by TEXT DEFAULT 'admin',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
}
ensureTable().catch(err => console.error('study_materials table init error:', err));

// ------------------------------------------------------------------
// ADMIN: Upload Study Material → stored in PostgreSQL
// POST /api/admin/study-material/upload
// ------------------------------------------------------------------
router.post('/admin/study-material/upload', (req, res, next) => {
    upload.single('pdfFile')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: 'File too large. Max is 50MB.' });
            }
            return res.status(400).json({ success: false, error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        // Role check
        const userRole = req.headers['x-user-role'];
        if (userRole !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access Denied: Admins only' });
        }

        const { class: className, subject, title, uploadedBy } = req.body;
        const file = req.file;

        if (!className || !subject || !title || !file) {
            return res.status(400).json({ success: false, error: 'Missing required fields: class, subject, title, and PDF file.' });
        }

        const materialId = `mat_${Date.now()}`;

        await db.pool.query(
            `INSERT INTO study_materials (id, title, subject, class, file_data, file_name, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [materialId, title, subject, className, file.buffer, file.originalname, uploadedBy || 'admin']
        );

        console.log(`[Upload] ✅ Saved to DB: ${materialId} - ${title}`);

        res.json({
            success: true,
            message: 'Study material uploaded successfully',
            data: { id: materialId, title, subject, class: className }
        });

    } catch (error) {
        console.error('Admin Upload Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error during upload: ' + error.message });
    }
});

// ------------------------------------------------------------------
// STUDENT: List Materials (Filtered by Subject)
// GET /api/student/study-materials?subject=Tamil
// ------------------------------------------------------------------
router.get('/student/study-materials', async (req, res) => {
    const subject = req.query.subject;
    if (!subject) return res.status(400).json({ success: false, error: 'Subject is required' });

    try {
        const result = await db.pool.query(
            `SELECT id, title, subject, class, uploaded_by, created_at
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
            // Build the viewer URL
            filePath: `/api/student/study-materials/view/${row.id}`
        }));

        res.json({ success: true, materials });

    } catch (err) {
        console.error('Fetch Materials Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch materials' });
    }
});

// ------------------------------------------------------------------
// STUDENT: Stream / View a PDF by ID
// GET /api/student/study-materials/view/:materialId
// ------------------------------------------------------------------
router.get('/student/study-materials/view/:materialId', async (req, res) => {
    const materialId = req.params.materialId;

    try {
        const result = await db.pool.query(
            `SELECT title, file_data, file_name FROM study_materials WHERE id = $1 AND is_active = TRUE`,
            [materialId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Material not found');
        }

        const { title, file_data, file_name } = result.rows[0];
        const buffer = Buffer.from(file_data);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${title || file_name}.pdf"`);
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);

    } catch (err) {
        console.error('Stream Material Error:', err);
        res.status(500).send('Server Error');
    }
});

// ------------------------------------------------------------------
// STUDENT + TEACHER: General Upload (legacy route kept for compat)
// POST /api/upload/study-material
// ------------------------------------------------------------------
router.post('/upload/study-material', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token required' });
        }

        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const materialId = `mat_${Date.now()}`;
        const title = req.body.title || file.originalname;
        const subject = req.body.subject || 'General';
        const className = req.body.class || 'All';

        await db.pool.query(
            `INSERT INTO study_materials (id, title, subject, class, file_data, file_name, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [materialId, title, subject, className, file.buffer, file.originalname, req.body.uploadedBy || 'user']
        );

        res.json({
            success: true,
            message: 'Study material uploaded successfully',
            data: { id: materialId, title, subject, class: className }
        });

    } catch (err) {
        console.error('[Upload] ❌ Error:', err.message);
        res.status(500).json({ success: false, message: 'Upload failed: ' + err.message });
    }
});

// ------------------------------------------------------------------
// AI: Summarize Material
// POST /api/pdf/summarize
// ------------------------------------------------------------------
router.post('/pdf/summarize', async (req, res) => {
    try {
        const { materialId } = req.body;
        if (!materialId) return res.status(400).json({ success: false, message: 'Material ID required' });

        const result = await db.pool.query(
            `SELECT file_data, title FROM study_materials WHERE id = $1 AND is_active = TRUE`,
            [materialId]
        );

        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Material not found' });

        const buffer = Buffer.from(result.rows[0].file_data);
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
