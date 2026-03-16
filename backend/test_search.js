require('dotenv').config();
const { searchIndex } = require('./services/studyMaterialIndex.service');

(async () => {
    const res = await searchIndex('What is inertia?', 5, 'Science', '10');
    console.log("Results:");
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
})();
