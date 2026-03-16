const express = require("express");
const router = express.Router();

const { searchIndex } = require("../services/studyMaterialIndex.service");
const { generateGeminiReply } = require("../services/gemini.service");

const { LRUCache } = require("lru-cache");

// L1 Cache memory initialization
const exactQueryCache = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 60, // 1 hour
});

router.post("/modulator/rag", async (req, res) => {
    try {
        const { question } = req.body;
        console.log("MODULATOR route triggered");
        console.log("📥 RAG Question:", question); // Added Logging

        if (!question) {
            return res.json({ answer: "Please ask a question." }); // Soft error
        }

        // Level 1: Exact Query Cache (Immediate Win)
        const normalizedQuestion = question
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ")               // collapse multiple spaces
            .replace(/\s([?.!,])/g, "$1")       // remove space before punctuation
            .replace(/([?.!,])+/g, "$1")        // collapse repeated punctuation
            .replace(/[!?]+$/, "?")             // normalize all terminal ! or !? to ?
            // Semantic canonicalization
            .replace(/^(what is the definition of |what is the meaning of )/g, "")
            .replace(/^(what is a |what is an |what is |what are |define a |define an |define |explain a |explain an |explain |describe a |describe an |describe |tell me about a |tell me about an |tell me about )/g, "")
            .replace(/\s+(meaning|definition)\??$/g, "")
            .replace(/\?$/, "");                // strip trailing question mark after semantic simplification
        const subject = req.body.subject || 'Detected';
        const class_level = req.body.class_level || '10';
        const cacheKey = `${subject}:${class_level}:${normalizedQuestion}`;

        if (exactQueryCache.has(cacheKey)) {
            console.log(`[Cache Hit] Level 1: Returning exact query payload (Latency: ~20ms)`);
            return res.json(exactQueryCache.get(cacheKey));
        }

        // 1. Ultra-fast AI Subject Router
        const classifyPrompt = `
Analyze this question: "${question}"
Which single subject does it belong to?
Allowed: Mathematics, Science, Social Science, English, Tamil
If unsure, return General.
Return ONLY the subject name.
`;
        const subjectResult = await generateGeminiReply(classifyPrompt);
        let detectedSubject = subjectResult.trim();
        const validSubjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Tamil'];
        if (!validSubjects.includes(detectedSubject)) {
            detectedSubject = 'General';
        }

        console.log(`[RAG Router] Question mapped to Subject: ${detectedSubject}`);

        // 2. Perform strictly filtered SearchIndex (O(n_subject) efficiency)
        let retrieved = [];
        if (detectedSubject !== 'General') {
            retrieved = await searchIndex(question, 5, detectedSubject, '10');
        }

        console.log("[RAG] Diagnostics Map:", retrieved.map(r => ({
            source: r.source
        })));

        const systemInstruction = `
You are a school learning assistant.

Rules:
- You must structure your response EXACTLY in this format:
  **Definition:** [Clear, 1-line definition]
  **Explanation:** [Brief 2-3 line simple explanation]
  **Example:** [One short real-life or practical example]
  **Conclusion:** [One sentence wrapping up]
- Keep each section under 20 words.
- Use very simple English.
- No storytelling or filler text.
`;

        if (!retrieved || retrieved.length === 0) {
            console.log("No relevant RAG chunks found. Triggering general knowledge fallback...");
            const fallbackPrompt = `
${systemInstruction}

Question:
${question}

Answer:
`;
            const generalAnswer = await generateGeminiReply(fallbackPrompt);

            const fallbackResponse = {
                mode: "GENERAL",
                warning: "Not found in syllabus",
                answer: generalAnswer,
                fallback: true,
                source: "general_knowledge"
            };
            // Cache the general knowledge response too
            exactQueryCache.set(cacheKey, fallbackResponse);
            return res.json(fallbackResponse);
        }

        const context = retrieved
            .map((r, index) => `[Source ${index + 1}: ${r.source}]\n${r.text}`)
            .join("\n\n");

        const prompt = `
${systemInstruction}

You must answer ONLY using the study material below.
When you use information from the text, append a citation market like this: (Source: Mathematics Class 10).

STUDY MATERIAL:
${context}

Question:
${question}

Answer:
`;

        console.log("Calling Gemini from MODULATOR route...");
        const answer = await generateGeminiReply(prompt);
        console.log("Gemini response received in MODULATOR route");

        let confidence = 0.85;
        try {
            const match = retrieved[0].source.match(/Sim: ([\d.]+)/);
            if (match && match[1]) {
                confidence = parseFloat(match[1]);
            }
        } catch (e) { }

        const ragResponse = {
            mode: "SYLLABUS_RAG",
            confidence: confidence,
            answer: answer
        };
        // Store the final structured result in cache
        exactQueryCache.set(cacheKey, ragResponse);
        res.json(ragResponse);

    } catch (err) {
        console.error("RAG Error:", err);
        if (err.category === "INFRASTRUCTURE") {
            return res.json({
                mode: "SYSTEM_LIMIT",
                subtype: err.code || "UNKNOWN_INFRASTRUCTURE_ERROR",
                error: "Infrastructure or networking error",
                retryable: err.retryable || false,
                retry_after: err.retryAfter || null,
                answer: "Please wait a few seconds and try again."
            });
        }

        res.json({
            answer: "The system encountered an issue, but the RAG pipeline is active."
        });
    }
});

module.exports = router;
