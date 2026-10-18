import {
  initialDispatchRequests,
  initialServices,
  initialCoverageAreas,
  initialTestimonials,
  initialHeroSlides,
  initialGalleryItems,
  initialSiteSettings,
} from "./mock-data";
import {
  DispatchRequest,
  ServiceItem,
  ServiceCategoryItem,
  ServiceScenarioItem,
  ActivityLog,
  CoverageArea,
  Testimonial,
  DispatchStatus,
  GalleryItem,
  HeroSlide,
  SiteSettings,
} from "@/types/database.types";
import { createClient as createServerSupabase, createPublicClient, createAdminClient } from "@/lib/supabase/server";
import googleReviewsCache from "./google-reviews-cache.json";
import siteContentCache from "./site-content-cache.json";

// Stateful in-memory caches for fallback mode
let fallbackRequests: DispatchRequest[] = [...initialDispatchRequests];
let fallbackServices: ServiceItem[] = [...initialServices];
const fallbackCoverage: CoverageArea[] = [...initialCoverageAreas];
let fallbackHeroSlides: HeroSlide[] =
  ((siteContentCache as any)?.hero_slides as HeroSlide[]) || [...initialHeroSlides];
let fallbackGalleryItems: GalleryItem[] =
  ((siteContentCache as any)?.gallery_items as GalleryItem[]) || [...initialGalleryItems];
let fallbackSiteSettings: SiteSettings =
  ((siteContentCache as any)?.site_settings as SiteSettings) || { ...initialSiteSettings };

let fallbackServiceCategories: ServiceCategoryItem[] =
  ((siteContentCache as any)?.service_categories as ServiceCategoryItem[]) || [
    { id: "automotive", name: "Car Lockout & Keys", icon: "Car", display_order: 1, is_active: true },
    { id: "residential", name: "House & Apartment", icon: "Home", display_order: 2, is_active: true },
    { id: "commercial", name: "Commercial Storefront", icon: "Building2", display_order: 3, is_active: true },
  ];

let fallbackServiceScenarios: ServiceScenarioItem[] =
  ((siteContentCache as any)?.service_scenarios as ServiceScenarioItem[]) || [
    {
      id: "auto-lockout",
      category_id: "automotive",
      label: "Car Door / Trunk Lockout Rescue",
      notes: "Non-destructive air-wedge & specialized reach tools",
      eta: "15-20 mins",
      display_order: 1,
      is_active: true,
    },
    {
      id: "auto-lost-key",
      category_id: "automotive",
      label: "All Car Keys Lost (On-Site Origination)",
      notes: "Laser cut & OBD-II ECU computer pairing on the street",
      eta: "25-35 mins",
      display_order: 2,
      is_active: true,
    },
    {
      id: "auto-duplicate-fob",
      category_id: "automotive",
      label: "Spare Key Fob Duplication",
      notes: "Push-to-start smart proximity remote blanks",
      eta: "20-30 mins",
      display_order: 3,
      is_active: true,
    },
    {
      id: "auto-broken-key",
      category_id: "automotive",
      label: "Broken Key Extracted from Door / Ignition",
      notes: "Precision extraction tools, no lock replacement required",
      eta: "15-20 mins",
      display_order: 4,
      is_active: true,
    },
    {
      id: "res-lockout",
      category_id: "residential",
      label: "Locked Out of Apartment / House",
      notes: "Precision cylinder picking for deadbolts & mortise locks",
      eta: "15-20 mins",
      display_order: 1,
      is_active: true,
    },
    {
      id: "res-lock-change",
      category_id: "residential",
      label: "Lock Change / New Cylinder Installation",
      notes: "Fresh high-security locks + keys cut on-site",
      eta: "Same-Day / Scheduled",
      display_order: 2,
      is_active: true,
    },
    {
      id: "res-rekey",
      category_id: "residential",
      label: "Lock Re-Keying (Per Cylinder)",
      notes: "Keep current locks, change internal pins for new keys",
      eta: "Same-Day",
      display_order: 3,
      is_active: true,
    },
    {
      id: "res-broken-key",
      category_id: "residential",
      label: "Key Snapped in Deadbolt Cylinder",
      notes: "Non-destructive extraction + fresh key duplicate",
      eta: "15-20 mins",
      display_order: 4,
      is_active: true,
    },
    {
      id: "comm-lockout",
      category_id: "commercial",
      label: "Storefront / Commercial Lockout",
      notes: "Commercial mortise & rim cylinder bypass",
      eta: "15-25 mins",
      display_order: 1,
      is_active: true,
    },
    {
      id: "comm-panic-bar",
      category_id: "commercial",
      label: "Panic Crash Bar Exit Device Repair",
      notes: "Fire Code & ADA compliant repair",
      eta: "Same-Day",
      display_order: 2,
      is_active: true,
    },
    {
      id: "comm-master-key",
      category_id: "commercial",
      label: "Storefront Master Key System",
      notes: "Multi-door tiered master key hierarchy",
      eta: "Scheduled",
      display_order: 3,
      is_active: true,
    },
  ];

