-- A customer should not accidentally create the same request twice for the
-- same vendor service, date, and venue. The booking route derives all of
-- these values server-side before insert.
CREATE UNIQUE INDEX bookings_customer_service_date_location_unique_idx
  ON bookings (customer_id, service_id, event_date, event_location);
