const API_BASE_URL = "https://ai-learning-platform-backend-production.up.railway.app";

async function run() {
    console.log("=== START LOGIN TEST ===");
    const email = "autotest_" + Date.now() + "@test.com";
    const password = "password123";

    console.log("Creating user:", email);
    // 1. Signup
    try {
        let sRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Auto", email, password, class: "10" })
        });

        const sStatus = sRes.status;
        const sBody = await sRes.text();
        console.log(`Signup Status: ${sStatus}`);
        console.log(`Signup Body: ${sBody.substring(0, 1000)}`); // Show full relevant body

        if (!sRes.ok) {
            console.log("Signup Failed. Aborting.");
            return;
        }

    } catch (e) {
        console.log("Signup Fetch Error:", e.message);
        return;
    }

    // 2. Login
    console.log("Attempting to Login...");
    try {
        let lRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const lStatus = lRes.status;
        const lBody = await lRes.text();
        console.log(`Login Status: ${lStatus}`);
        console.log(`Login Body: ${lBody.substring(0, 1000)}`); // Show full body

        if (lRes.ok) {
            console.log("Login SUCCESS: Token received.");
        } else {
            console.log("Login FAILED.");
        }
    } catch (e) {
        console.log("Login Fetch Error:", e.message);
    }
    console.log("=== END LOGIN TEST ===");
}

run();
