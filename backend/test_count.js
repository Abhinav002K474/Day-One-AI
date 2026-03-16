require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const { rows } = await pool.query('SELECT subject, COUNT(*) FROM documents GROUP BY subject');
        console.log("Expected after fix:");
        for (let row of rows) {
            console.log(`${row.subject.padEnd(16)} | ${row.count}`);
        }
    } catch (err) {
        console.error("Script error:", err);
    } finally {
        pool.end();
    }
})();
