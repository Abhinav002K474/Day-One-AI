const { Pool } = require('pg');
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString ? connectionString : undefined,
    host: connectionString ? undefined : (process.env.DB_HOST || "127.0.0.1"),
    user: connectionString ? undefined : (process.env.DB_USER || "postgres"),
    password: connectionString ? undefined : (process.env.DB_PASSWORD || ""),
    database: connectionString ? undefined : (process.env.DB_NAME || "school_db"),
    port: connectionString ? undefined : (process.env.DB_PORT || 5432),
    ssl: connectionString ? { rejectUnauthorized: false } : false, // Supabase requires SSL
    max: 10,
    idleTimeoutMillis: 30000,
    family: 4 // Force IPv4 to avoid Windows IPv6 resolution issues
});

// Test connection immediately
(async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Database (PostgreSQL) connected successfully");
        client.release();
    } catch (err) {
        console.error("❌ DB Connection Failed", err);
    }
})();

module.exports = {
    query: async (text, params) => {
        // Auto-convert MySQL-style '?' placeholders to PostgreSQL-style '$1', '$2'
        // Skip replacement if text already uses '$1' natively.
        let pgText = text;
        if (pgText && pgText.includes('?') && !pgText.includes('$1')) {
            let i = 1;
            let inString = false;
            let newText = '';
            for (let char of pgText) {
                if (char === "'") inString = !inString;
                if (char === '?' && !inString) {
                    newText += '$' + (i++);
                } else {
                    newText += char;
                }
            }
            pgText = newText;
        }

        const start = Date.now();
        const res = await pool.query(pgText, params);
        const duration = Date.now() - start;
        // console.log('executed query', { text: pgText, duration, rows: res.rowCount });

        // Return [rows, fields] to match mysql2 signature
        return [res.rows, res.fields];
    },
    pool
};

