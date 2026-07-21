const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || (isProduction ? '' : 'development-access-secret-change-me');
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (isProduction ? '' : 'development-refresh-secret-change-me');
const ACCESS_COOKIE = 'eventra_access';
const REFRESH_COOKIE = 'eventra_refresh';
const CSRF_COOKIE = 'eventra_csrf';

const cloudinaryConfigured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (cloudinaryConfigured) cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });

if (isProduction && (ACCESS_SECRET.length < 32 || REFRESH_SECRET.length < 32)) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured with at least 32 characters in production.');
}

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });

function cookieOptions({ httpOnly = true, maxAge } = {}) {
  return {
    httpOnly,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
    ...(maxAge ? { maxAge } : {}),
  };
}

function safeEqual(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getFirebaseAuth() {
  if (!getApps().length) {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
      const error = new Error('Firebase Admin credentials are not configured');
      error.code = 'FIREBASE_NOT_CONFIGURED';
      throw error;
    }
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getAuth();
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function serializeUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    emailVerified: row.email_verified,
    phone: row.phone,
    about: row.about,
    photo: row.photo,
    price: row.price,
  };
}

function createCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

function setSessionCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_COOKIE, accessToken, cookieOptions({ maxAge: 15 * 60 * 1000 }));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions({ maxAge: 7 * 24 * 60 * 60 * 1000 }));
  res.cookie(CSRF_COOKIE, createCsrfToken(), cookieOptions({ httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 }));
}

function clearSessionCookies(res) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE]) res.clearCookie(name, cookieOptions({ httpOnly: name !== CSRF_COOKIE }));
}

async function issueSession(res, user, req) {
  const sessionId = crypto.randomUUID();
  const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role, type: 'access' }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id, sid: sessionId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
  await db.query(
    `INSERT INTO auth_sessions (id, user_id, refresh_token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, now() + interval '7 days', $4, $5)`,
    [sessionId, user.id, hashToken(refreshToken), req.get('user-agent') || null, req.ip || null]
  );
  setSessionCookies(res, accessToken, refreshToken);
}

async function authenticate(req, res, next) {
  const bearer = req.get('authorization');
  const token = req.cookies[ACCESS_COOKIE] || (bearer?.startsWith('Bearer ') ? bearer.slice(7) : null);
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    if (payload.type !== 'access') throw new Error('Invalid token type');
    const result = await db.query(
      'SELECT id, email, name, role, email_verified, phone, about, photo, price FROM users WHERE id = $1',
      [payload.sub]
    );
    if (!result.rows[0]) return res.status(401).json({ error: 'Session user no longer exists' });
    req.user = serializeUser(result.rows[0]);
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    return next();
  };
}

function requireCsrf(req, res, next) {
  if (!safeEqual(req.cookies[CSRF_COOKIE], req.get('x-csrf-token'))) return res.status(403).json({ error: 'Invalid CSRF token' });
  return next();
}

function validRole(value) {
  return value === 'customer' || value === 'vendor';
}

function validEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function frontendUrl(path = '/') {
  return `${FRONTEND_ORIGINS[0]}${path}`;
}

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (_error) {
    res.status(503).json({ status: 'degraded' });
  }
});