let fallbackActivityLogs: ActivityLog[] =
  ((siteContentCache as any)?.activity_logs as ActivityLog[]) || [
    {
      id: "log-init",
      created_at: new Date().toISOString(),
      action: "SYSTEM_INIT",
      entity: "system",
      details: "Locksmith architecture initialized",
      ip_address: "127.0.0.1",
      status: "success",
    },
  ];

const initialCachedReviews =
  googleReviewsCache?.reviews && googleReviewsCache.reviews.length > 0
    ? (googleReviewsCache.reviews as unknown as Testimonial[])
    : initialTestimonials;

let fallbackTestimonials: Testimonial[] = [...initialCachedReviews];

// Helper to persist content changes locally if filesystem is writable
async function persistSiteContentCache() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const cachePath = path.join(process.cwd(), "src/lib/data/site-content-cache.json");
    const data = {
      site_settings: fallbackSiteSettings,
      hero_slides: fallbackHeroSlides,
      gallery_items: fallbackGalleryItems,
      service_categories: fallbackServiceCategories,
      service_scenarios: fallbackServiceScenarios,
      activity_logs: fallbackActivityLogs,
    };
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Read-only serverless environment fallback
    console.warn("Notice: Content cache write skipped (serverless or read-only):", err);
  }
}

// ---------------------------------------------------------------------------
// 0. ACTIVITY LOGGING ENGINE
// ---------------------------------------------------------------------------
export async function logActivity(
  action: string,
  entity: string,
  details?: unknown,
  status: string = "success",
  ip_address?: string | null
): Promise<ActivityLog> {
  const detailsStr =
    typeof details === "string"
      ? details
      : details !== undefined && details !== null
      ? JSON.stringify(details)
      : null;

  const logItem: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    action,
    entity,
    details: detailsStr,
    ip_address: ip_address || null,
    status,
  };

  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("activity_logs")
        .insert([logItem])
        .select()
        .single();
      if (!error && data) {
        logItem.id = data.id;
      }
    }
  } catch {
    // Fallback mode
  }

  fallbackActivityLogs.unshift(logItem);
  if (fallbackActivityLogs.length > 500) {
    fallbackActivityLogs = fallbackActivityLogs.slice(0, 500);
  }
  await persistSiteContentCache();
  return logItem;
}

export async function getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) {
        return data as ActivityLog[];
      }
    }
  } catch {
    // Fallback mode
  }
  return [...fallbackActivityLogs].slice(0, limit);
}

// ---------------------------------------------------------------------------
// 1. SERVICES
// ---------------------------------------------------------------------------
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ServiceItem[];
      }
    }
  } catch {
    // Continue to fallback
  }
  return [...fallbackServices].sort((a, b) => a.display_order - b.display_order);
}

export async function createService(payload: Omit<ServiceItem, "id">): Promise<ServiceItem> {
  const newService: ServiceItem = {
    ...payload,
    id: `srv-${Date.now()}`,
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("services")
        .insert([newService])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "services", { id: data.id, title: data.title });
        return data as ServiceItem;
      }
    }
  } catch {
    // Continue in fallback
  }

  fallbackServices.push(newService);
  await logActivity("CREATE", "services", { id: newService.id, title: newService.title });
  return newService;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "services", { id, updates });
        return data as ServiceItem;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackServices.findIndex((s) => s.id === id);
  if (idx !== -1) {
    fallbackServices[idx] = { ...fallbackServices[idx], ...updates };
    await logActivity("UPDATE", "services", { id, updates });
    return fallbackServices[idx];
  }
  return null;
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("services")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "services", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackServices.length;
  fallbackServices = fallbackServices.filter((s) => s.id !== id);
  const success = fallbackServices.length < initialLen;
  if (success) {
    await logActivity("DELETE", "services", { id });
  }
  return success;
}

