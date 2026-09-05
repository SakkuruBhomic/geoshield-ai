-- ================================================================
-- GEOSHIELD AI — SUPABASE LIVE DATABASE SCHEMA & REALTIME SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ================================================================

-- 1. Create citizen_reports table
CREATE TABLE IF NOT EXISTS public.citizen_reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'High',
  status TEXT DEFAULT 'Pending',
  "desc" TEXT,
  reporter TEXT,
  phone TEXT,
  location TEXT,
  lat DOUBLE PRECISION DEFAULT 21.17,
  lng DOUBLE PRECISION DEFAULT 72.83,
  upvotes INT DEFAULT 1,
  officer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  timestamp BIGINT
);

-- 2. Create emergency_alerts table
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
  id TEXT PRIMARY KEY,
  level TEXT DEFAULT 'CRITICAL',
  type TEXT DEFAULT 'Emergency Broadcast',
  title TEXT NOT NULL,
  message TEXT,
  area TEXT,
  confidence INT DEFAULT 95,
  sources TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  timestamp BIGINT
);

-- 3. Enable Row Level Security (RLS) & Allow Anonymous Public Access for Demo
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read citizen_reports" ON public.citizen_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert citizen_reports" ON public.citizen_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update citizen_reports" ON public.citizen_reports FOR UPDATE USING (true);

CREATE POLICY "Allow public read emergency_alerts" ON public.emergency_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert emergency_alerts" ON public.emergency_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update emergency_alerts" ON public.emergency_alerts FOR UPDATE USING (true);

-- 4. Enable Supabase Realtime for instant live sync across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_alerts;

-- 5. Seed Initial Scenarios
INSERT INTO public.citizen_reports (id, type, severity, status, "desc", reporter, phone, location, lat, lng, upvotes, timestamp)
VALUES 
  ('REP001', 'Flood', 'High', 'Verified', 'Roads submerged near Olpad market area, knee-deep water', 'Ankit Shah', '+91-**-****-3421', 'Surat Coastal Sector', 21.20, 72.80, 14, 1725500000000),
  ('REP002', 'Flood', 'High', 'Pending', 'Bridge damaged on NH-27 near Jalukbari, traffic stopped', 'Priya Deka', '+91-**-****-8821', 'Guwahati Sector', 26.15, 91.70, 7, 1725501000000),
  ('REP003', 'Landslide', 'Medium', 'Pending', 'Small landslide on Badrinath highway, minor debris', 'Ram Rawat', '+91-**-****-5541', 'Chamoli Sector', 30.37, 79.30, 3, 1725502000000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.emergency_alerts (id, level, type, title, message, area, confidence, active, timestamp)
VALUES
  ('ALT-001', 'CRITICAL', 'Cyclone Alert', 'VERIFIED EMERGENCY: Cyclone Vayu Approaching Gujarat Coast', 'Cat-3 intensity cyclone. Mandatory evacuation ordered for Olpad & Hazira sectors.', 'Surat Coastal Sector', 96, true, 1725503000000)
ON CONFLICT (id) DO NOTHING;
