const API_BASE_URL = "https://ai-learning-platform-backend-production.up.railway.app";

async function run() {
    console.log("Testing AI Generation (No Auth)...");
    try {
        const res = await fetch(`${API_BASE_URL}/api/ai/generate-questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "Photosynthesis" })
        });
        console.log("AI Status:", res.status);
        const text = await res.text(); // Get raw text to see error HTML if any
        console.log("AI Body:", text.substring(0, 200));

        if (res.ok) {
            console.log("AI Check: OK");
        } else {
            console.log("AI Check: FAILED (" + res.status + ")");
        }

    } catch (e) {
        console.log("AI Error:", e.message);
    }
}

run();
