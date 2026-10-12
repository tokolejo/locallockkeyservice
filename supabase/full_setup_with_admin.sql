-- ==============================================================================
-- Full Locksmith Platform Database Schema, Seed Data & Admin User Setup
-- Target: Supabase SQL Editor (PostgreSQL 15+)
-- Standards: OWASP Top 10, Supabase RLS Guardrails, Zero-Pricing Schema
-- ==============================================================================

-- 0. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Private Schema & is_admin() Helper Function
-- Isolating internal security definer functions from public schema prevents
-- PostgREST from exposing RPC endpoints, resolving Supabase Advisor 0028/0029 lints.
CREATE SCHEMA IF NOT EXISTS app_private;

-- 2. Create Enums
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

-- 3. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'dispatcher', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 4. Hardened is_admin() Function in app_private schema
CREATE OR REPLACE FUNCTION app_private.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
STABLE
AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin' OR
      COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin' OR
      COALESCE((auth.jwt() ->> 'email'), '') IN ('tokolejo@gmail.com', 'mikheil75kapanadze@gmail.com') OR
      EXISTS (
        SELECT 1 FROM public.admins
        WHERE public.admins.user_id = auth.uid()
      )
    )
  );
END;
$$;

GRANT USAGE ON SCHEMA app_private TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_admin() TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.is_admin();

-- 5. Dispatch Requests / Emergency Leads Table
CREATE TABLE IF NOT EXISTS public.dispatch_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer_name TEXT NOT NULL CHECK (length(trim(customer_name)) >= 2 AND length(customer_name) <= 100),
    phone TEXT NOT NULL CHECK (length(trim(phone)) >= 7 AND length(phone) <= 30),
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

-- 6. Services Catalog Table (Zero Pricing Schema)
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

-- 7. Service Categories Table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Key',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_service_categories_order ON public.service_categories(display_order ASC);

-- 8. Service Scenarios Table
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

-- 9. Activity Logs Table (Append-Only)
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

-- 10. Tamper-Proof Trigger on Activity Logs
CREATE OR REPLACE FUNCTION public.prevent_activity_logs_tampering()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Security Policy Violation: Activity logs are append-only and cannot be altered or removed.';
END;
$$;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_protect_activity_logs ON public.activity_logs;
    CREATE TRIGGER trg_protect_activity_logs
    BEFORE UPDATE OR DELETE ON public.activity_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_activity_logs_tampering();
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- 11. Gallery Items Table
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

-- 12. Hero Slides Table
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

-- 13. Site Settings Table
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

INSERT INTO public.site_settings (id)
VALUES ('global')
ON CONFLICT (id) DO NOTHING;

-- 14. Coverage Areas Table
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

-- 15. Testimonials Table
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

-- 16. Technicians Table
CREATE TABLE IF NOT EXISTS public.technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL CHECK (length(trim(full_name)) >= 2),
    phone TEXT NOT NULL CHECK (length(trim(phone)) >= 7),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'dispatched', 'busy', 'offline')),
    primary_zip_coverage TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_technicians_status ON public.technicians(status) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_technicians_coverage_gin ON public.technicians USING GIN(primary_zip_coverage);

-- 17. Enable Row Level Security (RLS) on all tables
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
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- 18. Hardened RLS Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view active services" ON public.services;
    DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
    DROP POLICY IF EXISTS "Authenticated users have full access to services" ON public.services;
    DROP POLICY IF EXISTS "Public can view active service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Admins have full access to service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Authenticated users have full access to service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Public can view active service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Admins have full access to service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Authenticated users have full access to service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Admins have full access to activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "System and clients can insert activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Authenticated users can view activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Authenticated users and system can insert activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Public can view active gallery items" ON public.gallery_items;
    DROP POLICY IF EXISTS "Admins have full access to gallery" ON public.gallery_items;
    DROP POLICY IF EXISTS "Authenticated users have full access to gallery" ON public.gallery_items;
    DROP POLICY IF EXISTS "Public can view active hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Admins have full access to hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Authenticated users have full access to hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admins have full access to site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Authenticated users have full access to site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admins have full access to testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Authenticated users have full access to testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Public can view coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Admins have full access to coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Authenticated users have full access to coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Public can submit dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Public can create dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Admins have full access to dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Authenticated users have full access to dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Admins have full access to technicians" ON public.technicians;
    DROP POLICY IF EXISTS "Admins can view admin list" ON public.admins;
    DROP POLICY IF EXISTS "Admins can manage admin list" ON public.admins;
END $$;

