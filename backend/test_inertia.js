require("dotenv").config();
const fs = require("fs");
const { searchIndex } = require("./services/studyMaterialIndex.service");
const { generateGeminiReply } = require("./services/gemini.service");

(async () => {
    try {
        const question = "What is inertia?";
        fs.writeFileSync("inertia_log.txt", "Testing with question: " + question + "\n");

        const retrieved = await searchIndex(question, 5, 'Science');

        if (!retrieved || retrieved.length === 0) {
            fs.appendFileSync("inertia_log.txt", "Failed: No chunks retrieved! It will fallback.\n");
        } else {
            fs.appendFileSync("inertia_log.txt", `Success: [RAG] Retrieved ${retrieved.length} relevant chunks\n`);
            fs.appendFileSync("inertia_log.txt", "Top Source: " + retrieved[0].source + "\n");

            const context = retrieved
                .map((r, index) => `[Source ${index + 1}: ${r.source}]\n${r.text}`)
                .join("\n\n");

            const prompt = `You are a school learning assistant.
Rules:
- Return maximum 8 lines. First 4 should be concise. Remaining 4 can expand explanation.
- Each line under 20 words.
- Use very simple English.
- Give one clear real-life example.
- No introductions.
- No storytelling.
- No extra explanation.
- Direct answer only.

You must answer ONLY using the study material below.
When you use information from the text, append a citation market like this: (Source: Science Class 10).

STUDY MATERIAL:
${context}

Question:
${question}

Answer:`;

            const answer = await generateGeminiReply(prompt);
            fs.appendFileSync("inertia_log.txt", "\nGenerative AI Output:\n" + answer + "\n");
        }
    } catch (err) {
        fs.appendFileSync("error.log", "Error: " + err.message + "\n" + err.stack + "\n");
    } finally {
        process.exit(0);
    }
})();
