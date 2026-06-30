-- ============================================================
-- Sawdesi — Admin Seed (v2)
-- Run this in the Supabase SQL editor to create your seed admins.
-- ============================================================

-- Seed the admins table with the initial super_admin.
-- This is the Google account that can first access the admin dashboard.
INSERT INTO public.admins (email, role, active)
VALUES
  ('mrkunal0430@gmail.com', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
