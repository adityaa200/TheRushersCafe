/*
# Add payment fields to orders table

1. Modified Tables
   - `orders`: added `payment_status` (text, default 'UNPAID'), 
     `payment_id` (text, nullable, stores Razorpay payment ID),
     `razorpay_order_id` (text, nullable, stores Razorpay order ID)

2. Security
   - No policy changes. Existing RLS policies on `orders` remain intact.
   - `anon` can still INSERT (customers creating orders) and `authenticated` can SELECT/UPDATE/DELETE (admin).

3. Notes
   - Idempotent: uses DO $$ ... IF NOT EXISTS ... END $$ for each column.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
    ALTER TABLE orders ADD COLUMN payment_status text NOT NULL DEFAULT 'UNPAID';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_id') THEN
    ALTER TABLE orders ADD COLUMN payment_id text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'razorpay_order_id') THEN
    ALTER TABLE orders ADD COLUMN razorpay_order_id text;
  END IF;
END $$;
