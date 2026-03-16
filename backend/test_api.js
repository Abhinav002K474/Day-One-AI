const http = require('http');

const data = JSON.stringify({ question: 'What is  inertia   ?' });

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/modulator/rag',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let responseData = '';
    res.on('data', d => {
        responseData += d;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(responseData);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log(responseData);
        }
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
