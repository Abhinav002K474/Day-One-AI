require('dotenv').config({ path: './backend/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

(async () => {
    try {
        console.log("Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Hello`;
        const result = await model.generateContent(prompt);
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Gemini Error:", e);
    }
})();