// ---------------------------------------------------------------------------
// 2. SERVICE CATEGORIES
// ---------------------------------------------------------------------------
export async function getServiceCategories(onlyActive = false): Promise<ServiceCategoryItem[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      let query = supabase.from("service_categories").select("*").order("display_order", { ascending: true });
      if (onlyActive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as ServiceCategoryItem[];
      }
    }
  } catch {
    // Fallback
  }

  let items = [...fallbackServiceCategories];
  if (onlyActive) {
    items = items.filter((c) => c.is_active);
  }
  return items.sort((a, b) => a.display_order - b.display_order);
}

export async function createServiceCategory(
  payload: Omit<ServiceCategoryItem, "id"> & { id?: string }
): Promise<ServiceCategoryItem> {
  const newItem: ServiceCategoryItem = {
    id: payload.id || `cat-${Date.now()}`,
    name: payload.name,
    icon: payload.icon || "Key",
    display_order: payload.display_order ?? (fallbackServiceCategories.length + 1),
    is_active: payload.is_active ?? true,
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("service_categories")
        .insert([newItem])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "service_categories", { id: data.id, name: data.name });
        return data as ServiceCategoryItem;
      }
    }
  } catch {
    // Fallback
  }

  fallbackServiceCategories.push(newItem);
  await persistSiteContentCache();
  await logActivity("CREATE", "service_categories", { id: newItem.id, name: newItem.name });
  return newItem;
}

export async function updateServiceCategory(
  id: string,
  updates: Partial<ServiceCategoryItem>
): Promise<ServiceCategoryItem | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("service_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "service_categories", { id, updates });
        return data as ServiceCategoryItem;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackServiceCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    fallbackServiceCategories[idx] = { ...fallbackServiceCategories[idx], ...updates };
    await persistSiteContentCache();
    await logActivity("UPDATE", "service_categories", { id, updates });
    return fallbackServiceCategories[idx];
  }
  return null;
}

export async function deleteServiceCategory(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("service_categories")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "service_categories", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackServiceCategories.length;
  fallbackServiceCategories = fallbackServiceCategories.filter((c) => c.id !== id);
  fallbackServiceScenarios = fallbackServiceScenarios.filter((s) => s.category_id !== id);
  await persistSiteContentCache();
  const success = fallbackServiceCategories.length < initialLen;
  if (success) {
    await logActivity("DELETE", "service_categories", { id });
  }
  return success;
}

// ---------------------------------------------------------------------------
// 3. SERVICE SCENARIOS
// ---------------------------------------------------------------------------
export async function getServiceScenarios(
  categoryId?: string,
  onlyActive = false
): Promise<ServiceScenarioItem[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      let query = supabase.from("service_scenarios").select("*").order("display_order", { ascending: true });
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      if (onlyActive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as ServiceScenarioItem[];
      }
    }
  } catch {
    // Fallback
  }

  let items = [...fallbackServiceScenarios];
  if (categoryId) {
    items = items.filter((s) => s.category_id === categoryId);
  }
  if (onlyActive) {
    items = items.filter((s) => s.is_active);
  }
  return items.sort((a, b) => a.display_order - b.display_order);
}

export async function createServiceScenario(
  payload: Omit<ServiceScenarioItem, "id"> & { id?: string }
): Promise<ServiceScenarioItem> {
  const newItem: ServiceScenarioItem = {
    id: payload.id || `scen-${Date.now()}`,
    category_id: payload.category_id,
    label: payload.label,
    notes: payload.notes || "",
    eta: payload.eta || "15–20 mins",
    display_order: payload.display_order ?? (fallbackServiceScenarios.length + 1),
    is_active: payload.is_active ?? true,
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("service_scenarios")
        .insert([newItem])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "service_scenarios", { id: data.id, label: data.label });
        return data as ServiceScenarioItem;
      }
    }
  } catch {
    // Fallback
  }

  fallbackServiceScenarios.push(newItem);
  await persistSiteContentCache();
  await logActivity("CREATE", "service_scenarios", { id: newItem.id, label: newItem.label });
  return newItem;
}

export async function updateServiceScenario(
  id: string,
  updates: Partial<ServiceScenarioItem>
): Promise<ServiceScenarioItem | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("service_scenarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "service_scenarios", { id, updates });
        return data as ServiceScenarioItem;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackServiceScenarios.findIndex((s) => s.id === id);
  if (idx !== -1) {
    fallbackServiceScenarios[idx] = { ...fallbackServiceScenarios[idx], ...updates };
    await persistSiteContentCache();
    await logActivity("UPDATE", "service_scenarios", { id, updates });
    return fallbackServiceScenarios[idx];
  }
  return null;
}

