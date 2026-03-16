require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function optimizeDB() {
    try {
        console.log('Checking existing indexes...');
        const indexQuery = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'documents'");
        console.log(indexQuery.rows);

        console.log('Dropping existing vector index if present...');
        await pool.query('DROP INDEX IF EXISTS documents_embedding_idx;');

        // As per pgvector docs, vector_cosine_ops is correct for cosine distance
        console.log('Creating new ivfflat index for 3072 dimensions with lists=100...');
        try {
            await pool.query('CREATE INDEX documents_embedding_idx ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);');
            console.log('SUCCESS: Index created.');
        } catch (err) {
            console.error('Index creation error:', err.message);
        }

        const finalIndexQuery = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'documents'");
        console.log('Final Indexes:');
        console.log(finalIndexQuery.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
}
optimizeDB();
