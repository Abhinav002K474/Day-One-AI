(async () => {
    try {
        const res = await fetch('http://localhost:5000/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: "Why did the seagull fail?",
                context: "The young seagull was alone on his ledge... He became afraid..."
            })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e.message);
    }
})();
