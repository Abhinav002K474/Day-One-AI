const db = require('./db');
async function test() {
    try {
        const studentClass = '10';
        const sql = `SELECT * FROM assessments WHERE (class = ? OR REPLACE(REPLACE(UPPER(class), 'CLASS ', ''), ' - ', '') LIKE ?) AND LOWER(status) = 'published' AND date IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL ORDER BY date, start_time`;
        const [r] = await db.query(sql, [studentClass, studentClass + '%']);
        console.log('Assessments found:', r.length);
        console.log(r);
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
