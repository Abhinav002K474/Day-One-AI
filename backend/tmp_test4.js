const db = require('./db');
async function fixDB() {
    try {
        await db.query("UPDATE users SET class = '10' WHERE role = 'student' AND (class IS NULL OR class = 'null')");
        console.log('Users fixed globally!');
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
fixDB();
