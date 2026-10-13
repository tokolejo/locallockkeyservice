import {
  DispatchRequest,
  ServiceItem,
  CoverageArea,
  Testimonial,
  GalleryItem,
  HeroSlide,
  SiteSettings,
} from "@/types/database.types";
import googleReviewsCache from "./google-reviews-cache.json";

export const initialSiteSettings: SiteSettings = {
  id: "global",
  phone_display: "+1 (603) 290-5554",
  phone_raw: "tel:+16032905554",
  whatsapp_number: "+16032905554",
  address: "Manchester, NH & Greater Southern NH Area",
  google_maps_url: "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29",
  google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187234.3411425129!2d-71.5546271!3d42.9956426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e24fa5064e62a1%3A0xbd546422a772ff3f!2sLocal%20Lock%20%26%20Key%20Service!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus",
  google_rating: 5.0,
  google_review_count: 35,
  working_hours: "24/7 Emergency Dispatch",
  emergency_eta: "15–20 Min Rapid Mobile Units",
  emergency_badge: "Live Patrols in Manchester & NH Areas",
  updated_at: new Date().toISOString(),
};

export const initialHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    image_url: "/gallery/hero-banner.png",
    title: "24/7 Mobile Locksmith Service",
    badge: "Active Mobile Fleet",
    location: "Manchester, NH",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-2",
    image_url: "/gallery/lock-repair-door.jpg",
    title: "High-Security Deadbolts & Hardware",
    badge: "Residential Entry",
    location: "Manchester, NH",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-3",
    image_url: "/gallery/toyota-car-key.jpg",
    title: "Smart Key & Proximity Fobs",
    badge: "Automotive Rescue",
    location: "Bedford, NH",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-4",
    image_url: "/gallery/technician-work-1.jpg",
    title: "Commercial Mortise & Lock Upgrades",
    badge: "100% Damage-Free",
    location: "Concord, NH",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-5",
    image_url: "/gallery/key-cutting-machine.jpg",
    title: "Computerized Laser Key Cutting",
    badge: "Mobile Equipment",
    location: "Manchester, NH",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-6",
    image_url: "/gallery/van-work.jpg",
    title: "15–20 Min Rapid Mobile Units",
    badge: "Manchester & Surrounding NH",
    location: "Nashua, NH",
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const initialGalleryItems: GalleryItem[] = [
  {
    "id": "g-ford-explorer",
    "display_order": 19,
    "title": "Ford Explorer Smart Key Fob & OBD-II Programming",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/ford-smart-fob-1.jpg",
      "/gallery/jobs/ford-smart-fob-2.jpg"
    ],
    "cover_image": "/gallery/jobs/ford-smart-fob-1.jpg",
    "description": "On-site all-keys-lost origination: Autel diagnostic tablet OBD-II pairing and push-to-start smart key fob generation for Ford Explorer.",
    "date_badge": "Today",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-cadillac-escalade",
    "display_order": 18,
    "title": "Cadillac Escalade Advanced ECU Immobilizer Flashing",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Bedford, NH",
    "images": [
      "/gallery/cadillac-car-key.jpg"
    ],
    "cover_image": "/gallery/cadillac-car-key.jpg",
    "description": "High-end GM immobilizer security clearance: online SPS2 module calibration and proximity key sync on new Cadillac Escalade.",
    "date_badge": "Today",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-toyota-smart-key",
    "display_order": 17,
    "title": "Toyota Smart Proximity Key Fob Replacement",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Nashua, NH",
    "images": [
      "/gallery/toyota-car-key.jpg"
    ],
    "cover_image": "/gallery/toyota-car-key.jpg",
    "description": "Roadside smart key replacement: laser emergency blade cut and push-to-start proximity remote pairing via Autel tablet.",
    "date_badge": "Yesterday",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-subaru-laser-key",
    "display_order": 16,
    "title": "Subaru High-Security Laser Cut Keys & Chip Sync",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Merrimack, NH",
    "images": [
      "/gallery/jobs/subaru-laser-key-programming.jpg"
    ],
    "cover_image": "/gallery/jobs/subaru-laser-key-programming.jpg",
    "description": "Laser side-mill track key duplication and transponder chip synchronization via OBD-II diagnostic computer on Subaru.",
    "date_badge": "2 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-nissan-transponder",
    "display_order": 15,
    "title": "Nissan Transponder Chip Keys & Remote Fob Pairing",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Bedford, NH",
    "images": [
      "/gallery/jobs/nissan-key-programming.jpg"
    ],
    "cover_image": "/gallery/jobs/nissan-key-programming.jpg",
    "description": "Roadside rescue: precision blade cutting for two Nissan chip keys and keyless entry remote paired using XTool diagnostic tablet.",
    "date_badge": "3 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-mazda-proximity",
    "display_order": 14,
    "title": "Mazda Smart Proximity Key Fob Origination",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Manchester, NH",
    "images": [
      "/gallery/mazda-car-key.jpg"
    ],
    "cover_image": "/gallery/mazda-car-key.jpg",
    "description": "All-keys-lost replacement for Mazda: push-button start proximity smart key programmed with full keyless functions.",
    "date_badge": "4 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-chevy-flip-key",
    "display_order": 13,
    "title": "Chevrolet Laser Flip Key Cutting & Programming",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Derry, NH",
    "images": [
      "/gallery/chevrolet-car-key.jpg"
    ],
    "cover_image": "/gallery/chevrolet-car-key.jpg",
    "description": "Precision high-security side-cut flip key origination and remote start immobilizer pairing for Chevrolet.",
    "date_badge": "5 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-ford-transit-key",
    "display_order": 12,
    "title": "Ford Fleet Van Remote Flip Key Programming",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Hooksett, NH",
    "images": [
      "/gallery/ford-car-key.jpg"
    ],
    "cover_image": "/gallery/ford-car-key.jpg",
    "description": "Commercial fleet service: roadside duplicate flip key cutting and onboard immobilizer programming for Ford van.",
    "date_badge": "1 week ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-laser-key-machine",
    "display_order": 11,
    "title": "Computerized Mobile Laser Key Cutting Machine",
    "category": "auto",
    "category_label": "Car Keys & Fobs",
    "location": "Mobile Service Van",
    "images": [
      "/gallery/key-cutting-machine.jpg"
    ],
    "cover_image": "/gallery/key-cutting-machine.jpg",
    "description": "Factory-spec computerized automatic laser key cutting machine operating inside mobile van for precision roadside key origination.",
    "date_badge": "1 week ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-yale-smart-lock",
    "display_order": 10,
    "title": "Yale Keyless Touchscreen Smart Deadbolt Installation",
    "category": "locks",
    "category_label": "Residential Locks",
    "location": "Manchester, NH",
    "images": [
      "/gallery/technician-work-2.jpg",
      "/gallery/technician-work-1.jpg"
    ],
    "cover_image": "/gallery/technician-work-2.jpg",
    "description": "Complete inside-and-outside smart lock upgrade: Yale touchscreen electronic deadbolt installed on residential front door with safety chain.",
    "date_badge": "Today",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-multlock-cylinder",
    "display_order": 9,
    "title": "Mul-T-Lock MTL 800 High-Security Cylinder & Keys",
    "category": "locks",
    "category_label": "Residential Locks",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/multlock-high-security-cylinder.jpg"
    ],
    "cover_image": "/gallery/jobs/multlock-high-security-cylinder.jpg",
    "description": "Apartment entry security upgrade: pick-proof, drill-resistant Mul-T-Lock MTL 800 interactive cylinder system with duplicated restricted keys.",
    "date_badge": "Yesterday",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-blue-door-cylinder",
    "display_order": 8,
    "title": "High-Security Cylinder & Architectural Lever Installation",
    "category": "locks",
    "category_label": "Residential Locks",
    "location": "Concord, NH",
    "images": [
      "/gallery/van-work.jpg"
    ],
    "cover_image": "/gallery/van-work.jpg",
    "description": "Modern entrance door security: high-security cylinder, architectural lever handle, and precision dimple keys on entrance door.",
    "date_badge": "3 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-brass-deadbolt-lockset",
    "display_order": 7,
    "title": "Polished Brass Deadbolt & Entry Knob Lockset Upgrade",
    "category": "locks",
    "category_label": "Residential Locks",
    "location": "Bedford, NH",
    "images": [
      "/gallery/technician-work-3.jpg"
    ],
    "cover_image": "/gallery/technician-work-3.jpg",
    "description": "Classic residential entry upgrade: heavy solid brass deadbolt lock and matching knob lockset keyed alike on apartment door.",
    "date_badge": "4 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-interior-knob-latch",
    "display_order": 6,
    "title": "Interior Door Passage Knob & Latch Assembly",
    "category": "locks",
    "category_label": "Residential Locks",
    "location": "Londonderry, NH",
    "images": [
      "/gallery/lock-repair-door.jpg"
    ],
    "cover_image": "/gallery/lock-repair-door.jpg",
    "description": "Home door hardware replacement: modern matte black passage knob and latch mechanism installation on interior wooden door.",
    "date_badge": "1 week ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-storefront-mortise",
    "display_order": 5,
    "title": "Storefront Glass Door Mortise Lock & Lever Handle",
    "category": "commercial",
    "category_label": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/storefront-mortise-lock-1.jpg",
      "/gallery/jobs/storefront-mortise-lock-2.jpg"
    ],
    "cover_image": "/gallery/jobs/storefront-mortise-lock-1.jpg",
    "description": "Commercial storefront entrance door service: front mortise cylinder replacement, heavy-duty latch mechanism, and commercial lever handle.",
    "date_badge": "Yesterday",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-securitech-multipoint",
    "display_order": 4,
    "title": "Securitech Multi-Point Commercial Entrance Lock Service",
    "category": "commercial",
    "category_label": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/securitech-multipoint-lock.jpg"
    ],
    "cover_image": "/gallery/jobs/securitech-multipoint-lock.jpg",
    "description": "Multi-point deadlocking security mechanism and heavy-duty architectural lever set serviced on commercial entrance door with intercom.",
    "date_badge": "2 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-commercial-panic-bar",
    "display_order": 3,
    "title": "Heavy-Duty Emergency Panic Exit Crash Bar Installation",
    "category": "commercial",
    "category_label": "Commercial Doors",
    "location": "Concord, NH",
    "images": [
      "/gallery/jobs/commercial-panic-bar-exit.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-panic-bar-exit.jpg",
    "description": "Life safety & fire-code compliant commercial panic exit push bar and exterior rim cylinder trim installed on heavy steel exit door.",
    "date_badge": "3 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-electric-strike-frame",
    "display_order": 2,
    "title": "Access Control Low-Voltage Electric Strike Frame Retrofit",
    "category": "commercial",
    "category_label": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/commercial-electric-strike.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-electric-strike.jpg",
    "description": "Precision metal frame cutout and low-voltage electric strike installation for building intercom buzzer integration.",
    "date_badge": "5 days ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  },
  {
    "id": "g-steel-door-mortise",
    "display_order": 1,
    "title": "Commercial Steel Door Mortise Lock Replacement",
    "category": "commercial",
    "category_label": "Commercial Doors",
    "location": "Nashua, NH",
    "images": [
      "/gallery/jobs/commercial-steel-door-mortise.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-steel-door-mortise.jpg",
    "description": "Heavy-duty brass mortise cylinder installation, deadlocking latch service, and exterior handle alignment on warehouse steel door.",
    "date_badge": "1 week ago",
    "is_active": true,
    "created_at": "2026-10-10T12:00:00.000Z"
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: "srv-1",
    category: "emergency",
    title: "24/7 Car Lockout Rescue",
    slug: "car-lockout",
    description: "Keys locked inside sedan, SUV, pickup, or trunk. Rapid 15-20 min arrival across Manchester & surrounding NH with 100% damage-free air-wedge entry.",
    estimated_duration_min: 15,
    is_active: true,
    display_order: 1,
    features: [
      "100% Damage-Free Guarantee",
      "No Broken Windows or Scratched Frames",
      "Mobile Locksmith Units in Manchester & Surrounding NH",
      "Direct Call Dispatch +1 (603) 290-5554"
    ],
    icon_name: "Car"
  },
  {
    id: "srv-2",
    category: "residential",
    title: "House & Apartment Lockout",
    slug: "house-lockout",
    description: "Emergency front door, deadbolt, mortise, and cylinder lockout assistance. Quick pick and entry for apartments, brownstones, and houses.",
    estimated_duration_min: 20,
    is_active: true,
    display_order: 2,
    features: [
      "No Door Chipping or Lock Destruction",
      "Schlage, Kwikset, Yale, Medeco Pick Specialists",
      "Keys Cut On-Site in Mobile Service Unit",
      "Mandatory Ownership / Lease ID Verification"
    ],
    icon_name: "Home"
  },
  {
    id: "srv-3",
    category: "residential",
    title: "Lock Change & Re-Keying",
    slug: "lock-change",
    description: "Complete lock replacement, fresh deadbolt installations, cylinder re-keying, and security upgrades for tenants, new buyers, and landlords.",
    estimated_duration_min: 30,
    is_active: true,
    display_order: 3,
    features: [
      "Fresh High-Security Deadbolt Upgrades",
      "New Keys Cut and Tested on the Spot",
      "Grade 1 & Grade 2 Certified Cylinders",
      "Master Key Setup for Manchester & NH Properties"
    ],
    icon_name: "Zap"
  },
  {
    id: "srv-4",
    category: "automotive",
    title: "Car Key Cutting & Fob Programming",
    slug: "auto-key-fob",
    description: "Laser-cut high-security transponder keys, push-to-start smart fobs, and OBD-II diagnostics roadside without expensive flatbed towing.",
    estimated_duration_min: 25,
    is_active: true,
    display_order: 4,
    features: [
      "No Expensive Roadside Towing Needed",
      "Supports 98% of US & Foreign Vehicles",
      "On-Site OBD-II Diagnostic Pairing",
      "Proximity Push-To-Start Smart Remote Blanks"
    ],
    icon_name: "Car"
  },
  {
    id: "srv-5",
    category: "commercial",
    title: "Commercial Storefront Locks & Panic Bars",
    slug: "commercial-security",
    description: "Storefront rim cylinders, mortise locks, ADA exit panic crash bars, and master key systems for retail stores and commercial properties.",
    estimated_duration_min: 45,
    is_active: true,
    display_order: 5,
    features: [
      "Fire Marshal & ADA Code Compliant",
      "Heavy Steel Commercial Hardware",
      "Same-Day Emergency Storefront Dispatch",
      "Corporate Billing & Invoicing Available"
    ],
    icon_name: "Building2"
  }
];

export const initialCoverageAreas: CoverageArea[] = [
  { id: "cov-1", zip_code: "03101", city: "Downtown Manchester", county: "Hillsborough County", state: "NH", avg_eta_minutes: 15, is_serviceable: true, active_units: 4 },
  { id: "cov-2", zip_code: "03104", city: "North End Manchester", county: "Hillsborough County", state: "NH", avg_eta_minutes: 15, is_serviceable: true, active_units: 3 },
  { id: "cov-3", zip_code: "03110", city: "Bedford", county: "Hillsborough County", state: "NH", avg_eta_minutes: 16, is_serviceable: true, active_units: 3 },
  { id: "cov-4", zip_code: "03301", city: "Concord", county: "Merrimack County", state: "NH", avg_eta_minutes: 20, is_serviceable: true, active_units: 2 },
  { id: "cov-5", zip_code: "03060", city: "Nashua", county: "Hillsborough County", state: "NH", avg_eta_minutes: 20, is_serviceable: true, active_units: 3 },
  { id: "cov-6", zip_code: "03038", city: "Derry", county: "Rockingham County", state: "NH", avg_eta_minutes: 18, is_serviceable: true, active_units: 2 },
  { id: "cov-7", zip_code: "03053", city: "Londonderry", county: "Rockingham County", state: "NH", avg_eta_minutes: 17, is_serviceable: true, active_units: 3 },
  { id: "cov-8", zip_code: "03106", city: "Hooksett", county: "Merrimack County", state: "NH", avg_eta_minutes: 16, is_serviceable: true, active_units: 2 }
];

export const initialTestimonials: Testimonial[] =
  ((googleReviewsCache as any)?.reviews as unknown as Testimonial[]) || [
    {
      id: "test-1",
      author_name: "Steve Plante",
      location: "Manchester, NH & Surrounding Areas",
      rating: 5,
      review_text: "I stupidly locked my car with the keys and my dog inside. I was kind of stressed. They came within 15 minutes and unlocked. Luckily for me it was a cool day.\nFabulous service.. Highly recommend.",
      service_type: "Automotive Key & Lockout Rescue",
      verified_customer: true,
      is_featured: true,
      is_approved: true,
      created_at: "2026-09-09T20:54:40.646Z",
      author_photo: "https://lh3.googleusercontent.com/a-/ALV-UjWOJifUXl9PDFfz5tXl6gnte36qHc4dUKF3svW5k3PNw5FSZYfcxQ=s64-c-rp-mo-ba12-br100",
      review_url: "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
    }
  ];

export const initialDispatchRequests: DispatchRequest[] = [
  {
    id: "req-102",
    created_at: "2026-10-12T19:30:00Z",
    updated_at: "2026-10-12T19:30:00Z",
    customer_name: "Callback Request",
    phone: "(603) 555-0198",
    zip_code: "03104",
    address: "North End, Manchester, NH",
    service_category: "automotive",
    service_sub_type: "Car Lockout / Vehicle Key",
    vehicle_make: "Toyota",
    vehicle_model: "Camry",
    vehicle_year: "2021",
    status: "new",
    estimated_price_min: 75,
    estimated_price_max: 120,
    final_price: null,
    assigned_technician: null,
    internal_notes: "Keys locked in trunk at grocery store parking lot. Customer requested immediate callback.",
    source: "callback_modal"
  },
  {
    id: "req-101",
    created_at: "2026-10-07T08:45:00Z",
    updated_at: "2026-10-07T08:52:00Z",
    customer_name: "Robert M.",
    phone: "(603) 290-5554",
    zip_code: "03101",
    address: "Elm Street, Manchester, NH",
    service_category: "emergency",
    service_sub_type: "House Lockout - Deadbolt Jammed",
    vehicle_make: null,
    vehicle_model: null,
    vehicle_year: null,
    status: "in_progress",
    estimated_price_min: 75,
    estimated_price_max: 115,
    final_price: null,
    assigned_technician: "Unit 2 - Manchester Mobile Unit",
    internal_notes: "Customer verified lease + ID. Working on front entrance deadbolt.",
    source: "direct_call"
  }
];

export const estimatorCategories = [
  {
    id: "automotive",
    name: "Car Lockout & Keys",
    icon: "Car",
    scenarios: [
      { id: "auto-lockout", label: "Car Door / Trunk Lockout Rescue", eta: "15-20 mins", notes: "100% Non-destructive air-wedge & specialized reach tools" },
      { id: "auto-lost-key", label: "All Car Keys Lost (On-Site Origination)", eta: "25-35 mins", notes: "Laser cut & OBD-II ECU computer pairing on the street" },
      { id: "auto-duplicate-fob", label: "Spare Key Fob Duplication", eta: "20-30 mins", notes: "Push-to-start smart proximity remote blanks" },
      { id: "auto-broken-key", label: "Broken Key Extracted from Door / Ignition", eta: "15-20 mins", notes: "Precision extraction tools, no lock replacement required" }
    ]
  },
  {
    id: "residential",
    name: "House & Apartment",
    icon: "Home",
    scenarios: [
      { id: "res-lockout", label: "Locked Out of Apartment / House", eta: "15-20 mins", notes: "Damage-free cylinder picking for deadbolts & mortise locks" },
      { id: "res-lock-change", label: "Lock Change / New Cylinder Installation", eta: "Same-Day / Scheduled", notes: "Fresh high-security locks + keys cut on-site" },
      { id: "res-rekey", label: "Lock Re-Keying (Per Cylinder)", eta: "Same-Day", notes: "Keep current locks, change internal pins for new keys" },
      { id: "res-broken-key", label: "Key Snapped in Deadbolt Cylinder", eta: "15-20 mins", notes: "Non-destructive extraction + fresh key duplicate" }
    ]
  },
  {
    id: "commercial",
    name: "Commercial Storefront",
    icon: "Building2",
    scenarios: [
      { id: "comm-lockout", label: "Storefront / Commercial Lockout", eta: "15-25 mins", notes: "Commercial mortise & rim cylinder bypass" },
      { id: "comm-panic-bar", label: "Panic Crash Bar Exit Device Repair", eta: "Same-Day", notes: "Fire Code & ADA compliant repair" },
      { id: "comm-master-key", label: "Storefront Master Key System", eta: "Scheduled", notes: "Multi-door tiered master key hierarchy" }
    ]
  }
];
