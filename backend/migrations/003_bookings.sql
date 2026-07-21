CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  vendor_id INTEGER NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
  service_id INTEGER NOT NULL REFERENCES vendor_services(id) ON DELETE RESTRICT,
  event_date DATE NOT NULL,
  event_location TEXT NOT NULL,
  guest_count INTEGER CHECK (guest_count IS NULL OR guest_count > 0),
  customer_message TEXT NOT NULL DEFAULT '',
  vendor_response TEXT,
  quoted_price_minor INTEGER NOT NULL CHECK (quoted_price_minor >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX bookings_customer_created_idx ON bookings (customer_id, created_at DESC);
CREATE INDEX bookings_vendor_status_date_idx ON bookings (vendor_id, status, event_date);
CREATE INDEX bookings_service_id_idx ON bookings (service_id);

CREATE TABLE booking_status_history (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  actor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  previous_status TEXT,
  next_status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX booking_status_history_booking_idx ON booking_status_history (booking_id, created_at);
