import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

let publicClientInstance: SupabaseClient<Database> | null = null;
let adminClientInstance: SupabaseClient<Database> | null = null;

/**
 * Public client for static generation (SSG) and CDN-cached ISR routes.
 * Does NOT access cookies(), allowing Next.js and Vercel Edge CDN to pre-render and cache responses.
 */
export function createPublicClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!publicClientInstance) {
    publicClientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseKey);
  }

  return publicClientInstance;
}

/**
 * Privileged Admin/Service-Role client for background sync jobs and maintenance.
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS when performing trusted data ingestion.
 */
export function createAdminClient(): SupabaseClient<Database> | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!adminClientInstance) {
    adminClientInstance = createSupabaseClient<Database>(supabaseUrl, serviceRoleKey);
  }

  return adminClientInstance;
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
