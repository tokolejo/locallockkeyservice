"use server";

import { revalidatePath } from "next/cache";
import {
  createDispatchRequest,
  checkZipCoverage,
  updateDispatchRequestStatus,
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  getServiceScenarios,
  createServiceScenario,
  updateServiceScenario,
  deleteServiceScenario,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getSiteSettings,
  updateSiteSettings,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  updateCoverageArea,
  logActivity,
  getActivityLogs,
} from "@/lib/data/store";
import {
  sendDispatchLeadNotification,
  getResendStatus,
} from "@/lib/services/resendService";
import {
  DispatchStatus,
  ServiceCategory,
  ServiceItem,
  ServiceCategoryItem,
  ServiceScenarioItem,
  CoverageArea,
  GalleryItem,
  HeroSlide,
  SiteSettings,
  Testimonial,
} from "@/types/database.types";
import { isValidUsZip } from "@/lib/utils";
import { requireAdminUser } from "@/lib/supabase/server";

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: Record<string, string>;
}

export async function getActivityLogsAction(limit: number = 100): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const logs = await getActivityLogs(limit);
    return {
      success: true,
      message: "Logs fetched successfully",
      data: logs,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch logs",
      data: [],
    };
  }
}

// ---------------------------------------------------------------------------
// SERVICE CATEGORIES ACTIONS
// ---------------------------------------------------------------------------
export async function createServiceCategoryAction(
  payload: Omit<ServiceCategoryItem, "id"> & { id?: string }
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createServiceCategory(payload);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service category created successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to create service category.",
    };
  }
}

export async function updateServiceCategoryAction(
  id: string,
  updates: Partial<ServiceCategoryItem>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateServiceCategory(id, updates);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service category updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update service category.",
    };
  }
}

export async function deleteServiceCategoryAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteServiceCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success,
      message: success
        ? "Service category deleted successfully."
        : "Service category not found for deletion.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete service category.",
    };
  }
}

// ---------------------------------------------------------------------------
// SERVICE SCENARIOS ACTIONS
// ---------------------------------------------------------------------------
export async function createServiceScenarioAction(
  payload: Omit<ServiceScenarioItem, "id"> & { id?: string }
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createServiceScenario(payload);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service scenario created successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to create service scenario.",
    };
  }
}

export async function updateServiceScenarioAction(
  id: string,
  updates: Partial<ServiceScenarioItem>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateServiceScenario(id, updates);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service scenario updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update service scenario.",
    };
  }
}

export async function deleteServiceScenarioAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteServiceScenario(id);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success,
      message: success
        ? "Service scenario deleted successfully."
        : "Service scenario not found for deletion.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete service scenario.",
    };
  }
}

// ---------------------------------------------------------------------------
// SERVICES ACTIONS
// ---------------------------------------------------------------------------
export async function createServiceAction(
  payload: Omit<ServiceItem, "id">
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createService(payload);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service created successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to create service.",
    };
  }
}

export async function updateServiceAction(
  id: string,
  updates: Partial<ServiceItem>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateService(id, updates);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success: true,
      message: "Service updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update service.",
    };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteService(id);
    revalidatePath("/admin/services");
    revalidatePath("/");
    return {
      success,
      message: success ? "Service deleted successfully." : "Service not found for deletion.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete service.",
    };
  }
}

// ---------------------------------------------------------------------------
// GALLERY / COMPLETED WORKS ACTIONS
// ---------------------------------------------------------------------------
export async function createGalleryItemAction(
  payload: Omit<GalleryItem, "id" | "created_at">
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createGalleryItem(payload);
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return {
      success: true,
      message: "Gallery item added successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to add gallery item.",
    };
  }
}

export async function updateGalleryItemAction(
  id: string,
  updates: Partial<GalleryItem>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateGalleryItem(id, updates);
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return {
      success: true,
      message: "Gallery item updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update gallery item.",
    };
  }
}

export async function deleteGalleryItemAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteGalleryItem(id);
    revalidatePath("/admin/gallery");
    revalidatePath("/");
    return {
      success,
      message: success ? "Gallery item deleted successfully." : "Gallery item not found.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete gallery item.",
    };
  }
}

