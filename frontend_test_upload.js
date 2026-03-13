const API_BASE_URL = "https://ai-learning-platform-backend-production.up.railway.app";
// Manually construct body with boundary
const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";

async function run() {
    console.log("Testing Upload (Expect Failure due to route mismatch)...");
    try {
        const body =
            `--${boundary}\r\nContent-Disposition: form-data; name="subject"\r\n\r\nMath\r\n` +
            `--${boundary}\r\nContent-Disposition: form-data; name="class"\r\n\r\n10\r\n` +
            `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\nThis is a test file content.\r\n` +
            `--${boundary}--\r\n`;

        // We need a tokenizer to get past "Authorization" if it matters, but usually 404/405 happens before Auth if route doesn't exist.
        // But here we are testing the EXACT URL from the user's code.
        const res = await fetch(`${API_BASE_URL}/api/upload/study-material`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer fake_token",
                "Content-Type": `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        console.log("Upload Status:", res.status);
        const text = await res.text();
        console.log("Upload Body:", text.substring(0, 150));

        if (res.ok) {
            console.log("Upload: WORKING");
        } else {
            console.log("Upload: NOT WORKING");
        }

    } catch (e) {
        console.log("Upload Error:", e.message);
    }
}

run();
