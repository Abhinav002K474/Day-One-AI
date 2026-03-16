const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse"); // Extract text
const { Pool } = require("pg"); // node-postgres client
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Init pg client using process.env.DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Remove in-memory indexing logic. We keep an empty buildIndex so server.js doesn't crash on startup.
async function buildIndex() {
    console.log("🔄 RAG Service (pgvector enabled). Skipping local filesystem indexing on startup.");
}

// Function to chunk text with overlap
function chunkText(text, size = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + size, text.length);
        const chunk = text.slice(start, end);
        chunks.push(chunk);
        start += (size - overlap);
        if (start >= text.length) break; // Safety check
    }
    return chunks;
}

const crypto = require("crypto");
const { LRUCache } = require("lru-cache");

const embeddingCache = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 60, // 1 hour
});

// Function to generate embedding using Gemini embedding model
async function getEmbedding(text) {
    // Level 2 - Embedding Cache
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    if (embeddingCache.has(hash)) {
        console.log(`[Cache Hit] Level 2: Reusing stored embedding vector`);
        return embeddingCache.get(hash);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);

    // Store in cache
    embeddingCache.set(hash, result.embedding.values);
    return result.embedding.values;
}

// 2. When new study material is uploaded:
async function indexDocument(filePath, metadata = {}) {
    const { subject = 'General', class_level = 'All' } = metadata;

    try {
        console.log(`[RAG] Indexing new document to pgvector: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.error(`[RAG] File not found: ${filePath}`);
            return;
        }

        // a. Extract text
        const buffer = fs.readFileSync(filePath);
        const data = await pdf(buffer);
        let rawText = data.text || "";

        // Normalizing text slightly to maintain clean chunks
        const normalized = rawText
            .replace(/\s+/g, " ")
            .replace(/[^a-zA-Z0-9.,()–\-\? ]/g, "")
            .trim();

        // b. Chunk it
        const chunks = chunkText(normalized, 1000, 200);
        console.log(`[RAG] Created ${chunks.length} chunks. Generating embeddings...`);

        // Deduplication Option C - Delete old rows with matching filepath to avoid infinite growth
        const normalizedFilePath = path.basename(filePath);
        await pool.query('DELETE FROM documents WHERE file_path = $1', [normalizedFilePath]);
        console.log(`[RAG] Cleared old records for file: ${normalizedFilePath}`);

        // c. Generate embedding using Gemini embedding model
        // d. Store chunks + embeddings in Supabase documents table
        let successCount = 0;
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (chunk.length < 50) continue; // skip very short/badly parsed chunks

            try {
                // Rate limiter to prevent Gemini API throttling (1500 RPM burst protection)
                await new Promise(resolve => setTimeout(resolve, 70));

                const embedding = await getEmbedding(chunk);

                // pgvector expects string representation for vector insert
                const embeddingStr = `[${embedding.join(',')}]`;

                const query = `
                    INSERT INTO documents (content, embedding, subject, class_level, created_at, file_path)
                    VALUES ($1, $2::vector, $3, $4, NOW(), $5)
                `;

                await pool.query(query, [chunk, embeddingStr, subject, class_level, normalizedFilePath]);
                successCount++;
            } catch (err) {
                console.error(`[RAG] Error embedding/storing chunk ${i}:`, err.message);
            }
        }

        console.log(`[RAG] Successfully indexed ${successCount} chunks for: ${path.basename(filePath)}`);

    } catch (err) {
        console.error(`[RAG] Document Indexing Failed:`, err);
    }
}

// 3. When answering a user question:
async function searchIndex(queryText, matchCount = 5, filterSubject = null, filterClassLevel = null) {
    if (!queryText) return [];

    const searchStart = Date.now();
    try {
        console.log(`[RAG] Generating embedding for query: "${queryText}"`);

        // a. Generate query embedding using Gemini
        const queryEmbedding = await getEmbedding(queryText);
        const queryEmbeddingStr = `[${queryEmbedding.join(',')}]`;

        // b. Raw SQL query enforcing O(n_subject) bounds
        const similarityThreshold = 0.65;
        console.log(`[RAG] Querying vector DB for top ${matchCount} matches (thresh > ${similarityThreshold})...`);
        const query = `
            SELECT id, content, subject, class_level, 
                   1 - (embedding <=> $1::vector) AS similarity
            FROM documents
            WHERE subject = $3
            AND class_level = $4
            AND 1 - (embedding <=> $1::vector) > $5
            ORDER BY embedding <=> $1::vector
            LIMIT $2
        `;

        // c. Retrieve top N matching chunks
        const res = await pool.query(query, [
            queryEmbeddingStr,
            matchCount,
            filterSubject,
            filterClassLevel,
            similarityThreshold
        ]);

        console.log(`[RAG] Retrieved ${res.rows.length} relevant chunks`);
        console.log(`[RAG] Vector search time: ${Date.now() - searchStart} ms`);

        // Map to format expected by routing layer (for Gemini contextualization)
        return res.rows.map(row => ({
            source: `${row.subject} (Class ${row.class_level}) [Sim: ${row.similarity.toFixed(3)}]`,
            text: row.content
        }));

    } catch (err) {
        console.error(`[RAG] Vector Search Error:`, err.message);
        if (err.status === 429 || err?.response?.status === 429) {
            const limitErr = new Error("EMBEDDING_RATE_LIMIT");
            limitErr.code = "EMBEDDING_RATE_LIMIT";
            limitErr.category = "INFRASTRUCTURE";
            limitErr.retryable = true;
            limitErr.retryAfter = 12;
            throw limitErr;
        }
        return [];
    }
}

module.exports = { buildIndex, indexDocument, searchIndex };
