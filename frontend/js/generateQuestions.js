async function generateQuestions() {

    const text = document.getElementById("inputText").value;

    if (!text) {
        alert("Please enter a topic");
        return;
    }

    document.getElementById("output").innerText = "Generating...";

    try {
        // Use /api/modulator as the available AI endpoint
        const response = await fetch(`${API_BASE_URL}/api/modulator`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                // The backend accepts 'question', 'text', or 'message'
                text: "Generate 5 questions about: " + text
            })

        });

        const data = await response.json();

        if (data.success) {
            document.getElementById("output").innerText = data.answer;
        } else {
            console.error("AI Error:", data);
            document.getElementById("output").innerText = data.message || "Error generating questions";
        }

    } catch (error) {
        console.error("Error generating questions:", error);
        document.getElementById("output").innerText = "Error generating questions";
    }

}
