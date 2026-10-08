-- ==============================================================================
-- Fix Supabase Advisor Security Lints (0024_permissive_rls_policy)
-- Replaces overly permissive RLS policies with strict Admin & Validated checks
-- ==============================================================================

-- 1. Helper function: verify if caller has admin role or admin email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin' OR
      COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin' OR
      COALESCE((auth.jwt() ->> 'email'), '') = 'tokolejo@gmail.com'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Drop existing permissive policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Authenticated users and system can insert activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Authenticated users can view activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Authenticated users have full access to coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Authenticated users have full access to dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Public can create dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Authenticated users have full access to gallery" ON public.gallery_items;
    DROP POLICY IF EXISTS "Authenticated users have full access to hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Authenticated users have full access to service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Authenticated users have full access to service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Authenticated users have full access to services" ON public.services;
    DROP POLICY IF EXISTS "Authenticated users have full access to site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Authenticated users have full access to testimonials" ON public.testimonials;

    -- Also drop previously created admin policies if rerunning
    DROP POLICY IF EXISTS "Admins have full access to activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "System and clients can insert activity logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Admins have full access to coverage areas" ON public.coverage_areas;
    DROP POLICY IF EXISTS "Admins have full access to dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Public can submit dispatch requests" ON public.dispatch_requests;
    DROP POLICY IF EXISTS "Admins have full access to gallery" ON public.gallery_items;
    DROP POLICY IF EXISTS "Admins have full access to hero slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Admins have full access to service categories" ON public.service_categories;
    DROP POLICY IF EXISTS "Admins have full access to service scenarios" ON public.service_scenarios;
    DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
    DROP POLICY IF EXISTS "Admins have full access to site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admins have full access to testimonials" ON public.testimonials;
END $$;

-- 3. Activity Logs Policies
CREATE POLICY "Admins have full access to activity logs"
ON public.activity_logs FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "System and clients can insert activity logs"
ON public.activity_logs FOR INSERT TO anon, authenticated
WITH CHECK (action IS NOT NULL AND entity IS NOT NULL);

-- 4. Services Policies
CREATE POLICY "Admins have full access to services"
ON public.services FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Service Categories Policies
CREATE POLICY "Admins have full access to service categories"
ON public.service_categories FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. Service Scenarios Policies
CREATE POLICY "Admins have full access to service scenarios"
ON public.service_scenarios FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Gallery Items Policies
CREATE POLICY "Admins have full access to gallery"
ON public.gallery_items FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. Hero Slides Policies
CREATE POLICY "Admins have full access to hero slides"
ON public.hero_slides FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 9. Site Settings Policies
CREATE POLICY "Admins have full access to site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 10. Coverage Areas Policies
CREATE POLICY "Admins have full access to coverage areas"
ON public.coverage_areas FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 11. Testimonials Policies
CREATE POLICY "Admins have full access to testimonials"
ON public.testimonials FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 12. Dispatch Requests Policies
CREATE POLICY "Public can submit dispatch requests"
ON public.dispatch_requests FOR INSERT TO anon, authenticated
WITH CHECK (
    customer_name IS NOT NULL AND
    phone IS NOT NULL AND
    zip_code IS NOT NULL AND
    status = 'new'
);

CREATE POLICY "Admins have full access to dispatch requests"
ON public.dispatch_requests FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
