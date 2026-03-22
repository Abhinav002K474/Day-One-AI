const db = require('./db');
async function test() {
    try {
        const sql = `
            SELECT *
            FROM assessments
            WHERE (
                class = ? OR 
                REPLACE(REPLACE(UPPER(class), 'CLASS ', ''), ' - ', '') LIKE ?
            )
              AND LOWER(status) = 'published'
              AND date IS NOT NULL
              AND start_time IS NOT NULL
              AND end_time IS NOT NULL
            ORDER BY date, start_time
        `;
        const [r] = await db.query(sql, ['10', '10%']);
        console.log("Returned:", r.length);
    } catch(e) { console.error(e); } finally { process.exit(); }
} test();
