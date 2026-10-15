/*
# Rename restaurant defaults from EMBER & BEAN to The Rushers Cafe

1. Modified Data
   - Updated `restaurant_settings` default value for `name` column from
     'EMBER & BEAN' to 'The Rushers Cafe'.
   - Updated any existing row's name if it still says 'EMBER & BEAN'.
   - Updated `seo_settings` default title and any existing row title
     to reference 'The Rushers Cafe' instead of 'EMBER & BEAN'.
   - Updated `restaurant_settings` default email from
     'hello@emberandbean.com' to 'hello@therusherscafe.com'.

2. Security
   - No policy changes. Existing RLS remains intact.

3. Notes
   - Idempotent: uses conditional WHERE clauses.
   - No columns dropped or renamed — data-safe update only.
*/

UPDATE restaurant_settings
  SET name = 'The Rushers Cafe',
      email = 'hello@therusherscafe.com',
      updated_at = now()
  WHERE name = 'EMBER & BEAN';

UPDATE seo_settings
  SET title = 'The Rushers Cafe | Modern European • Artisan Coffee',
      description = 'Experience handcrafted food, signature flavors and unforgettable moments at The Rushers Cafe, Pune.',
      keywords = 'restaurant, pune, coffee, european cuisine, fine dining, artisan coffee, koregaon park',
      updated_at = now()
  WHERE title LIKE '%EMBER%BEAN%';