// ---------------------------------------------------------------------------
// HERO SLIDER ACTIONS
// ---------------------------------------------------------------------------
export async function createHeroSlideAction(
  payload: Omit<HeroSlide, "id" | "created_at">
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createHeroSlide(payload);
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return {
      success: true,
      message: "Hero slide added successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to add hero slide.",
    };
  }
}

export async function updateHeroSlideAction(
  id: string,
  updates: Partial<HeroSlide>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateHeroSlide(id, updates);
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return {
      success: true,
      message: "Hero slide updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update hero slide.",
    };
  }
}

export async function deleteHeroSlideAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteHeroSlide(id);
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return {
      success,
      message: success ? "Hero slide deleted successfully." : "Hero slide not found.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete hero slide.",
    };
  }
}

// ---------------------------------------------------------------------------
// SITE SETTINGS ACTIONS
// ---------------------------------------------------------------------------
export async function updateSiteSettingsAction(
  updates: Partial<SiteSettings>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const settings = await updateSiteSettings(updates);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return {
      success: true,
      message: "Site settings updated successfully.",
      data: settings,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update site settings.",
    };
  }
}

// ---------------------------------------------------------------------------
// REVIEWS / TESTIMONIALS ACTIONS
// ---------------------------------------------------------------------------
export async function createTestimonialAction(
  payload: Omit<Testimonial, "id" | "created_at">
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const item = await createTestimonial(payload);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return {
      success: true,
      message: "Customer review added successfully.",
      data: item,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to add customer review.",
    };
  }
}

export async function updateTestimonialAction(
  id: string,
  updates: Partial<Testimonial>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateTestimonial(id, updates);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return {
      success: true,
      message: "Customer review updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update customer review.",
    };
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const success = await deleteTestimonial(id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return {
      success,
      message: success ? "Customer review deleted successfully." : "Customer review not found.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete customer review.",
    };
  }
}

export async function moderateReviewAction(payload: {
  id: string;
  is_approved?: boolean;
  is_featured?: boolean;
}): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await toggleTestimonialStatus(
      payload.id,
      payload.is_approved,
      payload.is_featured
    );
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return {
      success: true,
      message: "Review moderation status updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,

      message: err?.message || "Failed to update review status.",
    };
  }
}

// ---------------------------------------------------------------------------
// DISPATCH & COVERAGE ACTIONS
// ---------------------------------------------------------------------------
export async function submitEmergencyDispatchAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const customer_name = ((formData.get("customer_name") as string) || "").trim();
  const phone = ((formData.get("phone") as string) || "").trim();
  const zip_code = ((formData.get("zip_code") as string) || "").trim();
  const address = ((formData.get("address") as string) || "").trim();
  const service_category =
    (formData.get("service_category") as ServiceCategory) || "emergency";
  const service_sub_type = (
    (formData.get("service_sub_type") as string) || "Emergency Lockout"
  ).trim();
  const vehicle_make = ((formData.get("vehicle_make") as string) || "").trim() || undefined;
  const vehicle_model = ((formData.get("vehicle_model") as string) || "").trim() || undefined;
  const vehicle_year = ((formData.get("vehicle_year") as string) || "").trim() || undefined;
  const notes = ((formData.get("internal_notes") as string) || "").trim();
  const estimated_price_min = Number(formData.get("estimated_price_min")) || 75;
  const estimated_price_max = Number(formData.get("estimated_price_max")) || 120;

  const errors: Record<string, string> = {};

  if (!phone || phone.replace(/[^\d]/g, "").length < 10) {
    errors.phone = "Valid 10-digit US phone number is required (e.g. 555-0199)";
  }

  if (!zip_code || !isValidUsZip(zip_code)) {
    errors.zip_code = "Valid 5-digit US ZIP code is required (e.g. 90210)";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    const record = await createDispatchRequest({
      customer_name: customer_name || "Emergency Caller",
      phone,
      zip_code: zip_code.slice(0, 5),
      address: address || undefined,
      service_category,
      service_sub_type,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      estimated_price_min,
      estimated_price_max,
      internal_notes: notes || undefined,
      source: "web_emergency_form",
    });

    revalidatePath("/");
    revalidatePath("/admin/dispatch");
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Emergency dispatch confirmed! A licensed technician has been assigned and is preparing to roll out. Expect a confirmation call/SMS within 2 minutes.",
      data: record,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Failed to submit emergency dispatch request.",
    };
  }
}

