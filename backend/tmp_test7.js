const db = require('./db');
async function test() {
    try {
        const result = await db.pool.query("SELECT id, name, role, class FROM users WHERE name LIKE '%Ten%'");
        console.log(JSON.stringify(result.rows, null, 2));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
test();
