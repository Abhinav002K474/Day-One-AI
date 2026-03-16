require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log("=== SUBJECT DISTRIBUTION ===");
        const res1 = await pool.query('SELECT subject, COUNT(*) FROM documents GROUP BY subject ORDER BY subject');
        for (let row of res1.rows) {
            console.log(`${row.subject.padEnd(20)} | ${row.count}`);
        }

        console.log("\n=== DEDUPLICATION CHECK ===");
        const res2 = await pool.query('SELECT file_path, COUNT(*) FROM documents GROUP BY file_path ORDER BY COUNT(*) DESC');
        for (let row of res2.rows) {
            console.log(`${row.file_path.padEnd(75)} | ${row.count}`);
        }
    } catch (err) {
        console.error("Script error:", err);
    } finally {
        pool.end();
    }
})();
