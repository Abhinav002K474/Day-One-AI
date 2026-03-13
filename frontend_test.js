const crypto = require('crypto');
const API_BASE_URL = "https://ai-learning-platform-backend-production.up.railway.app";
// Polyfill File/FormData for simulate in plain node without fetch/form-data lib? 
// No, node 18+ has native fetch/FormData but FormData requires Blob/File which node doesn't fully have natively until very recent versions.
// Node 24 should have it. check global.FormData.

async function testFlow() {
    console.log("START_TEST_FLOW");

    try {
        // 1. Signup
        const email = `test_user_frontend_${crypto.randomUUID().substring(0, 8)}@example.com`;
        const password = "password123";
        const name = "Test User Frontend";
        const userClass = "10";

        console.log(`\n--- 1. Testing Signup ---`);
        let signupRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, class: userClass })
        });

        console.log(`Signup Status: ${signupRes.status}`);
        let signupData = await signupRes.json();

        if (!signupRes.ok) {
            console.log("Signup Failed:", JSON.stringify(signupData));
            // If user already exists (rare due to random email), try login anyway
        } else {
            console.log("Signup Success");
        }

        // 2. Login
        console.log(`\n--- 2. Testing Login ---`);
        let loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        console.log(`Login Status: ${loginRes.status}`);
        let loginData = await loginRes.json();
        let token = loginData.token;

        if (loginRes.ok && token) {
            console.log("Login Success. Token received.");
        } else {
            console.log("Login Failed:", JSON.stringify(loginData));
            console.log("Cannot proceed without token.");
            return;
        }

        // 3. AI Generation
        console.log(`\n--- 3. Testing AI Generation ---`);
        // Note: Frontend code does not send Auth header. Checking if backend requires it.
        let aiRes = await fetch(`${API_BASE_URL}/api/ai/generate-questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // No Auth header as per frontend code
            },
            body: JSON.stringify({ text: "Photosynthesis" })
        });

        console.log(`AI Gen Status: ${aiRes.status}`);
        let aiData = await aiRes.json();

        if (aiRes.ok) {
            console.log("AI Generation Success");
        } else {
            console.log("AI Generation Failed:", JSON.stringify(aiData));
        }

        // 4. Upload
        console.log(`\n--- 4. Testing Upload ---`);
        // Manually construct body with boundary
        const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        const body =
            `--${boundary}\r\nContent-Disposition: form-data; name="subject"\r\n\r\nMath\r\n` +
            `--${boundary}\r\nContent-Disposition: form-data; name="class"\r\n\r\n10\r\n` +
            `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\nThis is a test file content.\r\n` +
            `--${boundary}--\r\n`;

        let uploadRes = await fetch(`${API_BASE_URL}/api/upload/study-material`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        console.log(`Upload Status: ${uploadRes.status}`);
        let uploadData = await uploadRes.json();

        if (uploadRes.ok) {
            console.log("Upload Success");
        } else {
            console.log("Upload Failed:", JSON.stringify(uploadData));
        }

    } catch (e) {
        console.error("Test Script Error:", e);
    }
    console.log("END_TEST_FLOW");
}

testFlow();
