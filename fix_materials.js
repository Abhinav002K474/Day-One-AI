const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'backend', 'routes', 'materials.routes.js');
let code = fs.readFileSync(targetFile, 'utf8');

// Replace temp folder path
code = code.replace(/const tempDir = path\.join\(__dirname, '\.\.\/uploads\/temp'\);/g, "const tempDir = process.env.VERCEL ? '/tmp/uploads/temp' : path.join(__dirname, '../uploads/temp');");

// Replace data folder
code = code.replace(/const dbPath = path\.join\(__dirname, '\.\.\/data\/materials\.json'\);/g, "const dbPath = process.env.VERCEL ? '/tmp/data/materials.json' : path.join(__dirname, '../data/materials.json');");

code = code.replace(/const dataDir = path\.join\(__dirname, '\.\.\/data'\);/g, "const dataDir = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, '../data');");


// Replace target folder for study materials
code = code.replace(/const targetDir = path\.join\(__dirname, '\.\.\/uploads\/study-materials', safeClass, safeSubject\);/g, "const targetDir = process.env.VERCEL ? path.join('/tmp/uploads/study-materials', safeClass, safeSubject) : path.join(__dirname, '../uploads/study-materials', safeClass, safeSubject);");

// Replace absolute path logic
const oldAbsolutePathLogic = `
        const relativePath = material.filePath.startsWith('/') ? material.filePath.substring(1) : material.filePath;
        const absolutePath = path.join(__dirname, '..', relativePath);
`;
const newAbsolutePathLogic = `
        const relativePath = material.filePath.startsWith('/') ? material.filePath.substring(1) : material.filePath;
        const absolutePath = process.env.VERCEL 
            ? path.join('/tmp', relativePath) 
            : path.join(__dirname, '..', relativePath);
`;

code = code.replaceAll(oldAbsolutePathLogic, newAbsolutePathLogic);

// Replace security check
const oldSecurityCheck = `
        // Security check: Prevent directory traversal
        if (!absolutePath.startsWith(path.join(__dirname, '../uploads'))) {
            return res.status(403).send("Access Denied");
        }
`;
const newSecurityCheck = `
        // Security check: Prevent directory traversal
        const baseUploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../uploads');
        if (!absolutePath.startsWith(baseUploadsDir)) {
            return res.status(403).send("Access Denied");
        }
`;
code = code.replace(oldSecurityCheck, newSecurityCheck);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('materials.routes.js updated successfully!');
