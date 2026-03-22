const db = require('./db');
async function test() {
    const studentClass = '10';
    try {
        const sql = `
            SELECT *
            FROM assessments
            WHERE (
                class = $1 OR 
                REPLACE(REPLACE(UPPER(class), 'CLASS ', ''), ' - ', '') LIKE $2
            )
              AND LOWER(status) = 'published'
              AND date IS NOT NULL
              AND start_time IS NOT NULL
              AND end_time IS NOT NULL
            ORDER BY date, start_time
        `;
        const result = await db.pool.query(sql, [studentClass, studentClass + '%']);
        console.log(JSON.stringify(result.rows, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
