require("dotenv").config();
const { searchIndex } = require("./services/studyMaterialIndex.service");

(async () => {
    try {
        const queries = [
            { q: "What is inertia?", expected: "Science" },
            { q: "What is a polynomial?", expected: "Mathematics" },
            { q: "What is democracy?", expected: "Social Science" },
            { q: "What is a simile?", expected: "English" },
            { q: "Explain Sangam literature", expected: "Tamil" }
        ];

        console.log("=== CROSS-SUBJECT ISOLATION AUDIT ===");

        for (let item of queries) {
            console.log(`\nQuery: "${item.q}"`);
            const start = Date.now();
            const retrieved = await searchIndex(item.q, 1);
            const latency = Date.now() - start;

            if (!retrieved || retrieved.length === 0) {
                console.log(`❌ Failed: No chunks returned for ${item.q}`);
            } else {
                const source = retrieved[0].source;
                // e.g., "Science (Class 10) [Sim: 0.677]"
                if (source.includes(item.expected)) {
                    console.log(`✅ Success: Routed correctly to -> ${source}`);
                } else {
                    console.log(`⚠️  Leakage Detected! Expected ${item.expected}, but got -> ${source}`);
                }
            }
            console.log(`[RAG] Vector search time: ${latency} ms`);
        }
    } catch (err) {
        console.error("Audit error:", err);
    } finally {
        process.exit(0);
    }
})();
