-- ============================================================================
-- SUPABASE MIGRATION UPDATE: Call Dispatch, Callback Leads & Resend Integration
-- Date: 2026-10-13
-- Target: Supabase PostgreSQL (Local Lock & Key Service)
-- Safe for execution: Fully idempotent (IF NOT EXISTS / CREATE OR REPLACE)
-- Compliant with Rule 4 (Security Guardrails & Search Path Invariants)
-- ============================================================================

-- 1. Ensure private schema for secure helper functions exists
CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO postgres, authenticated, service_role;

-- 2. Ensure dispatch_requests table has all required columns and constraints
CREATE TABLE IF NOT EXISTS public.dispatch_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    customer_name TEXT NOT NULL DEFAULT 'Caller / Web Lead',
    phone TEXT NOT NULL,
    zip_code VARCHAR NOT NULL DEFAULT '03101',
    address TEXT,
    service_category TEXT NOT NULL DEFAULT 'emergency',
    service_sub_type TEXT NOT NULL DEFAULT 'Emergency Lockout',
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_year TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    estimated_price_min NUMERIC(10, 2) DEFAULT 75.00,
    estimated_price_max NUMERIC(10, 2) DEFAULT 120.00,
    final_price NUMERIC(10, 2),
    assigned_technician TEXT,
    internal_notes TEXT,
    source TEXT NOT NULL DEFAULT 'direct_call'
);

-- Ensure newly added columns exist in case table was created earlier
ALTER TABLE public.dispatch_requests ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct_call';
ALTER TABLE public.dispatch_requests ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE public.dispatch_requests ADD COLUMN IF NOT EXISTS zip_code VARCHAR DEFAULT '03101';
ALTER TABLE public.dispatch_requests ADD COLUMN IF NOT EXISTS service_sub_type TEXT DEFAULT 'Emergency Lockout';

-- 3. Optimize Indexes for Admin Dispatch Queue
CREATE INDEX IF NOT EXISTS idx_dispatch_requests_created_status 
    ON public.dispatch_requests (created_at DESC, status);

CREATE INDEX IF NOT EXISTS idx_dispatch_requests_source 
    ON public.dispatch_requests (source);

CREATE INDEX IF NOT EXISTS idx_dispatch_requests_phone 
    ON public.dispatch_requests (phone);

-- 4. Ensure Row Level Security (RLS) is active on dispatch_requests
ALTER TABLE public.dispatch_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous and authenticated visitors to submit leads/callbacks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'dispatch_requests' AND policyname = 'Public can submit dispatch requests'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'dispatch_requests' AND policyname = 'Allow public insert for leads'
    ) THEN
        CREATE POLICY "Allow public insert for leads" 
            ON public.dispatch_requests 
            FOR INSERT 
            TO anon, authenticated 
            WITH CHECK (true);
    END IF;
END $$;

-- 5. Site Settings: Add Resend alert configuration columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS dispatch_alert_email TEXT DEFAULT 'dispatch@locallockandkey.com';
        ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS resend_from_email TEXT DEFAULT 'Local Lock Dispatch <onboarding@resend.dev>';
        
        -- Update the global settings row if missing default values
        UPDATE public.site_settings 
        SET 
            dispatch_alert_email = COALESCE(dispatch_alert_email, 'dispatch@locallockandkey.com'),
            resend_from_email = COALESCE(resend_from_email, 'Local Lock Dispatch <onboarding@resend.dev>')
        WHERE id = 'global';
    END IF;
END $$;

-- 6. Trigger: Automatically update updated_at timestamp on dispatch_requests
CREATE OR REPLACE FUNCTION app_private.update_dispatch_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_dispatch_requests_updated_at ON public.dispatch_requests;
CREATE TRIGGER trigger_dispatch_requests_updated_at
    BEFORE UPDATE ON public.dispatch_requests
    FOR EACH ROW
    EXECUTE FUNCTION app_private.update_dispatch_timestamp();

-- 7. Rule 4 Compliance: Activity logs must be strictly append-only
CREATE OR REPLACE FUNCTION app_private.prevent_log_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are append-only. Modification or deletion is strictly prohibited.';
END;
$$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') THEN
        DROP TRIGGER IF EXISTS trg_protect_activity_logs ON public.activity_logs;
        DROP TRIGGER IF EXISTS trigger_protect_activity_logs ON public.activity_logs;
        CREATE TRIGGER trigger_protect_activity_logs
            BEFORE UPDATE OR DELETE ON public.activity_logs
            FOR EACH ROW
            EXECUTE FUNCTION app_private.prevent_log_tampering();
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 
    (SELECT count(*) FROM public.dispatch_requests) AS total_dispatch_leads,
    (SELECT dispatch_alert_email FROM public.site_settings WHERE id = 'global' LIMIT 1) AS alert_email;
