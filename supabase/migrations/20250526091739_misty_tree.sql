/*
  # Update RLS policies for prices table to allow public access

  1. Security Changes
    - Enable RLS on prices table
    - Allow public access for inserting price entries
    - Allow public access for viewing price entries
*/

-- Enable RLS
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own price entries" ON prices;
DROP POLICY IF EXISTS "Users can view all price entries" ON prices;
DROP POLICY IF EXISTS "Users can update their own price entries" ON prices;
DROP POLICY IF EXISTS "Users can delete their own price entries" ON prices;

-- Create new policies for public access
CREATE POLICY "Allow public to insert price entries"
ON prices FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to view price entries"
ON prices FOR SELECT
TO public
USING (true);