app.post('/auth/signup', authLimiter, async (req, res, next) => {
  const { email, password, name, role = 'customer' } = req.body || {};
  if (!validEmail(email) || typeof password !== 'string' || password.length < 8 || !validRole(role)) {
    return res.status(400).json({ error: 'Provide a valid email, password of at least 8 characters, and customer or vendor role' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (email, password, name, role)
       VALUES (LOWER($1), $2, $3, $4)
       RETURNING id, email, name, role, email_verified, phone, about, photo, price`,
      [email.trim(), hashedPassword, typeof name === 'string' ? name.trim() || null : null, role]
    );
    const user = serializeUser(result.rows[0]);
    await issueSession(res, user, req);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists' });
    return next(error);
  }
});

app.post('/auth/login', authLimiter, async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!validEmail(email) || typeof password !== 'string') return res.status(400).json({ error: 'A valid email and password are required' });
  try {
    const result = await db.query(
      'SELECT id, email, password, name, role, email_verified, phone, about, photo, price FROM users WHERE email = LOWER($1)',
      [email.trim()]
    );
    const row = result.rows[0];
    if (!row?.password || !(await bcrypt.compare(password, row.password))) return res.status(401).json({ error: 'Invalid email or password' });
    const user = serializeUser(row);
    await issueSession(res, user, req);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

app.post('/auth/firebase', authLimiter, async (req, res, next) => {
  const { idToken, role = 'customer' } = req.body || {};
  if (typeof idToken !== 'string' || !validRole(role)) {
    return res.status(400).json({ error: 'A Firebase ID token and customer or vendor role are required' });
  }
  try {
    const decoded = await getFirebaseAuth().verifyIdToken(idToken, true);
    if (!decoded.uid || !decoded.email || !decoded.email_verified) {
      return res.status(401).json({ error: 'Use a Firebase account with a verified email address' });
    }

    const existing = await db.query(
      `SELECT id, email, name, role, email_verified, phone, about, photo, price, firebase_uid
       FROM users WHERE firebase_uid = $1 OR email = LOWER($2) ORDER BY firebase_uid = $1 DESC LIMIT 1`,
      [decoded.uid, decoded.email]
    );
    let row = existing.rows[0];
    if (row && row.firebase_uid && row.firebase_uid !== decoded.uid) {
      return res.status(409).json({ error: 'This email is already linked to a different Firebase account' });
    }
    if (row) {
      const linked = await db.query(
        `UPDATE users SET firebase_uid = $1, email_verified = TRUE,
         name = COALESCE(name, $2) WHERE id = $3
         RETURNING id, email, name, role, email_verified, phone, about, photo, price`,
        [decoded.uid, typeof decoded.name === 'string' ? decoded.name : null, row.id]
      );
      row = linked.rows[0];
    } else {
      const created = await db.query(
        `INSERT INTO users (email, password, name, role, firebase_uid, email_verified)
         VALUES (LOWER($1), NULL, $2, $3, $4, TRUE)
         RETURNING id, email, name, role, email_verified, phone, about, photo, price`,
        [decoded.email, typeof decoded.name === 'string' ? decoded.name : null, role, decoded.uid]
      );
      row = created.rows[0];
    }
    const user = serializeUser(row);
    await issueSession(res, user, req);
    return res.json({ user });
  } catch (error) {
    if (error.code === 'FIREBASE_NOT_CONFIGURED') return res.status(503).json({ error: 'Firebase login is not configured' });
    if (error.code === 'auth/id-token-expired') return res.status(401).json({ error: 'Firebase token has expired. Sign in with Google again.' });
    if (error.code === 'auth/id-token-revoked') return res.status(401).json({ error: 'Firebase session has been revoked. Sign in with Google again.' });
    if (error.code && String(error.code).startsWith('auth/')) return res.status(401).json({ error: 'Firebase authentication failed. Sign in with Google again.' });
    return next(error);
  }
});

app.post('/auth/refresh', async (req, res, next) => {
  const token = req.cookies[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ error: 'Refresh session required' });
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    if (payload.type !== 'refresh') throw new Error('Invalid token type');
    const session = await db.query(
      `SELECT s.id, s.user_id FROM auth_sessions s
       WHERE s.id = $1 AND s.user_id = $2 AND s.refresh_token_hash = $3
         AND s.revoked_at IS NULL AND s.expires_at > now()`,
      [payload.sid, payload.sub, hashToken(token)]
    );
    if (!session.rows[0]) return res.status(401).json({ error: 'Refresh session is invalid' });
    const users = await db.query('SELECT id, email, name, role, email_verified, phone, about, photo, price FROM users WHERE id = $1', [payload.sub]);
    if (!users.rows[0]) return res.status(401).json({ error: 'Session user no longer exists' });
    await db.query('UPDATE auth_sessions SET revoked_at = now(), last_used_at = now() WHERE id = $1', [payload.sid]);
    const user = serializeUser(users.rows[0]);
    await issueSession(res, user, req);
    return res.json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Refresh session is invalid' });
    return next(error);
  }
});

app.post('/auth/logout', requireCsrf, async (req, res) => {
  const token = req.cookies[REFRESH_COOKIE];
  if (token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);
      if (payload.type === 'refresh') await db.query('UPDATE auth_sessions SET revoked_at = now() WHERE id = $1 AND user_id = $2', [payload.sid, payload.sub]);
    } catch (_error) {
      // Cookies are cleared even if an already-expired token is supplied.
    }
  }
  clearSessionCookies(res);
  return res.status(204).send();
});

app.get('/me', authenticate, (req, res) => res.json({ user: req.user }));

app.get('/api/profile', authenticate, (req, res) => res.json({ user: req.user }));

async function updateProfile(req, res, next) {
  const { name, phone, about, photo, price } = req.body || {};
  if ([name, phone, about, photo, price].some((value) => value !== undefined && (typeof value !== 'string' || value.length > 5000))) {
    return res.status(400).json({ error: 'Profile fields must be strings within allowed limits' });
  }
  try {
    const result = await db.query(
      `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone),
       about = COALESCE($3, about), photo = COALESCE($4, photo), price = COALESCE($5, price)
       WHERE id = $6
       RETURNING id, email, name, role, email_verified, phone, about, photo, price`,
      [name, phone, about, photo, price, req.user.id]
    );
    return res.json({ user: serializeUser(result.rows[0]) });
  } catch (error) {
    return next(error);
  }
}

app.patch('/api/profile', authenticate, requireCsrf, updateProfile);

app.post('/api/profile', authenticate, requireCsrf, updateProfile);

function parsePositiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
}

function validMoney(value) {
  return Number.isInteger(value) && value >= 0 && value <= 1000000000;
}

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'eventra/vendor-services', resource_type: 'image', transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] }, (error, result) => error ? reject(error) : resolve(result));
    stream.end(buffer);
  });
}

async function vendorProfileForUser(userId) {
  const result = await db.query(
    `SELECT vp.id, vp.business_name, vp.slug, vp.city, vp.state, vp.description, vp.phone, vp.avatar_url,
      vp.price_from_minor, vp.approval_status, vc.name AS category_name, vc.slug AS category_slug
     FROM vendor_profiles vp LEFT JOIN vendor_categories vc ON vc.id = vp.category_id WHERE vp.user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

function serializeVendorProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    businessName: row.business_name,
    slug: row.slug,
    city: row.city,
    state: row.state,
    description: row.description,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    priceFromMinor: row.price_from_minor,
    approvalStatus: row.approval_status,
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  };
}

app.get('/api/categories', async (_req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, slug FROM vendor_categories WHERE is_active = TRUE ORDER BY name');
    return res.json({ categories: result.rows });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/vendors', async (req, res, next) => {
  const page = parsePositiveInteger(req.query.page, 1, 10000);
  const limit = parsePositiveInteger(req.query.limit, 12, 50);
  const offset = (page - 1) * limit;
  const values = [];
  const filters = ["vp.approval_status = 'approved'"];
  if (typeof req.query.search === 'string' && req.query.search.trim()) {
    values.push(`%${req.query.search.trim()}%`);
    filters.push(`(vp.business_name ILIKE $${values.length} OR vp.description ILIKE $${values.length})`);
  }
  if (typeof req.query.category === 'string' && req.query.category.trim()) {
    values.push(req.query.category.trim());
    filters.push(`vc.slug = $${values.length}`);
  }
  if (typeof req.query.city === 'string' && req.query.city.trim()) {
    values.push(req.query.city.trim());
    filters.push(`vp.city ILIKE $${values.length}`);
  }
  const sort = req.query.sort === 'price_asc' ? 'price_from_minor ASC NULLS LAST, business_name ASC' : 'business_name ASC';
  try {
    const where = filters.join(' AND ');
    const total = await db.query(`SELECT COUNT(*)::int AS count FROM vendor_profiles vp LEFT JOIN vendor_categories vc ON vc.id = vp.category_id WHERE ${where}`, values);
    values.push(limit, offset);
    const result = await db.query(
      `SELECT vp.id, vp.slug, vp.business_name, vp.city, vp.state, vp.description, vp.avatar_url, vp.price_from_minor,
        vc.name AS category_name, vc.slug AS category_slug
       FROM vendor_profiles vp LEFT JOIN vendor_categories vc ON vc.id = vp.category_id
       WHERE ${where} ORDER BY ${sort} LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return res.json({ vendors: result.rows.map(serializeVendorProfile), pagination: { page, limit, total: total.rows[0].count } });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/vendors/:slug', async (req, res, next) => {
  try {
    const profile = await db.query(
      `SELECT vp.id, vp.business_name, vp.slug, vp.city, vp.state, vp.description, vp.phone, vp.avatar_url, vp.price_from_minor,
        vp.approval_status, vc.name AS category_name, vc.slug AS category_slug
       FROM vendor_profiles vp LEFT JOIN vendor_categories vc ON vc.id = vp.category_id
       WHERE vp.slug = $1 AND vp.approval_status = 'approved'`,
      [req.params.slug]
    );
    if (!profile.rows[0]) return res.status(404).json({ error: 'Vendor not found' });
    const services = await db.query(
      `SELECT id, name, description, price_from_minor FROM vendor_services
       WHERE vendor_id = $1 AND is_active = TRUE ORDER BY created_at`, [profile.rows[0].id]
    );
    const serviceIds = services.rows.map((service) => service.id);
    const [packages, images] = serviceIds.length ? await Promise.all([
      db.query('SELECT id, service_id, name, description, price_minor FROM service_packages WHERE service_id = ANY($1::int[]) ORDER BY id', [serviceIds]),
      db.query('SELECT id, service_id, url, alt_text, sort_order FROM service_images WHERE service_id = ANY($1::int[]) ORDER BY sort_order, id', [serviceIds]),
    ]) : [{ rows: [] }, { rows: [] }];
    const reviews = await db.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS customer_name
       FROM reviews r JOIN users u ON u.id = r.customer_id
       WHERE r.vendor_id = $1 AND r.status = 'published' ORDER BY r.created_at DESC LIMIT 20`,
      [profile.rows[0].id]
    );
    const detail = serializeVendorProfile(profile.rows[0]);
    detail.services = services.rows.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      priceFromMinor: service.price_from_minor,
      packages: packages.rows.filter((item) => item.service_id === service.id).map((item) => ({ id: item.id, name: item.name, description: item.description, priceMinor: item.price_minor })),
      images: images.rows.filter((item) => item.service_id === service.id).map((item) => ({ id: item.id, url: item.url, altText: item.alt_text })),
    }));
    detail.reviews = reviews.rows.map((review) => ({ id: review.id, rating: review.rating, comment: review.comment, customerName: review.customer_name, createdAt: review.created_at }));
    return res.json({ vendor: detail });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/vendor/profile', authenticate, authorize('vendor'), async (req, res, next) => {
  try {
    return res.json({ vendor: serializeVendorProfile(await vendorProfileForUser(req.user.id)) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/vendor/profile', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  const { businessName, categorySlug, city, description = '', phone = null, avatarUrl = null, priceFromMinor = null } = req.body || {};
  if (typeof businessName !== 'string' || !slugify(businessName) || typeof categorySlug !== 'string' || typeof city !== 'string' || !city.trim() || typeof description !== 'string' || (priceFromMinor !== null && !validMoney(priceFromMinor))) {
    return res.status(400).json({ error: 'Business name, category, city, description, and valid price are required' });
  }
  try {
    const category = await db.query('SELECT id FROM vendor_categories WHERE slug = $1 AND is_active = TRUE', [categorySlug]);
    if (!category.rows[0]) return res.status(400).json({ error: 'Invalid vendor category' });
    const slug = `${slugify(businessName)}-${req.user.id}`;
    const result = await db.query(
      `INSERT INTO vendor_profiles (user_id, category_id, business_name, slug, city, description, phone, avatar_url, price_from_minor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO UPDATE SET category_id = EXCLUDED.category_id, business_name = EXCLUDED.business_name,
         city = EXCLUDED.city, description = EXCLUDED.description, phone = EXCLUDED.phone, avatar_url = EXCLUDED.avatar_url,
         price_from_minor = EXCLUDED.price_from_minor, updated_at = now()
       RETURNING id`,
      [req.user.id, category.rows[0].id, businessName.trim(), slug, city.trim(), description.trim(), phone, avatarUrl, priceFromMinor]
    );
    return res.status(201).json({ vendor: serializeVendorProfile(await vendorProfileForUser(req.user.id)), created: Boolean(result.rows[0]) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/vendor/services', authenticate, authorize('vendor'), async (req, res, next) => {
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.json({ services: [] });
    const result = await db.query('SELECT id, name, description, price_from_minor, is_active FROM vendor_services WHERE vendor_id = $1 ORDER BY created_at DESC', [profile.id]);
    return res.json({ services: result.rows.map((service) => ({ id: service.id, name: service.name, description: service.description, priceFromMinor: service.price_from_minor, isActive: service.is_active })) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/vendor/services', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  const { name, description = '', priceFromMinor } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof description !== 'string' || !validMoney(priceFromMinor)) return res.status(400).json({ error: 'Service name, description, and valid price are required' });
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(409).json({ error: 'Complete your vendor profile before adding services' });
    const result = await db.query('INSERT INTO vendor_services (vendor_id, name, description, price_from_minor) VALUES ($1, $2, $3, $4) RETURNING id, name, description, price_from_minor, is_active', [profile.id, name.trim(), description.trim(), priceFromMinor]);
    const service = result.rows[0];
    return res.status(201).json({ service: { id: service.id, name: service.name, description: service.description, priceFromMinor: service.price_from_minor, isActive: service.is_active } });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A service with this name already exists' });
    return next(error);
  }
});

app.post('/api/vendor/services/:id/images', authenticate, authorize('vendor'), requireCsrf, upload.single('image'), async (req, res, next) => {
  if (!cloudinaryConfigured) return res.status(503).json({ error: 'Image uploads are not configured' });
  if (!req.file) return res.status(400).json({ error: 'Upload a JPEG, PNG, or WebP image up to 5MB' });
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' });
    const service = await db.query('SELECT id FROM vendor_services WHERE id = $1 AND vendor_id = $2', [req.params.id, profile.id]);
    if (!service.rows[0]) return res.status(404).json({ error: 'Service not found' });
    const uploaded = await uploadImage(req.file.buffer);
    const image = await db.query('INSERT INTO service_images (service_id, url, alt_text) VALUES ($1, $2, $3) RETURNING id, url, alt_text', [service.rows[0].id, uploaded.secure_url, typeof req.body.altText === 'string' ? req.body.altText.slice(0, 200) : null]);
    return res.status(201).json({ image: { id: image.rows[0].id, url: image.rows[0].url, altText: image.rows[0].alt_text } });
  } catch (error) { return next(error); }
});

app.post('/api/vendor/profile/image', authenticate, authorize('vendor'), requireCsrf, upload.single('image'), async (req, res, next) => {
  if (!cloudinaryConfigured) return res.status(503).json({ error: 'Image uploads are not configured' });
  if (!req.file) return res.status(400).json({ error: 'Upload a JPEG, PNG, or WebP image up to 5MB' });
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(409).json({ error: 'Complete your vendor profile before uploading an image' });
    const uploaded = await uploadImage(req.file.buffer);
    await db.query('UPDATE vendor_profiles SET avatar_url = $1, updated_at = now() WHERE id = $2', [uploaded.secure_url, profile.id]);
    return res.json({ url: uploaded.secure_url });
  } catch (error) { return next(error); }
});

app.patch('/api/vendor/services/:id', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  const { name, description, priceFromMinor, isActive } = req.body || {};
  if ((name !== undefined && (typeof name !== 'string' || !name.trim())) || (description !== undefined && typeof description !== 'string') || (priceFromMinor !== undefined && !validMoney(priceFromMinor)) || (isActive !== undefined && typeof isActive !== 'boolean')) return res.status(400).json({ error: 'Invalid service update' });
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' });
    const result = await db.query(
      `UPDATE vendor_services SET name = COALESCE($1, name), description = COALESCE($2, description),
       price_from_minor = COALESCE($3, price_from_minor), is_active = COALESCE($4, is_active), updated_at = now()
       WHERE id = $5 AND vendor_id = $6 RETURNING id, name, description, price_from_minor, is_active`,
      [name?.trim(), description?.trim(), priceFromMinor, isActive, req.params.id, profile.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Service not found' });
    const service = result.rows[0];
    return res.json({ service: { id: service.id, name: service.name, description: service.description, priceFromMinor: service.price_from_minor, isActive: service.is_active } });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/vendor/services/:id', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' });
    const result = await db.query('DELETE FROM vendor_services WHERE id = $1 AND vendor_id = $2 RETURNING id', [req.params.id, profile.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Service not found' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

function validEventDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function serializeBooking(row) {
  return {
    id: row.id,
    status: row.status,
    eventDate: row.event_date,
    eventLocation: row.event_location,
    guestCount: row.guest_count,
    customerMessage: row.customer_message,
    vendorResponse: row.vendor_response,
    quotedPriceMinor: row.quoted_price_minor,
    createdAt: row.created_at,
    customer: row.customer_id ? { id: row.customer_id, name: row.customer_name, email: row.customer_email } : undefined,
    vendor: { id: row.vendor_id, businessName: row.business_name, slug: row.vendor_slug, city: row.vendor_city },
    service: { id: row.service_id, name: row.service_name },
  };
}

async function bookingsFor(where, values) {
  const result = await db.query(
    `SELECT b.id, b.customer_id, b.vendor_id, b.service_id, b.event_date, b.event_location, b.guest_count,
      b.customer_message, b.vendor_response, b.quoted_price_minor, b.status, b.created_at,
      u.name AS customer_name, u.email AS customer_email, vp.business_name, vp.slug AS vendor_slug, vp.city AS vendor_city,
      vs.name AS service_name
     FROM bookings b
     JOIN users u ON u.id = b.customer_id
     JOIN vendor_profiles vp ON vp.id = b.vendor_id
     JOIN vendor_services vs ON vs.id = b.service_id
     WHERE ${where} ORDER BY b.event_date ASC, b.created_at DESC`,
    values
  );
  return result.rows.map(serializeBooking);
}

app.get('/api/vendors/:slug/availability', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT va.id, va.starts_at, va.ends_at, va.is_available
       FROM vendor_availability va JOIN vendor_profiles vp ON vp.id = va.vendor_id
       WHERE vp.slug = $1 AND vp.approval_status = 'approved' ORDER BY va.starts_at`,
      [req.params.slug]
    );
    return res.json({ availability: result.rows.map((slot) => ({ id: slot.id, startsAt: slot.starts_at, endsAt: slot.ends_at, isAvailable: slot.is_available })) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/vendor/availability', authenticate, authorize('vendor'), async (req, res, next) => {
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.json({ availability: [] });
    const result = await db.query('SELECT id, starts_at, ends_at, is_available FROM vendor_availability WHERE vendor_id = $1 ORDER BY starts_at', [profile.id]);
    return res.json({ availability: result.rows.map((slot) => ({ id: slot.id, startsAt: slot.starts_at, endsAt: slot.ends_at, isAvailable: slot.is_available })) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/vendor/availability', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  const { startsAt, endsAt, isAvailable = false } = req.body || {};
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start || typeof isAvailable !== 'boolean') return res.status(400).json({ error: 'Provide a valid availability range' });
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(409).json({ error: 'Complete your vendor profile first' });
    const result = await db.query('INSERT INTO vendor_availability (vendor_id, starts_at, ends_at, is_available) VALUES ($1, $2, $3, $4) RETURNING id, starts_at, ends_at, is_available', [profile.id, start, end, isAvailable]);
    const slot = result.rows[0];
    return res.status(201).json({ availability: { id: slot.id, startsAt: slot.starts_at, endsAt: slot.ends_at, isAvailable: slot.is_available } });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/vendor/availability/:id', authenticate, authorize('vendor'), requireCsrf, async (req, res, next) => {
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' });
    const result = await db.query('DELETE FROM vendor_availability WHERE id = $1 AND vendor_id = $2 RETURNING id', [req.params.id, profile.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Availability slot not found' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.post('/api/bookings', authenticate, authorize('customer'), requireCsrf, async (req, res, next) => {
  const { serviceId, eventDate, eventLocation, guestCount = null, message = '' } = req.body || {};
  if (!Number.isInteger(serviceId) || !validEventDate(eventDate) || typeof eventLocation !== 'string' || !eventLocation.trim() || (guestCount !== null && (!Number.isInteger(guestCount) || guestCount < 1)) || typeof message !== 'string' || message.length > 2000) {
    return res.status(400).json({ error: 'Provide a service, valid event date, location, guest count, and message' });
  }
  if (new Date(`${eventDate}T00:00:00Z`) < new Date(new Date().toISOString().slice(0, 10))) return res.status(400).json({ error: 'Event date must be in the future' });
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const serviceResult = await client.query(
      `SELECT vs.id, vs.vendor_id, vs.price_from_minor, vp.business_name, vp.slug, vp.city
       FROM vendor_services vs JOIN vendor_profiles vp ON vp.id = vs.vendor_id
       WHERE vs.id = $1 AND vs.is_active = TRUE AND vp.approval_status = 'approved' FOR SHARE`,
      [serviceId]
    );
    const service = serviceResult.rows[0];
    if (!service) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Service not found' }); }
    const blocked = await client.query(
      `SELECT 1 FROM vendor_availability WHERE vendor_id = $1 AND is_available = FALSE
       AND starts_at < ($2::date + interval '1 day') AND ends_at > $2::date LIMIT 1`,
      [service.vendor_id, eventDate]
    );
    if (blocked.rows[0]) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Vendor is unavailable on this date' }); }
    const booking = await client.query(
      `INSERT INTO bookings (customer_id, vendor_id, service_id, event_date, event_location, guest_count, customer_message, quoted_price_minor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, customer_id, vendor_id, service_id, event_date, event_location, guest_count, customer_message, vendor_response, quoted_price_minor, status, created_at`,
      [req.user.id, service.vendor_id, service.id, eventDate, eventLocation.trim(), guestCount, message.trim(), service.price_from_minor]
    );
    await client.query('INSERT INTO booking_status_history (booking_id, actor_id, next_status, note) VALUES ($1, $2, $3, $4)', [booking.rows[0].id, req.user.id, 'pending', 'Booking requested']);
    await client.query('COMMIT');
    return res.status(201).json({ booking: { ...serializeBooking({ ...booking.rows[0], business_name: service.business_name, vendor_slug: service.slug, vendor_city: service.city, service_name: null }), service: { id: service.id } } });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') return res.status(409).json({ error: 'An identical booking request already exists. Check My Bookings before trying again.' });
    return next(error);
  } finally {
    client.release();
  }
});

app.get('/api/customer/bookings', authenticate, authorize('customer'), async (req, res, next) => {
  try { return res.json({ bookings: await bookingsFor('b.customer_id = $1', [req.user.id]) }); }
  catch (error) { return next(error); }
});

app.get('/api/vendor/bookings', authenticate, authorize('vendor'), async (req, res, next) => {
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.json({ bookings: [] });
    return res.json({ bookings: await bookingsFor('b.vendor_id = $1', [profile.id]) });
  } catch (error) { return next(error); }
});

async function changeVendorBookingStatus(req, res, next, nextStatus) {
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 1000) : null;
  try {
    const profile = await vendorProfileForUser(req.user.id);
    if (!profile) return res.status(404).json({ error: 'Vendor profile not found' });
    const allowedPrevious = nextStatus === 'completed' ? 'confirmed' : 'pending';
    const updated = await db.query(
      `UPDATE bookings SET status = $1, vendor_response = COALESCE($2, vendor_response), updated_at = now()
       WHERE id = $3 AND vendor_id = $4 AND status = $5
       RETURNING id`, [nextStatus, note, req.params.id, profile.id, allowedPrevious]
    );
    if (!updated.rows[0]) return res.status(409).json({ error: 'Booking cannot transition to this status' });
    await db.query('INSERT INTO booking_status_history (booking_id, actor_id, previous_status, next_status, note) VALUES ($1, $2, $3, $4, $5)', [req.params.id, req.user.id, allowedPrevious, nextStatus, note]);
    const bookings = await bookingsFor('b.id = $1', [req.params.id]);
    return res.json({ booking: bookings[0] });
  } catch (error) { return next(error); }
}

app.post('/api/vendor/bookings/:id/accept', authenticate, authorize('vendor'), requireCsrf, (req, res, next) => changeVendorBookingStatus(req, res, next, 'confirmed'));
app.post('/api/vendor/bookings/:id/reject', authenticate, authorize('vendor'), requireCsrf, (req, res, next) => changeVendorBookingStatus(req, res, next, 'rejected'));
app.post('/api/vendor/bookings/:id/complete', authenticate, authorize('vendor'), requireCsrf, (req, res, next) => changeVendorBookingStatus(req, res, next, 'completed'));

app.post('/api/bookings/:id/review', authenticate, authorize('customer'), requireCsrf, async (req, res, next) => {
  const { rating, comment } = req.body || {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || typeof comment !== 'string' || comment.trim().length < 10 || comment.trim().length > 2000) return res.status(400).json({ error: 'Provide a rating from 1 to 5 and a review between 10 and 2000 characters' });
  try {
    const booking = await db.query('SELECT id, vendor_id FROM bookings WHERE id = $1 AND customer_id = $2 AND status = $3', [req.params.id, req.user.id, 'completed']);
    if (!booking.rows[0]) return res.status(409).json({ error: 'Only completed bookings can be reviewed' });
    const result = await db.query('INSERT INTO reviews (booking_id, customer_id, vendor_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING id, rating, comment, created_at', [booking.rows[0].id, req.user.id, booking.rows[0].vendor_id, rating, comment.trim()]);
    return res.status(201).json({ review: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A review already exists for this booking' });
    return next(error);
  }
});

async function auditAdminAction(adminId, action, entityType, entityId, details) {
  await db.query('INSERT INTO admin_audit_logs (admin_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)', [adminId, action, entityType, String(entityId), JSON.stringify(details || {})]);
}

app.get('/api/admin/dashboard', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const [users, vendors, bookings] = await Promise.all([
      db.query(`SELECT role, COUNT(*)::int AS count FROM users GROUP BY role`),
      db.query(`SELECT approval_status, COUNT(*)::int AS count FROM vendor_profiles GROUP BY approval_status`),
      db.query(`SELECT status, COUNT(*)::int AS count FROM bookings GROUP BY status`),
    ]);
    return res.json({ users: users.rows, vendors: vendors.rows, bookings: bookings.rows });
  } catch (error) { return next(error); }
});

app.get('/api/admin/users', authenticate, authorize('admin'), async (req, res, next) => {
  const limit = parsePositiveInteger(req.query.limit, 50, 100);
  try {
    const result = await db.query('SELECT id, email, name, role, email_verified, created_at FROM users ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.json({ users: result.rows.map((user) => ({ id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.email_verified, createdAt: user.created_at })) });
  } catch (error) { return next(error); }
});

app.get('/api/admin/vendors', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const result = await db.query(
      `SELECT vp.id, vp.business_name, vp.slug, vp.city, vp.approval_status, vp.created_at,
       u.email, u.name AS owner_name, vc.name AS category_name
       FROM vendor_profiles vp JOIN users u ON u.id = vp.user_id LEFT JOIN vendor_categories vc ON vc.id = vp.category_id
       ORDER BY CASE vp.approval_status WHEN 'pending' THEN 0 ELSE 1 END, vp.created_at DESC`
    );
    return res.json({ vendors: result.rows.map((vendor) => ({ id: vendor.id, businessName: vendor.business_name, slug: vendor.slug, city: vendor.city, approvalStatus: vendor.approval_status, email: vendor.email, ownerName: vendor.owner_name, categoryName: vendor.category_name, createdAt: vendor.created_at })) });
  } catch (error) { return next(error); }
});

async function setVendorApproval(req, res, next, status) {
  try {
    const result = await db.query('UPDATE vendor_profiles SET approval_status = $1, updated_at = now() WHERE id = $2 RETURNING id, business_name, approval_status', [status, req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Vendor not found' });
    await auditAdminAction(req.user.id, `vendor.${status}`, 'vendor_profile', result.rows[0].id, { businessName: result.rows[0].business_name });
    return res.json({ vendor: { id: result.rows[0].id, businessName: result.rows[0].business_name, approvalStatus: result.rows[0].approval_status } });
  } catch (error) { return next(error); }
}

app.post('/api/admin/vendors/:id/approve', authenticate, authorize('admin'), requireCsrf, (req, res, next) => setVendorApproval(req, res, next, 'approved'));
app.post('/api/admin/vendors/:id/reject', authenticate, authorize('admin'), requireCsrf, (req, res, next) => setVendorApproval(req, res, next, 'rejected'));

app.get('/api/admin/bookings', authenticate, authorize('admin'), async (_req, res, next) => {
  try { return res.json({ bookings: await bookingsFor('TRUE', []) }); }
  catch (error) { return next(error); }
});

app.get('/api/admin/reports/bookings', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const bookings = await bookingsFor('TRUE', []);
    const header = 'id,customer,vendor,service,event_date,status,quoted_price_minor';
    const rows = bookings.map((booking) => [booking.id, booking.customer?.email || '', booking.vendor.businessName, booking.service.name || '', booking.eventDate, booking.status, booking.quotedPriceMinor].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));
    res.type('text/csv').attachment('eventra-bookings.csv').send([header, ...rows].join('\n'));
  } catch (error) { return next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.message === 'Origin is not allowed by CORS') return res.status(403).json({ error: 'Origin is not allowed' });
  if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Image must be 5MB or smaller' });
  return res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));

module.exports = { app, authenticate, authorize };
