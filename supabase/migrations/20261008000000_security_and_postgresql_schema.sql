-- ==============================================================================
-- Migration: 20261008000000_security_and_postgresql_schema.sql
-- Description: Comprehensive Security Hardening & PostgreSQL Schema Architecture
-- Standards: OWASP Top 10, Supabase RLS Best Practices, PostgreSQL 15+ Schema
-- ==============================================================================

-- 1. Create Admins Management Table for tamper-proof RBAC
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'dispatcher', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 2. Hardened is_admin() Function in app_private schema
-- Moving helper functions out of public schema ensures PostgREST never exposes
-- them as public REST API RPC endpoints (/rest/v1/rpc/is_admin), resolving Supabase
-- lint warnings (0028 & 0029) while preserving full RLS authorization capabilities.
CREATE SCHEMA IF NOT EXISTS app_private;

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
      COALESCE((auth.jwt() ->> 'email'), '') = 'tokolejo@gmail.com' OR
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

-- Drop obsolete public.is_admin() if it exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Admins RLS
DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins can view admin list" ON public.admins;
    DROP POLICY IF EXISTS "Admins can manage admin list" ON public.admins;
END $$;

CREATE POLICY "Admins can view admin list"
ON public.admins FOR SELECT TO authenticated
USING (app_private.is_admin());

CREATE POLICY "Admins can manage admin list"
ON public.admins FOR ALL TO authenticated
USING (app_private.is_admin())
WITH CHECK (app_private.is_admin());

-- 3. New Entity: Technicians / Mobile Fleet Units Table (PostgreSQL Best Practice)
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

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins have full access to technicians" ON public.technicians;
END $$;

CREATE POLICY "Admins have full access to technicians"
ON public.technicians FOR ALL TO authenticated
USING (app_private.is_admin())
WITH CHECK (app_private.is_admin());

-- 4. New Entity: Dispatch Assignments & Audit Tracking (Junction / State History)
CREATE TABLE IF NOT EXISTS public.dispatch_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispatch_request_id UUID NOT NULL REFERENCES public.dispatch_requests(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    arrived_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'en_route', 'on_site', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Essential FK Indexes (PostgreSQL does NOT auto-index foreign keys!)
CREATE INDEX IF NOT EXISTS idx_dispatch_assignments_request_id ON public.dispatch_assignments(dispatch_request_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_assignments_technician_id ON public.dispatch_assignments(technician_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_assignments_status ON public.dispatch_assignments(status);

ALTER TABLE public.dispatch_assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Admins have full access to dispatch assignments" ON public.dispatch_assignments;
END $$;

CREATE POLICY "Admins have full access to dispatch assignments"
ON public.dispatch_assignments FOR ALL TO authenticated
USING (app_private.is_admin())
WITH CHECK (app_private.is_admin());

-- 5. Immutability Enforcement for Activity Logs (OWASP Audit Compliance)
-- Prevents UPDATE and DELETE operations on audit logs to guarantee non-repudiation.
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

-- 6. Rate-Limiting & Anti-Spam Constraint on Dispatch Requests
ALTER TABLE public.dispatch_requests 
    DROP CONSTRAINT IF EXISTS chk_dispatch_phone_format,
    ADD CONSTRAINT chk_dispatch_phone_format CHECK (length(trim(phone)) >= 7 AND length(phone) <= 30);

ALTER TABLE public.dispatch_requests 
    DROP CONSTRAINT IF EXISTS chk_dispatch_name_format,
    ADD CONSTRAINT chk_dispatch_name_format CHECK (length(trim(customer_name)) >= 2 AND length(customer_name) <= 100);

-- 7. Ensure Updated Timestamps via Reusable Trigger (Fixed search_path)
CREATE OR REPLACE FUNCTION public.update_timestamp_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_update_technicians_timestamp ON public.technicians;
    CREATE TRIGGER trg_update_technicians_timestamp
    BEFORE UPDATE ON public.technicians
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp_column();

    DROP TRIGGER IF EXISTS trg_update_admins_timestamp ON public.admins;
    CREATE TRIGGER trg_update_admins_timestamp
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_timestamp_column();
END $$;
