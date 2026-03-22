const db = require('./db');
async function run() {
    try {
        const sql = `SELECT class, status, title FROM assessments`;
        const [results] = await db.query(sql);
        console.log('All DB rows:', results);
    } catch(e) {
        console.error('ERROR:', e);
    } finally {
        process.exit();
    }
}
run();