export async function deleteServiceScenario(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("service_scenarios")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "service_scenarios", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackServiceScenarios.length;
  fallbackServiceScenarios = fallbackServiceScenarios.filter((s) => s.id !== id);
  await persistSiteContentCache();
  const success = fallbackServiceScenarios.length < initialLen;
  if (success) {
    await logActivity("DELETE", "service_scenarios", { id });
  }
  return success;
}

// ---------------------------------------------------------------------------
// 4. GALLERY ITEMS (COMPLETED WORKS / PORTFOLIO)
// ---------------------------------------------------------------------------
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as GalleryItem[];
      }
    }
  } catch {
    // Continue to fallback
  }
  return [...fallbackGalleryItems].sort((a, b) => b.display_order - a.display_order);
}

export async function createGalleryItem(payload: Omit<GalleryItem, "id" | "created_at">): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    ...payload,
    id: `g-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("gallery_items")
        .insert([newItem])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "gallery_items", { id: data.id, title: data.title });
        return data as GalleryItem;
      }
    }
  } catch {
    // Fallback
  }

  fallbackGalleryItems.unshift(newItem);
  await persistSiteContentCache();
  await logActivity("CREATE", "gallery_items", { id: newItem.id, title: newItem.title });
  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("gallery_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "gallery_items", { id, updates });
        return data as GalleryItem;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackGalleryItems.findIndex((g) => g.id === id);
  if (idx !== -1) {
    fallbackGalleryItems[idx] = { ...fallbackGalleryItems[idx], ...updates };
    await persistSiteContentCache();
    await logActivity("UPDATE", "gallery_items", { id, updates });
    return fallbackGalleryItems[idx];
  }
  return null;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("gallery_items")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "gallery_items", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackGalleryItems.length;
  fallbackGalleryItems = fallbackGalleryItems.filter((g) => g.id !== id);
  await persistSiteContentCache();
  const success = fallbackGalleryItems.length < initialLen;
  if (success) {
    await logActivity("DELETE", "gallery_items", { id });
  }
  return success;
}

// ---------------------------------------------------------------------------
// 5. HERO SLIDES
// ---------------------------------------------------------------------------
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as HeroSlide[];
      }
    }
  } catch {
    // Fallback
  }
  return [...fallbackHeroSlides].sort((a, b) => a.display_order - b.display_order);
}

export async function createHeroSlide(payload: Omit<HeroSlide, "id" | "created_at">): Promise<HeroSlide> {
  const newSlide: HeroSlide = {
    ...payload,
    id: `slide-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("hero_slides")
        .insert([newSlide])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "hero_slides", { id: data.id, title: data.title });
        return data as HeroSlide;
      }
    }
  } catch {
    // Fallback
  }

  fallbackHeroSlides.push(newSlide);
  await persistSiteContentCache();
  await logActivity("CREATE", "hero_slides", { id: newSlide.id, title: newSlide.title });
  return newSlide;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("hero_slides")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "hero_slides", { id, updates });
        return data as HeroSlide;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackHeroSlides.findIndex((s) => s.id === id);
  if (idx !== -1) {
    fallbackHeroSlides[idx] = { ...fallbackHeroSlides[idx], ...updates };
    await persistSiteContentCache();
    await logActivity("UPDATE", "hero_slides", { id, updates });
    return fallbackHeroSlides[idx];
  }
  return null;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("hero_slides")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "hero_slides", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackHeroSlides.length;
  fallbackHeroSlides = fallbackHeroSlides.filter((s) => s.id !== id);
  await persistSiteContentCache();
  const success = fallbackHeroSlides.length < initialLen;
  if (success) {
    await logActivity("DELETE", "hero_slides", { id });
  }
  return success;
}

// ---------------------------------------------------------------------------
// 6. SITE SETTINGS
// ---------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "global")
        .single();
      if (!error && data) {
        return data as SiteSettings;
      }
    }
  } catch {
    // Fallback
  }
  return { ...fallbackSiteSettings };
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const merged: SiteSettings = {
    ...fallbackSiteSettings,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .upsert(merged)
        .select()
        .single();
      if (!error && data) {
        fallbackSiteSettings = data as SiteSettings;
        await logActivity("UPDATE", "site_settings", updates);
        return fallbackSiteSettings;
      }
    }
  } catch {
    // Fallback
  }

  fallbackSiteSettings = merged;
  await persistSiteContentCache();
  await logActivity("UPDATE", "site_settings", updates);
  return fallbackSiteSettings;
}

