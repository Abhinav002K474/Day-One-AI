const fs = require('fs');

async function uploadQB() {
    try {
        const raw = fs.readFileSync('test-qb.json', 'utf8');
        
        const response = await fetch('https://day-one-ayda.vercel.app/api/admin/upload-question-bank-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Role': 'admin'
            },
            body: JSON.stringify({
                pastedJson: raw,
                title: 'Math One Marks',
                subject: 'Mathematics',
                class: '10'
            })
        });

        const data = await response.json();
        console.log('Upload Response:', data);
    } catch (e) {
        console.error('Upload Error:', e);
    }
}

uploadQB();
