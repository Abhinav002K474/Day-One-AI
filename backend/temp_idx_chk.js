require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkIndex() {
    try {
        const finalIndexQuery = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'documents'");
        console.log('Final Indexes:');
        console.log(finalIndexQuery.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
}
checkIndex();
