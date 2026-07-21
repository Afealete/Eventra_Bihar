const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();

const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!email || !password || password.length < 12) {
  console.error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters.');
  process.exit(1);
}

(async () => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (email, password, role, email_verified)
       VALUES (LOWER($1), $2, 'admin', TRUE)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email.trim(), passwordHash]
    );
    if (result.rows[0]) {
      console.log(`Admin account created for ${email.trim().toLowerCase()}`);
      return;
    }
    const existing = await db.query('SELECT role FROM users WHERE email = LOWER($1)', [email.trim()]);
    if (existing.rows[0]?.role === 'admin') {
      console.log(`Admin account already exists for ${email.trim().toLowerCase()}`);
      return;
    }
    throw new Error('Bootstrap email already belongs to a non-admin account. Choose a different bootstrap email.');
  } finally {
    await db.pool.end();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
