-- ==============================================================================
-- Locksmith Platform: Database Schema, Tables, Indexes, RLS & Seed Data
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/krfpknremqtzxsowsgyj/sql/new
-- ==============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums
DO $$ BEGIN
    CREATE TYPE dispatch_status_enum AS ENUM (
        'new', 'dispatched', 'en_route', 'in_progress', 'completed', 'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_category_enum AS ENUM (
        'emergency', 'residential', 'automotive', 'commercial', 'smart_lock'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Dispatch Requests / Emergency Leads Table
CREATE TABLE IF NOT EXISTS public.dispatch_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    address TEXT,
    service_category service_category_enum NOT NULL DEFAULT 'emergency',
    service_sub_type TEXT NOT NULL,
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_year TEXT,
    status dispatch_status_enum NOT NULL DEFAULT 'new',
    estimated_price_min NUMERIC(10, 2) NOT NULL DEFAULT 75.00,
    estimated_price_max NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
    final_price NUMERIC(10, 2),
    assigned_technician TEXT,
    internal_notes TEXT,
    source TEXT NOT NULL DEFAULT 'web_emergency_form'
);

CREATE INDEX IF NOT EXISTS idx_dispatch_requests_created_at ON public.dispatch_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dispatch_requests_status ON public.dispatch_requests(status);
CREATE INDEX IF NOT EXISTS idx_dispatch_requests_zip ON public.dispatch_requests(zip_code);

-- 3. Services Catalog Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category service_category_enum NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    estimated_duration_min INT NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    features TEXT[] NOT NULL DEFAULT '{}',
    icon_name TEXT NOT NULL DEFAULT 'Key'
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- 4. Service Categories Table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Key',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_service_categories_order ON public.service_categories(display_order ASC);

-- 5. Service Scenarios Table
CREATE TABLE IF NOT EXISTS public.service_scenarios (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    eta TEXT NOT NULL DEFAULT '15–20 mins',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_service_scenarios_cat ON public.service_scenarios(category_id);
CREATE INDEX IF NOT EXISTS idx_service_scenarios_order ON public.service_scenarios(display_order ASC);

-- 6. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'success'
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity);

-- 7. Gallery Items Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'auto',
    category_label TEXT NOT NULL DEFAULT 'Car Keys & Fobs',
    location TEXT NOT NULL DEFAULT 'Manchester, NH',
    images TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    date_badge TEXT NOT NULL DEFAULT 'Recent',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON public.gallery_items(display_order DESC);

-- 8. Hero Slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT 'Active Mobile Fleet',
    location TEXT NOT NULL DEFAULT 'Manchester, NH',
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON public.hero_slides(display_order ASC);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    phone_display TEXT NOT NULL DEFAULT '+1 (603) 290-5554',
    phone_raw TEXT NOT NULL DEFAULT 'tel:+16032905554',
    whatsapp_number TEXT NOT NULL DEFAULT '+16032905554',
    address TEXT NOT NULL DEFAULT 'Manchester, NH & Greater Southern NH Area',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29',
    google_maps_embed_url TEXT,
    google_rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    google_review_count INT NOT NULL DEFAULT 35,
    working_hours TEXT NOT NULL DEFAULT '24/7 Emergency Dispatch',
    emergency_eta TEXT NOT NULL DEFAULT '15–20 Min Rapid Mobile Units',
    emergency_badge TEXT NOT NULL DEFAULT 'Live Patrols in Manchester & NH Areas',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default Settings Row
INSERT INTO public.site_settings (id)
VALUES ('global')
ON CONFLICT (id) DO NOTHING;

-- 10. Coverage Areas Table
CREATE TABLE IF NOT EXISTS public.coverage_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zip_code VARCHAR(10) NOT NULL UNIQUE,
    city TEXT NOT NULL,
    county TEXT NOT NULL,
    state VARCHAR(2) NOT NULL DEFAULT 'US',
    avg_eta_minutes INT NOT NULL DEFAULT 18,
    is_serviceable BOOLEAN NOT NULL DEFAULT TRUE,
    active_units INT NOT NULL DEFAULT 3
);

CREATE INDEX IF NOT EXISTS idx_coverage_areas_zip ON public.coverage_areas(zip_code);

