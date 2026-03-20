const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
});

async function uploadLocalFilesToDB() {
    const materialsBaseDir = path.join(__dirname, 'uploads', 'study-materials');
    
    const filesToUpload = [
        { subject: 'English', className: '10', title: 'Class 10 English Medium', path: path.join(materialsBaseDir, 'class10', 'english', '1768797799584_Class_10_English_English_Medium-2024_Edition-www.tntextbooks.in.pdf') },
        { subject: 'Mathematics', className: '10', title: 'Class 10 Mathematics English Medium', path: path.join(materialsBaseDir, 'class10', 'mathematics', '1768780957881_Class_10_Mathematics_English_Medium-2025_Edition-www.tntextbooks.in.pdf') },
        { subject: 'Science', className: '10', title: 'Class 10 Science English Medium', path: path.join(materialsBaseDir, 'class10', 'science', '1768798311154_Class_10_Science_English_Medium-2024_Edition-www.tntextbooks.in.pdf') },
        { subject: 'Social Science', className: '10', title: 'Class 10 Social Science English Medium', path: path.join(materialsBaseDir, 'class10', 'socialscience', '1772345236651_Class_10_Social_Science_English_2025_Edition-www.tntextbooks.in.pdf') },
        { subject: 'Tamil', className: '10', title: 'Class 10 Tamil 2025 Edition', path: path.join(materialsBaseDir, 'class10', 'tamil', '1772345139447_Class_10_Tamil_2025_Edition-www.tntextbooks.in.pdf') },
    ];

    try {
        console.log("Connecting to Supabase PostgreSQL Db...");
        const client = await pool.connect();

        await client.query(`
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

        console.log("Cleaning up old database records...");
        await client.query("DELETE FROM study_materials WHERE class = '10'");

        let i = 0;
        for (const item of filesToUpload) {
            if (!fs.existsSync(item.path)) {
                console.warn("Skipping: File not found " + item.path);
                continue;
            }

            console.log("Uploading " + item.subject + " to DB...");
            const fileBuffer = fs.readFileSync(item.path);
            const fileName = path.basename(item.path);
            const materialId = "mat_" + Date.now() + "_" + i;
            i++;

            try {
                await client.query(
                    "INSERT INTO study_materials (id, title, subject, class, file_data, file_name, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [materialId, item.title, item.subject, item.className, fileBuffer, fileName, 'sys_script_batch']
                );
                console.log("Successfully uploaded " + item.subject + " (" + (fileBuffer.length / 1024 / 1024).toFixed(2) + " MB)");
            } catch (err) {
                console.error("Failed to insert " + item.subject + ":", err.message);
            }
        }

        client.release();
        console.log("All Local PDFs Successfully Synced to Live Vercel DB!");
        process.exit(0);

    } catch (err) {
        console.error("Critical Error connecting to DB:", err);
        process.exit(1);
    }
}

uploadLocalFilesToDB();
