INSERT INTO vendor_categories (name, slug)
VALUES
  ('Caterer', 'caterer'),
  ('Decorator', 'decorator'),
  ('DJ', 'dj'),
  ('Makeup Artist', 'makeup-artist'),
  ('Mehendi Artist', 'mehendi-artist'),
  ('Photographer', 'photographer'),
  ('Venue', 'venue')
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  is_active = TRUE;
