/*
# EMBER & BEAN — Full Restaurant Schema

1. Purpose
   Complete database for a premium restaurant website with admin dashboard.
   Includes menu management, reservations, orders, offers, gallery, reviews,
   restaurant settings, SEO settings, and social links.

2. Tables Created
   - restaurant_settings (singleton config row)
   - seo_settings (singleton config row)
   - menu_categories (lookup table for menu categories)
   - menu_items (individual dishes)
   - reservations (table booking requests)
   - orders (WhatsApp-order cart snapshots)
   - offers (promotions with active/expiry logic)
   - gallery (image collection for the gallery section)
   - reviews (customer testimonials)
   - social_links (social media URLs)

3. Auth / Admin
   The admin dashboard is protected by Supabase email/password auth.
   Policies for admin-only tables (reservations, orders, menu CRUD, offers CRUD,
   gallery CRUD, reviews CRUD, settings) are scoped to `authenticated`.
   Public-readable tables (menu_items, offers, gallery, reviews, restaurant_settings,
   seo_settings, social_links, menu_categories) also allow `anon` SELECT so the
   public website renders without login.
   Write operations on admin tables are restricted to `authenticated`.

4. Notes
   - All tables use uuid primary keys with gen_random_uuid().
   - Timestamps are timestamptz with DEFAULT now().
   - Idempotent statements (IF NOT EXISTS, DROP POLICY IF EXISTS).
*/

-- ============ restaurant_settings ============
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'EMBER & BEAN',
  tagline text NOT NULL DEFAULT 'CRAFTED WITH PASSION. SERVED WITH SOUL.',
  cuisine text NOT NULL DEFAULT 'Modern European • Artisan Coffee',
  phone text NOT NULL DEFAULT '+91 98765 43210',
  whatsapp text NOT NULL DEFAULT '919876543210',
  email text NOT NULL DEFAULT 'hello@emberandbean.com',
  address text NOT NULL DEFAULT '123 MG Road, Pune, Maharashtra 411001',
  maps_url text NOT NULL DEFAULT 'https://maps.google.com/?q=Pune',
  latitude text DEFAULT '18.5204',
  longitude text DEFAULT '73.8567',
  opening_hours jsonb NOT NULL DEFAULT '[
    {"day":"Monday","hours":"9:00 AM – 11:00 PM"},
    {"day":"Tuesday","hours":"9:00 AM – 11:00 PM"},
    {"day":"Wednesday","hours":"9:00 AM – 11:00 PM"},
    {"day":"Thursday","hours":"9:00 AM – 11:00 PM"},
    {"day":"Friday","hours":"9:00 AM – 12:00 AM"},
    {"day":"Saturday","hours":"9:00 AM – 12:00 AM"},
    {"day":"Sunday","hours":"10:00 AM – 11:00 PM"}
  ]'::jsonb,
  instagram text DEFAULT '@emberandbean',
  google_review_url text DEFAULT '',
  hero_image text DEFAULT '',
  logo_url text DEFAULT '',
  price_range text DEFAULT '₹₹₹',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON restaurant_settings;
CREATE POLICY "public_read_settings" ON restaurant_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_settings" ON restaurant_settings;
CREATE POLICY "auth_update_settings" ON restaurant_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON restaurant_settings;
CREATE POLICY "auth_insert_settings" ON restaurant_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ seo_settings ============
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'EMBER & BEAN | Modern European • Artisan Coffee',
  description text NOT NULL DEFAULT 'Experience handcrafted food, signature flavors and unforgettable moments at EMBER & BEAN, Pune.',
  keywords text DEFAULT 'restaurant, pune, coffee, european cuisine, fine dining',
  og_image text DEFAULT '',
  canonical_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_seo" ON seo_settings;
CREATE POLICY "public_read_seo" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_seo" ON seo_settings;
CREATE POLICY "auth_update_seo" ON seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_seo" ON seo_settings;
CREATE POLICY "auth_insert_seo" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ social_links ============
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_social" ON social_links;
CREATE POLICY "auth_insert_social" ON social_links FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_social" ON social_links;
CREATE POLICY "auth_update_social" ON social_links FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_social" ON social_links;
CREATE POLICY "auth_delete_social" ON social_links FOR DELETE
  TO authenticated USING (true);

-- ============ menu_categories ============
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON menu_categories;
CREATE POLICY "public_read_categories" ON menu_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON menu_categories;
CREATE POLICY "auth_insert_categories" ON menu_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON menu_categories;
CREATE POLICY "auth_update_categories" ON menu_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON menu_categories;
CREATE POLICY "auth_delete_categories" ON menu_categories FOR DELETE
  TO authenticated USING (true);

-- ============ menu_items ============
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  category_name text DEFAULT '',
  image text DEFAULT '',
  is_vegetarian boolean DEFAULT false,
  is_spicy boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_available boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menu" ON menu_items;
CREATE POLICY "public_read_menu" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_menu" ON menu_items;
CREATE POLICY "auth_insert_menu" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_menu" ON menu_items;
CREATE POLICY "auth_update_menu" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_menu" ON menu_items;
CREATE POLICY "auth_delete_menu" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- ============ reservations ============
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  date date NOT NULL,
  time text NOT NULL,
  guests int NOT NULL DEFAULT 2,
  special_request text DEFAULT '',
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_reservations" ON reservations;
CREATE POLICY "auth_read_reservations" ON reservations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_reservations" ON reservations;
CREATE POLICY "auth_update_reservations" ON reservations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reservations" ON reservations;
CREATE POLICY "auth_delete_reservations" ON reservations FOR DELETE
  TO authenticated USING (true);

-- ============ orders ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  customer_name text DEFAULT '',
  customer_phone text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'PENDING',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- ============ offers ============
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image text DEFAULT '',
  discount text DEFAULT '',
  valid_from date DEFAULT now(),
  valid_until date DEFAULT now(),
  terms text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_offers" ON offers;
CREATE POLICY "public_read_offers" ON offers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_offers" ON offers;
CREATE POLICY "auth_insert_offers" ON offers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_offers" ON offers;
CREATE POLICY "auth_update_offers" ON offers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_offers" ON offers;
CREATE POLICY "auth_delete_offers" ON offers FOR DELETE
  TO authenticated USING (true);

-- ============ gallery ============
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  image text NOT NULL,
  category text NOT NULL DEFAULT 'FOOD',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ============ reviews ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  review text NOT NULL,
  photo text DEFAULT '',
  is_featured boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- ============ Indexes ============
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
