const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  console.error('Demo seed data cannot run in production.');
  process.exit(1);
}

const categories = [
  ['Photographer', 'photographer'],
  ['Venue', 'venue'],
  ['Caterer', 'caterer'],
  ['Decorator', 'decorator'],
];

const vendors = [
  { email: 'dream@example.com', name: 'Dream Weddings Photography', slug: 'dream-weddings-photography', category: 'photographer', city: 'Patna', description: 'Wedding photography and cinematic films across Bihar.', price: 2000000, service: 'Wedding Photography', serviceDescription: 'Full-day wedding photography coverage.', image: '/photography.jpg' },
  { email: 'royal@example.com', name: 'Royal Banquet Hall', slug: 'royal-banquet-hall', category: 'venue', city: 'Gaya', description: 'A spacious banquet venue for weddings and receptions.', price: 10000000, service: 'Banquet Venue', serviceDescription: 'Venue rental with event coordination.', image: '/venue.jpeg' },
  { email: 'floral@example.com', name: 'Floral Decorators', slug: 'floral-decorators', category: 'decorator', city: 'Muzaffarpur', description: 'Custom floral and wedding decor packages.', price: 1500000, service: 'Wedding Decoration', serviceDescription: 'Theme-based floral and stage decor.', image: '/decorator.jpg' },
];

(async () => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    for (const [name, slug] of categories) {
      await client.query('INSERT INTO vendor_categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING', [name, slug]);
    }
    const passwordHash = await bcrypt.hash('DemoVendorPassword123!', 12);
    for (const vendor of vendors) {
      const userResult = await client.query(
        `INSERT INTO users (email, password, name, role, email_verified)
         VALUES ($1, $2, $3, 'vendor', TRUE)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = 'vendor'
         RETURNING id`,
        [vendor.email, passwordHash, vendor.name]
      );
      const category = await client.query('SELECT id FROM vendor_categories WHERE slug = $1', [vendor.category]);
      const profile = await client.query(
        `INSERT INTO vendor_profiles (user_id, category_id, business_name, slug, city, description, avatar_url, price_from_minor, approval_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved')
         ON CONFLICT (user_id) DO UPDATE SET category_id = EXCLUDED.category_id, business_name = EXCLUDED.business_name, slug = EXCLUDED.slug,
           city = EXCLUDED.city, description = EXCLUDED.description, avatar_url = EXCLUDED.avatar_url, price_from_minor = EXCLUDED.price_from_minor, approval_status = 'approved'
         RETURNING id`,
        [userResult.rows[0].id, category.rows[0].id, vendor.name, vendor.slug, vendor.city, vendor.description, vendor.image, vendor.price]
      );
      const service = await client.query(
        `INSERT INTO vendor_services (vendor_id, name, description, price_from_minor)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (vendor_id, name) DO UPDATE SET description = EXCLUDED.description, price_from_minor = EXCLUDED.price_from_minor
         RETURNING id`,
        [profile.rows[0].id, vendor.service, vendor.serviceDescription, vendor.price]
      );
      if (service.rows[0]) {
        await client.query('DELETE FROM service_images WHERE service_id = $1', [service.rows[0].id]);
        await client.query('INSERT INTO service_images (service_id, url, alt_text) VALUES ($1, $2, $3)', [service.rows[0].id, vendor.image, vendor.name]);
      }
    }
    await client.query('COMMIT');
    console.log('Demo vendor catalog seeded. Demo vendor password: DemoVendorPassword123!');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