// ---------------------------------------------------------------------------
// 7. TESTIMONIALS / REVIEWS
// ---------------------------------------------------------------------------
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Testimonial[];
      }
    }
  } catch {
    // Fallback
  }
  return fallbackTestimonials.filter((t) => t.is_approved);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Testimonial[];
      }
    }
  } catch {
    // Fallback
  }
  return fallbackTestimonials;
}

export async function createTestimonial(payload: Omit<Testimonial, "id" | "created_at">): Promise<Testimonial> {
  const newRev: Testimonial = {
    ...payload,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("testimonials")
        .insert([newRev])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "testimonials", { id: data.id, author: data.author_name });
        return data as Testimonial;
      }
    }
  } catch {
    // Fallback
  }

  fallbackTestimonials.unshift(newRev);
  await logActivity("CREATE", "testimonials", { id: newRev.id, author: newRev.author_name });
  return newRev;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("testimonials")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE", "testimonials", { id, updates });
        return data as Testimonial;
      }
    }
  } catch {
    // Fallback
  }

  const idx = fallbackTestimonials.findIndex((t) => t.id === id);
  if (idx !== -1) {
    fallbackTestimonials[idx] = { ...fallbackTestimonials[idx], ...updates };
    await logActivity("UPDATE", "testimonials", { id, updates });
    return fallbackTestimonials[idx];
  }
  return null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await (supabase as any)
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (!error) {
        await logActivity("DELETE", "testimonials", { id });
        return true;
      }
    }
  } catch {
    // Fallback
  }

  const initialLen = fallbackTestimonials.length;
  fallbackTestimonials = fallbackTestimonials.filter((t) => t.id !== id);
  const success = fallbackTestimonials.length < initialLen;
  if (success) {
    await logActivity("DELETE", "testimonials", { id });
  }
  return success;
}

export async function toggleTestimonialStatus(id: string, is_approved?: boolean, is_featured?: boolean): Promise<Testimonial | null> {
  return updateTestimonial(id, {
    ...(is_approved !== undefined ? { is_approved } : {}),
    ...(is_featured !== undefined ? { is_featured } : {}),
  });
}

export async function saveSyncedGoogleReviews(newReviews: Testimonial[]): Promise<void> {
  if (!newReviews || newReviews.length === 0) return;

  const existingMap = new Map<string, Testimonial>();
  fallbackTestimonials.forEach((t) => existingMap.set(t.id, t));

  const merged = newReviews.map((r) => {
    const existing = existingMap.get(r.id);
    if (existing) {
      return {
        ...r,
        is_approved: existing.is_approved,
        is_featured: existing.is_featured,
      };
    }
    return r;
  });

  fallbackTestimonials = merged;

  try {
    const fs = await import("fs");
    const path = await import("path");
    const cachePath = path.join(process.cwd(), "src/lib/data/google-reviews-cache.json");
    const cacheData = {
      source: "google_maps_boq_scraper",
      place_id: "ChIJ_wpbGReKhK8RP_9ypyJkVL0",
      feature_id: "0xaf848a17195b0aff:0xbd546422a772ff3f",
      cid: "13642639271213072191",
      maps_url: "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29",
      rating: 5.0,
      total_reviews: merged.length,
      last_synced_at: new Date().toISOString(),
      reviews: merged,
    };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), "utf-8");
  } catch (err) {
    console.warn("Notice: Review cache write skipped (read-only environment or serverless):", err);
  }

  try {
    const supabase = createAdminClient() || (await createServerSupabase());
    if (supabase) {
      await (supabase as any).from("testimonials").upsert(merged);
    }
  } catch (err) {
    console.warn("Notice: Testimonials upsert caught error:", err);
  }
}

