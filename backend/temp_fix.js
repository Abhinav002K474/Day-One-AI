require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixDB() {
  try {
    console.log('Recreating match_documents for 3072 and uuid id...');
    await pool.query('DROP FUNCTION IF EXISTS match_documents;');
    await pool.query(`
      CREATE OR REPLACE FUNCTION match_documents(
        query_embedding vector(3072),
        match_count int
      )
      RETURNS TABLE (
        id uuid,
        content text,
        subject text,
        class_level text
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          documents.id,
          documents.content,
          documents.subject,
          documents.class_level
        FROM documents
        ORDER BY documents.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `);
    console.log('SUCCESS!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}
fixDB();
