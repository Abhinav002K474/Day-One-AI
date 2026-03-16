require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function optimizeDB() {
    try {
        console.log('Dropping existing vector index if present...');
        await pool.query('DROP INDEX IF EXISTS documents_embedding_idx;');

        console.log('Creating new hnsw index for 3072 dimensions...');
        try {
            await pool.query('CREATE INDEX documents_embedding_idx ON documents USING hnsw (embedding vector_cosine_ops);');
            console.log('SUCCESS: hnsw Index created.');
        } catch (err) {
            console.error('hnsw Index creation error:', err.message);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
}
optimizeDB();
