/*
  # Add RLS policies for prices table

  1. Security
    - Enable policies for authenticated users to:
      - Insert their own price entries
      - Read all price entries
      - Update their own price entries
      - Delete their own price entries
    - Ensure proper UUID type handling for shopkeeper_id comparisons
*/

-- Policy to allow authenticated users to insert their own price entries
CREATE POLICY "Users can insert their own price entries"
ON prices
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = shopkeeper_id);

-- Policy to allow authenticated users to read all price entries
CREATE POLICY "Users can view all price entries"
ON prices
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow users to update their own price entries
CREATE POLICY "Users can update their own price entries"
ON prices
FOR UPDATE
TO authenticated
USING (auth.uid()::text = shopkeeper_id)
WITH CHECK (auth.uid()::text = shopkeeper_id);

-- Policy to allow users to delete their own price entries
CREATE POLICY "Users can delete their own price entries"
ON prices
FOR DELETE
TO authenticated
USING (auth.uid()::text = shopkeeper_id);