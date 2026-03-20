const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function updateDB() {
    try {
        const client = await pool.connect();
        await client.query(`ALTER TABLE study_materials ALTER COLUMN file_data DROP NOT NULL;`);
        await client.query(`ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS storage_path TEXT;`);
        console.log("Database schema updated successfully.");
        client.release();
        process.exit(0);
    } catch (e) {
        console.error("Error updating schema:", e);
        process.exit(1);
    }
}

updateDB();