-- Admins Table
CREATE POLICY "Admins can view admin list" ON public.admins FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins can manage admin list" ON public.admins FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Services
CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Service Categories
CREATE POLICY "Public can view active service categories" ON public.service_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins have full access to service categories" ON public.service_categories FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Service Scenarios
CREATE POLICY "Public can view active service scenarios" ON public.service_scenarios FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins have full access to service scenarios" ON public.service_scenarios FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Activity Logs
CREATE POLICY "Admins have full access to activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "System and clients can insert activity logs" ON public.activity_logs FOR INSERT TO anon, authenticated WITH CHECK (action IS NOT NULL AND entity IS NOT NULL);

-- Gallery Items
CREATE POLICY "Public can view active gallery items" ON public.gallery_items FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins have full access to gallery" ON public.gallery_items FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Hero Slides
CREATE POLICY "Public can view active hero slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins have full access to hero slides" ON public.hero_slides FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Site Settings
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins have full access to site settings" ON public.site_settings FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Testimonials
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_approved = true);
CREATE POLICY "Admins have full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Coverage Areas
CREATE POLICY "Public can view coverage areas" ON public.coverage_areas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins have full access to coverage areas" ON public.coverage_areas FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Dispatch Requests
CREATE POLICY "Public can submit dispatch requests" ON public.dispatch_requests FOR INSERT TO anon, authenticated WITH CHECK (customer_name IS NOT NULL AND phone IS NOT NULL AND zip_code IS NOT NULL AND status = 'new');
CREATE POLICY "Admins have full access to dispatch requests" ON public.dispatch_requests FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- Technicians
CREATE POLICY "Admins have full access to technicians" ON public.technicians FOR ALL TO authenticated USING (app_private.is_admin()) WITH CHECK (app_private.is_admin());

-- 19. Supabase Storage Bucket ('gallery') & Policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery',
    'gallery',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view gallery objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can upload gallery objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can update gallery objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can delete gallery objects" ON storage.objects;
END $$;

CREATE POLICY "Public can view gallery objects"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery objects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND app_private.is_admin());

CREATE POLICY "Admins can update gallery objects"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND app_private.is_admin())
WITH CHECK (bucket_id = 'gallery' AND app_private.is_admin());

CREATE POLICY "Admins can delete gallery objects"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND app_private.is_admin());

-- 20. Seed Service Categories & Scenarios
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

-- 21. Create or Update Admin User in Supabase Auth & public.admins (tokolejo@gmail.com)
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    existing_user_id UUID;
BEGIN
    SELECT id INTO existing_user_id FROM auth.users WHERE email = 'tokolejo@gmail.com';

    IF existing_user_id IS NULL THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'tokolejo@gmail.com',
            crypt('~!q1w2Lock~!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"],"role":"admin"}',
            '{"role":"admin","name":"Admin"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );

        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            format('{"sub":"%s","email":"%s"}', new_user_id::text, 'tokolejo@gmail.com')::jsonb,
            'email',
            'tokolejo@gmail.com',
            NOW(),
            NOW(),
            NOW()
        );

        INSERT INTO public.admins (user_id, email, role)
        VALUES (new_user_id, 'tokolejo@gmail.com', 'super_admin')
        ON CONFLICT (user_id) DO NOTHING;
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('~!q1w2Lock~!', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW(),
            raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}',
            raw_user_meta_data = '{"role":"admin","name":"Admin"}'
        WHERE id = existing_user_id;

        INSERT INTO public.admins (user_id, email, role)
        VALUES (existing_user_id, 'tokolejo@gmail.com', 'super_admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', email = 'tokolejo@gmail.com';
    END IF;

    -- Admin 2: mikheil75kapanadze@gmail.com
    SELECT id INTO existing_user_id FROM auth.users WHERE email = 'mikheil75kapanadze@gmail.com';
    IF existing_user_id IS NULL THEN
        new_user_id := gen_random_uuid();
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'mikheil75kapanadze@gmail.com',
            crypt('Anamaria1975@', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"],"role":"admin"}',
            '{"role":"admin","name":"Mikheil Kapanadze"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );

        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            format('{"sub":"%s","email":"%s"}', new_user_id::text, 'mikheil75kapanadze@gmail.com')::jsonb,
            'email',
            'mikheil75kapanadze@gmail.com',
            NOW(),
            NOW(),
            NOW()
        );

        INSERT INTO public.admins (user_id, email, role)
        VALUES (new_user_id, 'mikheil75kapanadze@gmail.com', 'super_admin')
        ON CONFLICT (user_id) DO NOTHING;
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('Anamaria1975@', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW(),
            raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}',
            raw_user_meta_data = '{"role":"admin","name":"Mikheil Kapanadze"}'
        WHERE id = existing_user_id;

        INSERT INTO public.admins (user_id, email, role)
        VALUES (existing_user_id, 'mikheil75kapanadze@gmail.com', 'super_admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', email = 'mikheil75kapanadze@gmail.com';
    END IF;
END $$;

