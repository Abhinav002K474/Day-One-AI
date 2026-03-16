require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const { rows } = await pool.query('SELECT COUNT(*) FROM documents');
        console.log(`Total vectors: ${rows[0].count}`);
    } catch (err) {
        console.error("Script error:", err);
    } finally {
        pool.end();
    }
})();
