const db = require('./db');
async function run() {
    try {
        const studentClass = '10';
        const sql = `SELECT class, status, title, date, start_time, end_time FROM assessments
            WHERE (class = ? OR REPLACE(REPLACE(UPPER(class), 'CLASS ', ''), ' - ', '') = ?)
              AND LOWER(status) = 'published' AND date IS NOT NULL AND start_time IS NOT NULL AND end_time IS NOT NULL ORDER BY date, start_time`;
        const [results] = await db.query(sql, [studentClass, studentClass]);
        console.log('DB Results for Class 10 (or 10A matched to 10):', results);
    } catch(e) {
        console.error('ERROR:', e);
    } finally {
        process.exit();
    }
}
run();
