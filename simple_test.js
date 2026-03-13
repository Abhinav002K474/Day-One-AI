const API_BASE_URL = "https://ai-learning-platform-backend-production.up.railway.app";

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

async function run() {
    console.log("Checking API health...");
    try {
        const res = await fetch(API_BASE_URL); // GET /
        console.log("Health check status:", res.status);
        const text = await res.text();
        console.log("Health check body:", text.substring(0, 100));
    } catch (e) {
        console.log("Health check failed:", e.message);
    }

    // Checking Signup Payload
    const email = "test" + Math.random() + "@test.com";
    console.log("Testing Signup with email:", email);
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test", email, password: "password", class: "10" })
        });
        console.log("Signup Status:", res.status);
        const data = await res.json();
        console.log("Signup Data:", JSON.stringify(data));

        if (res.ok) {
            console.log("Signup working");
        } else {
            console.log("Signup not working");
        }
    } catch (e) {
        console.log("Signup Error:", e.message);
    }
}

run();
