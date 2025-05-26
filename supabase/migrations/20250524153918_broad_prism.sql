/*
  # Create price_entries table for shopkeeper price tracking

  1. New Tables
    - `price_entries`
      - `id` (serial, primary key)
      - `created_at` (timestamp with timezone, default now())
      - `item_name` (text, not null)
      - `supplier` (text, not null)
      - `price` (numeric(10,2), not null)
  
  2. Sample Data
    - Adds 5 sample price entries to demonstrate the application
*/

CREATE TABLE IF NOT EXISTS price_entries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  item_name TEXT NOT NULL,
  supplier TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Add some sample data
INSERT INTO price_entries (item_name, supplier, price)
VALUES 
  ('Organic Apples', 'Farm Fresh Produce', 2.99),
  ('Whole Wheat Bread', 'Sunshine Bakery', 3.49),
  ('Milk (1 Gallon)', 'Happy Cow Dairy', 4.29),
  ('Coffee Beans', 'Mountain Roasters', 12.99),
  ('Honey (16oz)', 'Local Bee Farm', 8.75);