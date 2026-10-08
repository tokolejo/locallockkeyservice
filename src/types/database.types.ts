export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DispatchStatus =
  | "new"
  | "dispatched"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ServiceCategory =
  | "emergency"
  | "residential"
  | "automotive"
  | "commercial"
  | "smart_lock";

export type GalleryCategory = "auto" | "locks" | "commercial" | "residential";

export interface Database {
  public: {
    Tables: {
      dispatch_requests: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_name: string;
          phone: string;
          zip_code: string;
          address: string | null;
          service_category: ServiceCategory;
          service_sub_type: string;
          vehicle_make: string | null;
          vehicle_model: string | null;
          vehicle_year: string | null;
          status: DispatchStatus;
          estimated_price_min: number;
          estimated_price_max: number;
          final_price: number | null;
          assigned_technician: string | null;
          internal_notes: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          customer_name: string;
          phone: string;
          zip_code: string;
          address?: string | null;
          service_category?: ServiceCategory;
          service_sub_type?: string;
          vehicle_make?: string | null;
          vehicle_model?: string | null;
          vehicle_year?: string | null;
          status?: DispatchStatus;
          estimated_price_min?: number;
          estimated_price_max?: number;
          final_price?: number | null;
          assigned_technician?: string | null;
          internal_notes?: string | null;
          source?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          customer_name?: string;
          phone?: string;
          zip_code?: string;
          address?: string | null;
          service_category?: ServiceCategory;
          service_sub_type?: string;
          vehicle_make?: string | null;
          vehicle_model?: string | null;
          vehicle_year?: string | null;
          status?: DispatchStatus;
          estimated_price_min?: number;
          estimated_price_max?: number;
          final_price?: number | null;
          assigned_technician?: string | null;
          internal_notes?: string | null;
          source?: string;
        };
      };
      services: {
        Row: {
          id: string;
          category: ServiceCategory;
          title: string;
          slug: string;
          description: string;
          estimated_duration_min: number;
          is_active: boolean;
          display_order: number;
          features: string[];
          icon_name: string;
        };
        Insert: {
          id?: string;
          category: ServiceCategory;
          title: string;
          slug: string;
          description: string;
          estimated_duration_min?: number;
          is_active?: boolean;
          display_order?: number;
          features?: string[];
          icon_name?: string;
        };
        Update: {
          id?: string;
          category?: ServiceCategory;
          title?: string;
          slug?: string;
          description?: string;
          estimated_duration_min?: number;
          is_active?: boolean;
          display_order?: number;
          features?: string[];
          icon_name?: string;
        };
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          display_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          display_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          display_order?: number;
          is_active?: boolean;
        };
      };
      service_scenarios: {
        Row: {
          id: string;
          category_id: string;
          label: string;
          notes: string;
          eta: string;
          display_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          category_id: string;
          label: string;
          notes?: string;
          eta?: string;
          display_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          category_id?: string;
          label?: string;
          notes?: string;
          eta?: string;
          display_order?: number;
          is_active?: boolean;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          created_at: string;
          action: string;
          entity: string;
          details: string | null;
          ip_address: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          action: string;
          entity: string;
          details?: string | null;
          ip_address?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          action?: string;
          entity?: string;
          details?: string | null;
          ip_address?: string | null;
          status?: string;
        };
      };
      coverage_areas: {
        Row: {
          id: string;
          zip_code: string;
          city: string;
          county: string;
          state: string;
          avg_eta_minutes: number;
          is_serviceable: boolean;
          active_units: number;
        };
        Insert: {
          id?: string;
          zip_code: string;
          city: string;
          county: string;
          state: string;
          avg_eta_minutes?: number;
          is_serviceable?: boolean;
          active_units?: number;
        };
        Update: {
          id?: string;
          zip_code?: string;
          city?: string;
          county?: string;
          state?: string;
          avg_eta_minutes?: number;
          is_serviceable?: boolean;
          active_units?: number;
        };
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          location: string;
          rating: number;
          review_text: string;
          service_type: string;
          verified_customer: boolean;
          is_featured: boolean;
          is_approved: boolean;
          created_at: string;
          author_photo?: string | null;
          review_url?: string | null;
        };
        Insert: {
          id?: string;
          author_name: string;
          location: string;
          rating?: number;
          review_text: string;
          service_type: string;
          verified_customer?: boolean;
          is_featured?: boolean;
          is_approved?: boolean;
          created_at?: string;
          author_photo?: string | null;
          review_url?: string | null;
        };
        Update: {
          id?: string;
          author_name?: string;
          location?: string;
          rating?: number;
          review_text?: string;
          service_type?: string;
          verified_customer?: boolean;
          is_featured?: boolean;
          is_approved?: boolean;
          created_at?: string;
          author_photo?: string | null;
          review_url?: string | null;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          category: GalleryCategory;
          category_label: string;
          location: string;
          images: string[];
          cover_image: string;
          description: string;
          date_badge: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: GalleryCategory;
          category_label?: string;
          location?: string;
          images: string[];
          cover_image: string;
          description?: string;
          date_badge?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: GalleryCategory;
          category_label?: string;
          location?: string;
          images?: string[];
          cover_image?: string;
          description?: string;
          date_badge?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      hero_slides: {
        Row: {
          id: string;
          title: string;
          badge: string;
          location: string;
          image_url: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          badge?: string;
          location?: string;
          image_url: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          badge?: string;
          location?: string;
          image_url?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          phone_display: string;
          phone_raw: string;
          whatsapp_number: string;
          address: string;
          google_maps_url: string;
          google_maps_embed_url: string | null;
          google_rating: number;
          google_review_count: number;
          working_hours: string;
          emergency_eta: string;
          emergency_badge: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_display: string;
          phone_raw: string;
          whatsapp_number: string;
          address: string;
          google_maps_url: string;
          google_maps_embed_url?: string | null;
          google_rating?: number;
          google_review_count?: number;
          working_hours?: string;
          emergency_eta?: string;
          emergency_badge?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_display?: string;
          phone_raw?: string;
          whatsapp_number?: string;
          address?: string;
          google_maps_url?: string;
          google_maps_embed_url?: string | null;
          google_rating?: number;
          google_review_count?: number;
          working_hours?: string;
          emergency_eta?: string;
          emergency_badge?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type DispatchRequest = Database["public"]["Tables"]["dispatch_requests"]["Row"];
export type ServiceItem = Database["public"]["Tables"]["services"]["Row"];
export type ServiceCategoryItem = Database["public"]["Tables"]["service_categories"]["Row"];
export type ServiceScenarioItem = Database["public"]["Tables"]["service_scenarios"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
export type CoverageArea = Database["public"]["Tables"]["coverage_areas"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];
export type HeroSlide = Database["public"]["Tables"]["hero_slides"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
