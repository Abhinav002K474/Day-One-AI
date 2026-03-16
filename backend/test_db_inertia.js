require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const { rows } = await pool.query(`SELECT content, subject, file_path FROM documents WHERE content ILIKE '%inertia%' LIMIT 5;`);
        console.log(`Found ${rows.length} rows matching 'inertia'`);
        for (let row of rows) {
            console.log("---");
            console.log(`Subject: ${row.subject}, File: ${row.file_path}`);
            console.log(row.content);
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
})();
