-- =============================================
-- HotelHub schema
-- Run against your own PostgreSQL database:
--   psql -U <user> -d <database> -f server/db/schema.sql
-- or: npm run setup  (from the server/ folder)
-- =============================================

-- Drop in dependent order so the script is safely re-runnable
DROP TABLE IF EXISTS hotels;

CREATE TABLE hotels (
  id          SERIAL PRIMARY KEY,
  image       TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude    NUMERIC(10, 7) NOT NULL,
  longitude   NUMERIC(10, 7) NOT NULL,
  price       NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes for the list endpoint (search + price filters + sorting)
CREATE INDEX idx_hotels_title    ON hotels (title);
CREATE INDEX idx_hotels_price    ON hotels (price);
CREATE INDEX idx_hotels_created  ON hotels (created_at DESC);
