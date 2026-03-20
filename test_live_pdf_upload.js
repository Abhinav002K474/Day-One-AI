const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testLivePDFUpload() {
    try {
        console.log("Preparing to upload a small 7KB local PDF to the Live Vercel App...");

        const pdfFilePath = path.join(__dirname, 'backend', 'uploads', 'temp', '1769314946171-SSLC_Maths_40_One_Mark_MCQs.pdf');
        
        if (!fs.existsSync(pdfFilePath)) {
            console.error("❌ Test PDF file not found at " + pdfFilePath);
            return;
        }

        const fileStream = fs.createReadStream(pdfFilePath);
        
        const formData = new FormData();
        formData.append('class', '10');
        formData.append('subject', 'Mathematics');
        formData.append('title', 'Math One Mark - LIVE SMALL PDF TEST');
        formData.append('uploadedBy', 'admin_script_test');
        formData.append('pdfFile', fileStream, 'math-small-test.pdf');

        const url = 'https://day-one-ayda.vercel.app/api/admin/study-material/upload';
        console.log(`Sending POST Request to ${url} ...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-User-Role': 'admin',
                ...formData.getHeaders()
            },
            body: formData
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            if (response.ok && data.success) {
                console.log('\n✅ Upload Successful!');
                console.log('Response:', data);
                console.log('\nNow open your Student Portal -> Study Materials -> Mathematics');
            } else {
                console.error('\n❌ Upload Failed (JSON)!');
                console.error('Status:', response.status);
                console.error('Response text:', data);
            }
        } catch (je) {
            console.error('\n❌ Upload Failed (Not JSON)! Code:', response.status);
            console.error('Raw Response:', text.substring(0, 500));
        }
    } catch (e) {
        console.error('Test Error:', e);
    }
}

testLivePDFUpload();
