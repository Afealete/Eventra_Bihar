const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();

const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!email && !password) {
  console.log('Admin bootstrap skipped because BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are not set.');
  process.exit(0);
}

if (!email || !password || password.length < 12) {
  console.error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters.');
  process.exit(1);
}

(async () => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db.query('SELECT id, role FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows[0]?.role === 'admin') {
      await db.query(
        'UPDATE users SET password = $1, email_verified = TRUE WHERE id = $2',
        [passwordHash, existing.rows[0].id]
      );
      console.log(`Admin credentials synchronized for ${normalizedEmail}`);
      return;
    }
    if (existing.rows[0]) {
      throw new Error('Bootstrap email already belongs to a non-admin account. Choose a different bootstrap email.');
    }
    await db.query(
      `INSERT INTO users (email, password, role, email_verified)
       VALUES ($1, $2, 'admin', TRUE)`,
      [normalizedEmail, passwordHash]
    );
    console.log(`Admin account created for ${normalizedEmail}`);
  } finally {
    await db.pool.end();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