export function getGoogleReviewsCacheMeta() {
  return {
    rating: fallbackSiteSettings.google_rating || (googleReviewsCache as any)?.rating || 5.0,
    total_reviews: fallbackTestimonials.length || fallbackSiteSettings.google_review_count || (googleReviewsCache as any)?.total_reviews || 35,
    last_synced_at: (googleReviewsCache as any)?.last_synced_at || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 8. DISPATCH REQUESTS & COVERAGE (Retained for compatibility)
// ---------------------------------------------------------------------------
export async function getDispatchRequests(): Promise<DispatchRequest[]> {
  try {
    const supabase = createAdminClient() || (await createServerSupabase());
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("dispatch_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data as DispatchRequest[];
      }
    }
  } catch {
    // Continue to fallback
  }
  return fallbackRequests;
}

export async function createDispatchRequest(payload: {
  customer_name: string;
  phone: string;
  zip_code: string;
  address?: string;
  service_category?: DispatchRequest["service_category"];
  service_sub_type: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  internal_notes?: string;
  source?: string;
}): Promise<DispatchRequest> {
  const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const newRecord: DispatchRequest = {
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: payload.customer_name,
    phone: payload.phone,
    zip_code: payload.zip_code,
    address: payload.address || null,
    service_category: payload.service_category || "emergency",
    service_sub_type: payload.service_sub_type || "Emergency Lockout",
    vehicle_make: payload.vehicle_make || null,
    vehicle_model: payload.vehicle_model || null,
    vehicle_year: payload.vehicle_year || null,
    status: "new",
    estimated_price_min: payload.estimated_price_min || 75,
    estimated_price_max: payload.estimated_price_max || 120,
    final_price: null,
    assigned_technician: null,
    internal_notes: payload.internal_notes || null,
    source: payload.source || "web_emergency_form",
  };

  try {
    const supabase = createAdminClient() || createPublicClient();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("dispatch_requests")
        .insert([newRecord])
        .select()
        .single();
      if (!error && data) {
        await logActivity("CREATE", "dispatch_requests", { id: data.id, customer: data.customer_name });
        return data as DispatchRequest;
      }
      if (error) {
        console.warn("Notice: createDispatchRequest Supabase insert error:", error);
      }
    }
  } catch {
    // Continue to fallback
  }

  fallbackRequests = [newRecord, ...fallbackRequests];
  await logActivity("CREATE", "dispatch_requests", { id: newRecord.id, customer: newRecord.customer_name });
  return newRecord;
}

export async function updateDispatchRequestStatus(
  id: string,
  status: DispatchStatus,
  assigned_technician?: string,
  internal_notes?: string,
  final_price?: number
): Promise<DispatchRequest | null> {
  const updates: Partial<DispatchRequest> = {
    status,
    updated_at: new Date().toISOString(),
    ...(assigned_technician !== undefined ? { assigned_technician } : {}),
    ...(internal_notes !== undefined ? { internal_notes } : {}),
    ...(final_price !== undefined ? { final_price } : {}),
  };

  try {
    const supabase = createAdminClient() || (await createServerSupabase());
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("dispatch_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        await logActivity("UPDATE_STATUS", "dispatch_requests", { id, status });
        return data as DispatchRequest;
      }
    }
  } catch {
    // Continue to fallback
  }

  const index = fallbackRequests.findIndex((r) => r.id === id);
  if (index !== -1) {
    fallbackRequests[index] = {
      ...fallbackRequests[index],
      ...updates,
    };
    await logActivity("UPDATE_STATUS", "dispatch_requests", { id, status });
    return fallbackRequests[index];
  }
  return null;
}

export async function getCoverageAreas(): Promise<CoverageArea[]> {
  try {
    const supabase = createPublicClient();
    if (supabase) {
      const { data, error } = await supabase.from("coverage_areas").select("*");
      if (!error && data && data.length > 0) {
        return data as CoverageArea[];
      }
    }
  } catch {
    // Fallback
  }
  return fallbackCoverage;
}

export async function checkZipCoverage(zipCode: string): Promise<CoverageArea | null> {
  const cleanZip = zipCode.trim().slice(0, 5);
  const areas = await getCoverageAreas();
  const matched = areas.find((a) => a.zip_code === cleanZip);
  if (matched) return matched;

  if (/^\d{5}$/.test(cleanZip)) {
    return {
      id: `cov-dyn-${cleanZip}`,
      zip_code: cleanZip,
      city: "Metro Dispatch Zone",
      county: "Regional District",
      state: "US",
      avg_eta_minutes: 18,
      is_serviceable: true,
      active_units: 3,
    };
  }
  return null;
}

export async function updateCoverageArea(id: string, updates: Partial<CoverageArea>): Promise<CoverageArea | null> {
  const idx = fallbackCoverage.findIndex((c) => c.id === id);
  if (idx !== -1) {
    fallbackCoverage[idx] = { ...fallbackCoverage[idx], ...updates };
    await logActivity("UPDATE", "coverage_areas", { id, updates });
    return fallbackCoverage[idx];
  }
  return null;
}