-- 11. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    author_name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    review_text TEXT NOT NULL,
    service_type TEXT NOT NULL,
    verified_customer BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    author_photo TEXT,
    review_url TEXT
);

-- 12. Enable Row Level Security (RLS)
ALTER TABLE public.dispatch_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 13. RLS Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view active services" ON public.services;
    DROP POLICY IF EXISTS "Authenticated users have full access to services" ON public.services;
    DROP POLICY IF EXISTS "Public can view active service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Authenticated users have full access to service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Public can view active service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Authenticated users have full access to service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Authenticated users can view activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Authenticated users and system can insert activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Public can view active gallery items" ON public.gallery_items;
    DROP POLICY IF EXISTS "Authenticated users have full access to gallery" ON public.gallery_items;
    DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Authenticated users have full access to hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Authenticated users have full access to site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Authenticated users have full access to testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Public can view coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Authenticated users have full access to coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Public can create dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Authenticated users have full access to dispatch requests" ON public.dispatch_requests;
END $$;

CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users have full access to services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view active service categories" ON public.service_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users have full access to service categories" ON public.service_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view active service scenarios" ON public.service_scenarios FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users have full access to service scenarios" ON public.service_scenarios FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users and system can insert activity logs" ON public.activity_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can view active gallery items" ON public.gallery_items FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users have full access to gallery" ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Authenticated users have full access to hero slides" ON public.hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users have full access to site settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "Authenticated users have full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view coverage areas" ON public.coverage_areas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users have full access to coverage areas" ON public.coverage_areas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can create dispatch requests" ON public.dispatch_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users have full access to dispatch requests" ON public.dispatch_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 14. Seed Service Categories & Scenarios
INSERT INTO public.service_categories (id, name, icon, display_order, is_active)
VALUES
    ('automotive', 'Car Lockout & Keys', 'Car', 1, true),
    ('residential', 'House & Apartment', 'Home', 2, true),
    ('commercial', 'Commercial Storefront', 'Building2', 3, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

INSERT INTO public.service_scenarios (id, category_id, label, notes, eta, display_order, is_active)
VALUES
    ('auto-lockout', 'automotive', 'Car Door / Trunk Lockout Rescue', '100% Non-destructive air-wedge & specialized reach tools', '15-20 mins', 1, true),
    ('auto-lost-key', 'automotive', 'All Car Keys Lost (On-Site Origination)', 'Laser cut & OBD-II ECU computer pairing on the street', '25-35 mins', 2, true),
    ('auto-duplicate-fob', 'automotive', 'Spare Key Fob Duplication', 'Push-to-start smart proximity remote blanks', '20-30 mins', 3, true),
    ('auto-broken-key', 'automotive', 'Broken Key Extracted from Door / Ignition', 'Precision extraction tools, no lock replacement required', '15-20 mins', 4, true),
    ('res-lockout', 'residential', 'Locked Out of Apartment / House', 'Damage-free cylinder picking for deadbolts & mortise locks', '15-20 mins', 1, true),
    ('res-lock-change', 'residential', 'Lock Change / New Cylinder Installation', 'Fresh high-security locks + keys cut on-site', 'Same-Day / Scheduled', 2, true),
    ('res-rekey', 'residential', 'Lock Re-Keying (Per Cylinder)', 'Keep current locks, change internal pins for new keys', 'Same-Day', 3, true),
    ('res-broken-key', 'residential', 'Key Snapped in Deadbolt Cylinder', 'Non-destructive extraction + fresh key duplicate', '15-20 mins', 4, true),
    ('comm-lockout', 'commercial', 'Storefront / Commercial Lockout', 'Commercial mortise & rim cylinder bypass', '15-25 mins', 1, true),
    ('comm-panic-bar', 'commercial', 'Panic Crash Bar Exit Device Repair', 'Fire Code & ADA compliant repair', 'Same-Day', 2, true),
    ('comm-master-key', 'commercial', 'Storefront Master Key System', 'Multi-door tiered master key hierarchy', 'Scheduled', 3, true)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    label = EXCLUDED.label,
    notes = EXCLUDED.notes,
    eta = EXCLUDED.eta,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;
