const http = require('http');

http.get('http://localhost:5000/api/student/assessments?class=10', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log("Parsed Array Length:", parsed.length);
            if (parsed.length > 0) {
                console.log("First Element:", JSON.stringify(parsed[0], null, 2));
            } else {
                console.log("It's empty array [] !");
                console.log("Raw payload:", data);
            }
        } catch(e) {
            console.error("Not JSON:", data);
        }
    });
}).on('error', err => {
    console.error("Error hitting user API:", err.message);
});
