require("dotenv").config();
const { Pool } = require("pg");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
    try {
        const queryText = "What is inertia?";
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(queryText);
        const embedding = result.embedding.values;
        const embeddingStr = `[${embedding.join(',')}]`;

        const query = `
            SELECT id, content, subject, class_level, 1 - (embedding <=> $1::vector) AS similarity
            FROM documents
            ORDER BY embedding <=> $1::vector
            LIMIT 5
        `;

        const { rows } = await pool.query(query, [embeddingStr]);
        console.log(`Top 5 matches for '${queryText}':`);
        for (let row of rows) {
            console.log(`- Sim: ${row.similarity.toFixed(3)} | Subject: ${row.subject} | Content: ${row.content.substring(0, 50)}...`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
})();
