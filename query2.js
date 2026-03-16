const db = require('./backend/db');
db.query("SELECT id, name, email, phone, role, class, is_active, created_at FROM users WHERE role = $1 ORDER BY created_at DESC", ['student'])
  .then(([rows]) => { console.log(rows); process.exit(0); })
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); });