export async function checkZipAction(zipCode: string): Promise<ActionResponse> {
  if (!isValidUsZip(zipCode)) {
    return {
      success: false,
      message: "Please enter a valid 5-digit US ZIP code.",
    };
  }

  const coverage = await checkZipCoverage(zipCode);
  if (coverage && coverage.is_serviceable) {
    return {
      success: true,
      message: `Zone Active: Immediate coverage in ${coverage.city}, ${coverage.state} (${coverage.zip_code}). ${coverage.active_units} mobile units on duty. Avg ETA: ${coverage.avg_eta_minutes} mins.`,
      data: coverage,
    };
  }

  return {
    success: false,
    message: `ZIP code ${zipCode} is currently outside our immediate 20-minute dispatch radius. Please call dispatch directly for emergency perimeter units.`,
  };
}

export async function updateLeadStatusAction(payload: {
  id: string;
  status: DispatchStatus;
  assigned_technician?: string;
  internal_notes?: string;
  final_price?: number;
}): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateDispatchRequestStatus(
      payload.id,
      payload.status,
      payload.assigned_technician,
      payload.internal_notes,
      payload.final_price
    );

    revalidatePath("/admin/dispatch");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Lead status updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update lead.",
    };
  }
}

export async function updateCoverageAction(
  id: string,
  updates: Partial<CoverageArea>
): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const updated = await updateCoverageArea(id, updates);
    revalidatePath("/admin/coverage");
    revalidatePath("/");

    return {
      success: true,
      message: "Coverage area updated successfully.",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update coverage area.",
    };
  }
}

export async function requestCallbackAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const phone = ((formData.get("phone") as string) || "").trim();
  const rawService = ((formData.get("service") as string) || "Other").trim();
  const rawNotes = ((formData.get("notes") as string) || "").trim();

  const service = rawService.slice(0, 100);
  const notes = rawNotes.slice(0, 500);

  const cleanPhone = phone.replace(/[^\d]/g, "");
  if (cleanPhone.length < 10) {
    return {
      success: false,
      message: "Please enter a valid 10-digit US phone number.",
    };
  }

  try {
    const record = await createDispatchRequest({
      customer_name: "Callback Request",
      phone,
      zip_code: "03101",
      service_sub_type: service,
      internal_notes: `[Callback Request] Service: ${service}. Notes: ${notes || "None"}`,
      source: "callback_modal",
    });

    await logActivity(
      "dispatch",
      `New callback requested for ${service} from ${phone}`,
      { phone, service, notes }
    );

    // Trigger Resend email notification in the background
    try {
      await sendDispatchLeadNotification({
        id: record.id,
        phone,
        service,
        notes,
        createdAt: record.created_at,
        source: "Website Callback Modal",
      });
    } catch (emailErr) {
      console.warn("Resend email dispatch notice:", emailErr);
    }

    revalidatePath("/");
    revalidatePath("/admin/dispatch");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Thank you! We received your callback request. A mobile dispatch specialist will call you shortly.",
      data: record,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to submit callback request.",
    };
  }
}

export async function getResendStatusAction(): Promise<{
  isConfigured: boolean;
  alertEmail: string | null;
  fromEmail: string;
}> {
  await requireAdminUser();
  return getResendStatus();
}

export async function testResendLeadAction(): Promise<ActionResponse> {
  try {
    await requireAdminUser();
    const result = await sendDispatchLeadNotification({
      id: `test-${Date.now()}`,
      phone: "(603) 290-5554",
      service: "Test Notification (Automotive Lockout)",
      notes: "This is a test notification from Local Lock & Key Service Admin to verify Resend email delivery.",
      createdAt: new Date().toISOString(),
      source: "Admin Test Trigger",
    });

    return {
      success: result.success,
      message: result.message,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to execute Resend test notification.",
    };
  }
}
