-- =============================================
-- SMA Ceremony - Supabase Database Setup
-- =============================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- Create the KV store table for ceremony data
CREATE TABLE IF NOT EXISTS ceremony_kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for prefix queries (for getByPrefix function)
CREATE INDEX IF NOT EXISTS idx_ceremony_kv_key_prefix ON ceremony_kv (key text_pattern_ops);

-- Enable Row Level Security (RLS)
ALTER TABLE ceremony_kv ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read all data
CREATE POLICY "Allow anonymous read access"
  ON ceremony_kv
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert access"
  ON ceremony_kv
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous users to update data
CREATE POLICY "Allow anonymous update access"
  ON ceremony_kv
  FOR UPDATE
  TO anon
  USING (true);

-- Create policy to allow anonymous users to delete data
CREATE POLICY "Allow anonymous delete access"
  ON ceremony_kv
  FOR DELETE
  TO anon
  USING (true);

-- Create a trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ceremony_kv_updated_at
  BEFORE UPDATE ON ceremony_kv
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Verification: Check if table was created
-- =============================================
-- Run this to verify the setup:
-- SELECT * FROM ceremony_kv;
