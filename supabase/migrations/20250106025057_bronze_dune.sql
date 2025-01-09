/*
  # Events System Schema

  1. New Tables
    - `breweries`
      - `id` (uuid, primary key)
      - `external_id` (text, unique) - OpenBreweryDB ID
      - `name` (text)
      - `created_at` (timestamp)
      
    - `events`
      - `id` (uuid, primary key)
      - `brewery_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
  2. Security
    - Enable RLS on both tables
    - Policies for brewery owners to manage their events
    - Public read access for approved events
*/

-- Breweries table
CREATE TABLE IF NOT EXISTS breweries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brewery_id uuid REFERENCES breweries(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled'))
);

-- Enable RLS
ALTER TABLE breweries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies for breweries
CREATE POLICY "Public breweries are viewable by everyone"
  ON breweries
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own breweries"
  ON breweries
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own breweries"
  ON breweries
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Policies for events
CREATE POLICY "Published events are viewable by everyone"
  ON events
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Brewery owners can view all their events"
  ON events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM breweries
      WHERE breweries.id = events.brewery_id
      AND breweries.owner_id = auth.uid()
    )
  );

CREATE POLICY "Brewery owners can insert events"
  ON events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM breweries
      WHERE breweries.id = events.brewery_id
      AND breweries.owner_id = auth.uid()
    )
  );

CREATE POLICY "Brewery owners can update their events"
  ON events
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM breweries
      WHERE breweries.id = events.brewery_id
      AND breweries.owner_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_brewery_id ON events(brewery_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);