const db = require('./db');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

(async () => {
    try {
        // Create Student
        const hash1 = await bcrypt.hash('Test@1234', 10);
        const r1 = await db.pool.query(
            `INSERT INTO users (name, email, password_hash, role, class, is_active)
             VALUES ($1, $2, $3, $4, $5, true)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
             RETURNING id, name, email, role`,
            ['Demo Student', 'student@demo.com', hash1, 'student', '10']
        );
        console.log('✅ Student user:', JSON.stringify(r1.rows[0]));

        // Create Teacher
        const hash2 = await bcrypt.hash('Teacher@1234', 10);
        const r2 = await db.pool.query(
            `INSERT INTO users (name, email, password_hash, role, is_active)
             VALUES ($1, $2, $3, $4, true)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
             RETURNING id, name, email, role`,
            ['Demo Teacher', 'teacher@demo.com', hash2, 'teacher']
        );
        console.log('✅ Teacher user:', JSON.stringify(r2.rows[0]));

        console.log('\n=== DEMO CREDENTIALS ===');
        console.log('Student → email: student@demo.com  | password: Test@1234');
        console.log('Teacher → email: teacher@demo.com  | password: Teacher@1234');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        process.exit(1);
    }
})();
