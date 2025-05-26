/*
  # Add default guest shopkeeper support

  1. Changes
    - Add default value for shopkeeper_id column
    - Update RLS policies to handle guest access
*/

-- Set default value for shopkeeper_id
ALTER TABLE prices ALTER COLUMN shopkeeper_id SET DEFAULT 'guest';

-- Update RLS policies for guest access
DROP POLICY IF EXISTS "Allow public to insert price entries" ON prices;
DROP POLICY IF EXISTS "Allow public to view price entries" ON prices;

CREATE POLICY "Allow public to insert price entries"
ON prices FOR INSERT
TO public
WITH CHECK (shopkeeper_id = 'guest');

CREATE POLICY "Allow public to view price entries"
ON prices FOR SELECT
TO public
USING (true);