const db = require('./db');

async function fixSchema() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS assessments (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                class VARCHAR(50) NOT NULL,
                teacher_id INT,
                duration_minutes INT DEFAULT 30,
                status VARCHAR(20) DEFAULT 'DRAFT',
                date VARCHAR(50),
                start_time VARCHAR(50),
                end_time VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS assessment_questions (
                assessment_id INT,
                question_id INT
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS assessment_results (
                id SERIAL PRIMARY KEY,
                student_id INT,
                assessment_id INT,
                score INT,
                total_questions INT,
                percentage DECIMAL(5,2),
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Schema updated in Supabase.");
    } catch (err) {
        console.error("❌ Error updating schema:", err);
    } finally {
        process.exit();
    }
}

fixSchema();
