"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Car,
  Home,
  Building2,
  Lock,
  Wrench,
  MapPin,
} from "lucide-react";

export interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onOpenCallback?: () => void;
  phoneRaw?: string;
  phoneDisplay?: string;
}

interface CoreCapability {
  title: string;
  description: string;
}

interface ServiceData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  description: string[];
  coreCapabilities: CoreCapability[];
  servicesList: string[];
  tradeTip: {
    title: string;
    text: string;
  };
  extraDetails?: {
    label: string;
    items: string;
  };
  coverageNote: string;
}

const SERVICES_DATA: Record<string, ServiceData> = {
  automotive: {
    id: "automotive",
    title: "Automotive Locksmith Services",
    subtitle: "24/7 Car Lockout Rescue, On-Site Laser Key Cutting & Smart Key Fob Programming",
    icon: Car,
    badge: "Roadside Key Cutting • On-Site OBD-II Diagnostics",
    description: [
      "Locked your keys in the trunk at a grocery store in Manchester, or lost your only car key while commuting along I-93? Skip the costly flatbed tow truck and long dealership delays. Local Lock & Key Service operates mobile roadside locksmith vans equipped with computerized CNC laser key-cutting machines and advanced OBD-II diagnostic programming tablets.",
      "We unlock vehicles safely using precision automotive air wedges and coated stainless bypass reach tools to safely operate interior lock latches without bending window frames, tearing weatherstripping, or scratching paint. When all keys are lost, we originate new high-security sidewinder keys by reading mechanical door lock wafers with Lishi tools, then program transponder chips and push-to-start smart fobs directly into your vehicle's ECU immobilizer.",
    ],
    coreCapabilities: [
      {
        title: "Vehicle & Locked Trunk Opening",
        description:
          "Our technicians use scratch-free air jacks and linkage bypass tools to unlock foreign and domestic cars, pickup trucks, and commercial vans. No blown airbags, no bent doors, and no scratched window tint.",
      },
      {
        title: "On-Site CNC Laser Key Cutting",
        description:
          "Modern vehicles use high-security 4-track or sidewinder laser-cut key blades. Our vans carry automated computerized cutting machines that cut fresh keys precisely to factory code tolerances.",
      },
      {
        title: "Smart Key Fobs & Proximity Programming",
        description:
          "We program push-to-start smart fobs, remote-head keys, and transponder chips roadside via OBD-II diagnostics. Stolen or lost keys are cleared from your vehicle's memory for total security.",
      },
      {
        title: "Ignition Cylinder Repair & Wafer Rebuilding",
        description:
          "If your key sticks, binds, or refuses to turn in the ignition (common on Ford, Chevy, and Honda vehicles), we rebuild the worn brass wafer tumblers on-site without costly steering column replacement.",
      },
    ],
    servicesList: [
      "24/7 Car door and locked trunk opening",
      "Push-to-start smart proximity key fob programming on-site",
      "All-keys-lost origination roadside (no dealership towing needed)",
      "Computer-guided laser & high-security sidewinder key cutting",
      "Broken key extraction from door locks and ignition cylinders",
      "Ignition cylinder rebuilding, wafer replacement & switch repair",
      "Remote keyless entry (RKE) fob pairing & remote battery service",
      "Transponder chip cloning and ECU immobilizer synchronization",
    ],
    tradeTip: {
      title: "Tradesman Field Tip: Worn Ignition Wafers",
      text: "If your car key feels sticky or won't turn in the ignition switch, never force it with pliers or spray household WD-40 inside. Forcing the blade shears internal brass wafers or snaps the key in the tumbler. Call a technician—we rebuild or re-wafer the cylinder on-site so your original key turns smoothly.",
    },
    extraDetails: {
      label: "Vehicle Makes Serviced Roadside Across NH",
      items:
        "Ford, Chevrolet, GMC, RAM, Dodge, Jeep, Chrysler, Toyota, Honda, Nissan, Subaru, Lexus, Acura, Mazda, Hyundai, Kia, Infiniti, Lincoln, Cadillac, Buick, and commercial fleet vans.",
    },
    coverageNote:
      "Fast roadside dispatch covering Manchester, Bedford, Nashua, Concord, Derry, Salem, Londonderry, and highway corridors (I-93, Route 101, F.E. Everett Turnpike, Route 3).",
  },
  residential: {
    id: "residential",
    title: "Residential Locksmith Services",
    subtitle: "Lock Changes, Rekeying, Precision Door Prep & Lockout Assistance",
    icon: Home,
    badge: "Same-Day Mobile Van • Greater Manchester & NH",
    description: [
      "Whether you just bought a home in Manchester, moved into an apartment in Bedford, or found yourself locked out on your front porch, Local Lock & Key Service provides fast, honest residential locksmith solutions. Our mobile vans operate as fully equipped locksmith shops on wheels, carrying commercial-grade rekeying pin kits, factory deadbolts, passage handles, and keyed entry leversets from industry-standard brands like Schlage, Kwikset, Baldwin, and Yale.",
      "New England weather takes a toll on exterior entryways. Severe winter freeze-thaw cycles regularly cause wooden door frames to swell and shift, leading to binding deadbolts and latch failure. We do not just slap on cheap hardware—we align strike plates, anchor frames with 3-inch structural steel screws directly into the wall studs, and cut clean, factory-spec 2-1/8\" bores on un-prepped doors using precision alignment jigs.",
    ],
    coreCapabilities: [
      {
        title: "Cylinder Rekeying vs. Replacement",
        description:
          "If your existing lock bodies and handles are mechanically sound, rekeying saves you money. We re-pin the internal cylinder brass tumblers so old keys stop working immediately, keying all exterior doors to one convenient master key.",
      },
      {
        title: "Fresh Door Preparation & Deadbolt Boring",
        description:
          "Adding security to an exterior door with no existing deadbolt? We clamp professional steel boring jigs to drill clean 2-1/8\" cross-bores and 1\" edge bores without chipping wood or damaging composite doors.",
      },
      {
        title: "High-Security & Smart Keypad Upgrades",
        description:
          "Upgrade standard builder-grade locks to bump-proof, drill-resistant deadbolts with hardened steel pins, or install standalone digital touchscreen keypads for keyless family entry.",
      },
      {
        title: "Safe Non-Destructive Lockout Entry",
        description:
          "Locked outside your house or apartment? We bypass locks using specialized pin-picking tools, bump keys, and latch shims. We never drill out a functioning lock unless catastrophic internal failure has occurred.",
      },
    ],
    servicesList: [
      "Lock rekeying per cylinder (keyed alike or master keyed setups)",
      "Complete exterior lockset changes (deadbolts, knobs & levers)",
      "Fresh door preparation: boring 2-1/8\" holes & strike mortising",
      "House, apartment & condominium lockout entry",
      "Heavy-duty Grade 1 & Grade 2 deadbolt installation & upgrades",
      "Electronic digital keypad & smart lock retrofit installations",
      "Snapped key extraction from deadbolts & cylinder plug servicing",
      "Patio sliding glass door security bolts & mailbox lock swaps",
    ],
    tradeTip: {
      title: "Tradesman Field Tip: Rekeying vs. Replacing",
      text: "Homeowners moving into a new property rarely need to buy all new door locksets. If your current locks (Schlage, Kwikset) are in good mechanical condition, rekeying replaces the internal brass pins at a fraction of the hardware cost. We also install 3-inch framing screws into strike plates to prevent forced kick-ins.",
    },
    extraDetails: {
      label: "Hardware & Brands Stocked On Mobile Vans",
      items:
        "Schlage (C Keyway), Kwikset (KW1 / SmartKey), Baldwin, Yale, Medeco, Mul-T-Lock, Arrow, Emtek, Defiant.",
    },
    coverageNote:
      "Same-day mobile dispatch across Manchester (North End, West Side, South Willow, Amoskeag), Bedford, Londonderry, Derry, Hooksett, Goffstown, Concord, and Merrimack.",
  },
  commercial: {
    id: "commercial",
    title: "Commercial Locksmith Services",
    subtitle: "Storefront Mortise Hardware, ADA Panic Exit Crash Bars & Master Key Systems",
    icon: Building2,
    badge: "NFPA 101 Fire Code & ADA Life Safety Compliant",
    description: [
      "Securing commercial properties, retail storefronts, corporate offices, warehouses, and medical clinics in Manchester demands heavy-duty hardware and strict compliance with New Hampshire life-safety regulations. Local Lock & Key Service delivers commercial door security solutions built to withstand heavy daily traffic and prevent unauthorized intrusion.",
      "We supply, install, and service Grade 1 mortise and cylindrical locks, Adams Rite storefront aluminum door deadlatches, and standalone digital keyless access systems. For business owners and property managers, we engineer tiered master key hierarchies that provide designated access control without carrying rings of keys. We also ensure that all emergency exit doors feature fully compliant, smooth-latching ADA and NFPA 101 fire-code crash panic exit devices.",
    ],
    coreCapabilities: [
      {
        title: "Storefront Mortise & Rim Lock Replacement",
        description:
          "We repair and replace worn Adams Rite deadlatches, hook bolts, and mortise cylinders on aluminum glass storefront doors across downtown Manchester, retail strip plazas, and business parks.",
      },
      {
        title: "ADA & Fire-Code Panic Crash Bar Installation",
        description:
          "Commercial egress doors must comply with New Hampshire building and fire safety codes. We install, repair, and dog down rim exit devices, mortise push bars, and vertical rod hardware for safe single-action emergency egress.",
      },
      {
        title: "Tiered Master Key System Architecture",
        description:
          "We design multi-level master key charts (Grand Master, Master, Sub-Master, and Individual Office keys) for commercial landlords, property managers, and multi-tenant office suites.",
      },
      {
        title: "Restricted Keyways & Digital Keypads",
        description:
          "Prevent unauthorized key duplication at local hardware stores using patent-protected restricted keyways. We also install heavy-duty Grade 1 keyless keypad locks for employee PIN access.",
      },
    ],
    servicesList: [
      "Commercial lock replacement & heavy-duty Grade 1 leversets",
      "Storefront mortise cylinder & Adams Rite hook-bolt repair",
      "ADA & NFPA 101 compliant panic push crash bar installation",
      "Custom tiered master key hierarchy design & cylinder pinning",
      "Commercial rekeying after employee turnover or tenant transitions",
      "Restricted keyway cylinder installation (duplication control)",
      "Keyless standalone commercial digital keypad & PIN entry locks",
      "Commercial door closer adjustment, continuous hinges & latch alignment",
    ],
    tradeTip: {
      title: "Tradesman Field Tip: Fire Code Compliance",
      text: "New Hampshire fire marshals strictly enforce NFPA 101 Life Safety Code. Commercial exit doors must never require a key, special knowledge, or excessive effort to open from the inside. We verify proper single-action egress, positive latching, and fire-rated door closer operation during every commercial service call.",
    },
    extraDetails: {
      label: "Commercial Hardware Brands & Code Standards",
      items:
        "Adams Rite, Von Duprin, Sargent, Corbin Russwin, Schlage Commercial, Yale Commercial, Marks USA, Falcon. Compliant with NFPA 101 Life Safety, ANSI/BHMA Grade 1, and ADA Title III.",
    },
    coverageNote:
      "Dedicated commercial service for business centers, industrial parks, retail facilities, and office buildings in Manchester, Bedford, Nashua, Concord, Derry, and Londonderry.",
  },
  emergency: {
    id: "emergency",
    title: "24/7 Emergency Locksmith Dispatch",
    subtitle: "Rapid Mobile Priority Patrol for Residential, Vehicle, Commercial & Storage Lockouts",
    icon: ShieldCheck,
    badge: "24/7 On-Duty Dispatch • Upfront Quotes Before Arrival",
    description: [
      "Lockouts and lost keys happen without warning—early in the morning, late at night, or in the middle of a New England winter blizzard. When you are stranded outside your house on the West Side or locked out of your running vehicle in a parking lot, Local Lock & Key Service is on duty around the clock. Our mobile patrol units are stationed across Greater Manchester and Southern New Hampshire for rapid priority dispatch.",
      "We treat every lockout as an urgent emergency. Our vans carry specialized non-destructive picking tools, computerized key cutters, and fresh replacement deadbolts. We provide clear, transparent upfront quotes directly over the phone before our technician heads your way—no surprise travel surcharges, no nighttime price gouging, and no bait-and-switch fees. Our priority is always non-destructive entry to protect your property.",
    ],
    coreCapabilities: [
      {
        title: "24/7 Immediate Mobile Patrol Dispatch",
        description:
          "Our mobile locksmith patrol units operate 24 hours a day, 7 days a week, 365 days a year across Manchester, Bedford, Concord, and Nashua, ready to roll at a moment's notice.",
      },
      {
        title: "Safe Non-Destructive Entry Priority",
        description:
          "We bypass locked deadbolts, car doors, and commercial entrances using professional pin picking, bump tools, and air-shim bypass techniques. We only drill if hardware has suffered catastrophic internal mechanical failure.",
      },
      {
        title: "Urgent Rekeying & Post-Incident Security",
        description:
          "If your keys were stolen, lost with identification, or your locks were tampered with, we dispatch immediately to re-pin cylinders or install high-security deadbolts on the spot.",
      },
      {
        title: "Storage Units, Padlocks & Mailboxes",
        description:
          "Locked out of a self-storage locker or lost the key to your neighborhood USPS cluster mailbox? We cleanly cut or pick padlocks and replace mailbox cam locks with new factory keys on site.",
      },
    ],
    servicesList: [
      "24/7 Rapid mobile response for home, vehicle & office lockouts",
      "Roadside car door & locked trunk unlocking in any weather",
      "Late-night residential house, apartment & condo unlock",
      "Commercial storefront & office suite emergency lockout bypass",
      "Emergency lock rekeying and deadbolt replacement after theft or break-in",
      "Storage unit padlock removal and heavy disc lock bypass",
      "USPS approved cluster mailbox cylinder replacement & new keys",
      "On-site emergency key cutting when all keys are lost or missing",
    ],
    tradeTip: {
      title: "Tradesman Field Tip: What to Do While You Wait",
      text: "If you are locked out, wait in a warm, secure location (such as a neighbor's porch or nearby business). Never attempt to pry door frames with screwdrivers or butter knives—doing so bends latch bolts, ruins weatherstripping, and splits wooden jambs, costing hundreds in carpentry repairs. A skilled technician picks the lock open smoothly in minutes.",
    },
    extraDetails: {
      label: "Upfront Pricing & Dispatch Policy",
      items:
        "We quote transparent, flat upfront estimates before our mobile unit leaves the hub. No hidden travel fees, no fuel surcharges, and no surprise add-ons once our technician arrives on site.",
    },
    coverageNote:
      "Priority emergency dispatch covering Manchester, Bedford, Merrimack, Concord, Hooksett, Goffstown, Nashua, Derry, Salem, and Londonderry.",
  },
  safe: {
    id: "safe",
    title: "Safe & Vault Locksmith Services",
    subtitle: "Certified Safe Cracking, Non-Destructive Dial Manipulation & Boltwork Servicing",
    icon: Lock,
    badge: "Certified Safe Technicians • Discreet & Insured Service",
    description: [
      "Being locked out of a heavy gun safe, fireproof document container, commercial drop safe, or vault is stressful. Brute-force drilling or prying with power tools will destroy an expensive safe and can permanently ruin irreplaceable contents. Local Lock & Key Service provides certified, discreet safe opening and vault maintenance across Manchester and throughout New Hampshire.",
      "Our safe technicians focus on non-destructive entry methods. We utilize precision mechanical dial manipulation—reading wheel pack contact points and gate alignment by sound and feel—and electronic diagnostic override tools to resolve dead keypad solenoids and recover forgotten combinations. If internal mechanical failure forces a surgical opening, we use precision optical scope drilling and restore the safe with hardened ball-bearing hardplate plugs to preserve its UL fire and burglary rating.",
    ],
    coreCapabilities: [
      {
        title: "Non-Destructive Dial Manipulation",
        description:
          "For mechanical 3-wheel and 4-wheel combination dials, we decode the combination by reading contact points on the drive cam. We open the safe cleanly without a single scratch, keeping the safe fully operational.",
      },
      {
        title: "Electronic Keypad Diagnostics & Override",
        description:
          "When digital keypads stop beeping, solenoids fail, or wires disconnect, we diagnose electronic safe locks (La Gard, SecuRam, S&G) and perform electronic bypass or keypad component replacement.",
      },
      {
        title: "Combination Changes & Wheel Pack Servicing",
        description:
          "We reset mechanical safe combinations using change keys, lubricate wheel packs, adjust drive cams, and reprogram digital keypad master and user codes.",
      },
      {
        title: "Boltwork, Handle Cam & Relocker Repair",
        description:
          "Heavy gun safes and commercial vaults frequently suffer from jammed locking bolts, broken handle cams, or prematurely tripped relockers. We service carriage linkages and reset internal relock mechanisms.",
      },
    ],
    servicesList: [
      "Certified non-destructive safe & vault lockout opening",
      "Mechanical dial combination manipulation & gate decoding",
      "Electronic safe keypad troubleshooting, solenoid bypass & replacement",
      "Safe combination reset and mechanical wheel pack realignment",
      "Digital keypad retrofit upgrades for mechanical combination dials",
      "Jammed locking boltwork, carriage linkage & handle repairs",
      "Triggered mechanical relocker reset & hardplate restoration",
      "Commercial deposit drop safes, fireproof document boxes & gun vaults",
    ],
    tradeTip: {
      title: "Tradesman Field Tip: Electronic Safe Keypad Battery Tip",
      text: "If your electronic safe keypad beeps but won't pull the bolt open, always replace the battery with a fresh, brand-name alkaline 9V battery (Duracell or Energizer with a distant expiration date). Budget or rechargeable batteries often lack the instant amperage required to actuate the internal lock solenoid, even if the keypad lights up.",
    },
    extraDetails: {
      label: "Safe Makes & Lock Hardware Handled",
      items:
        "Liberty Safe, AMSEC (American Security), Cannon, Browning, SentrySafe, Gardall, Winchester, Fort Knox, Inkas, Mesa Safe, Champion, Rhino Metals. Lock hardware: Sargent & Greenleaf (S&G), La Gard, SecuRam, Kaba Mas.",
    },
    coverageNote:
      "Discreet, bonded, and certified on-site safe opening for homeowners, business owners, and commercial properties throughout New Hampshire.",
  },
};

export function ServiceDetailModal({
  isOpen,
  onClose,
  initialCategory = "automotive",
  onOpenCallback,
  phoneRaw = "tel:+16032905554",
  phoneDisplay = "+1 (603) 290-5554",
}: ServiceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<string>(initialCategory);

  useEffect(() => {
    if (initialCategory && SERVICES_DATA[initialCategory]) {
      setActiveTab(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentService = SERVICES_DATA[activeTab] || SERVICES_DATA.automotive;
  const Icon = currentService.icon;

  const categoriesList = [
    { id: "residential", label: "Residential", icon: Home },
    { id: "automotive", label: "Automotive", icon: Car },
    { id: "commercial", label: "Commercial", icon: Building2 },
    { id: "emergency", label: "Emergency", icon: ShieldCheck },
    { id: "safe", label: "Safe Locksmith", icon: Lock },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-5 animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header with Close Button - Icon, Title, and Close on a Single Line */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-[#faf9f6]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <h2 className="text-sm sm:text-base md:text-xl font-black text-slate-950 leading-snug">
              {currentService.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Quick Category Switcher Tabs - Spacious, Prominent & Refined */}
        <div className="px-3 sm:px-6 py-3 border-b border-slate-200/90 bg-slate-50/80 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {categoriesList.map((cat, idx) => {
              const isActive = activeTab === cat.id;
              const TabIcon = cat.icon;
              const isLast = idx === categoriesList.length - 1;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer active:scale-95 text-center ${
                    isLast ? "col-span-2 sm:col-span-1" : ""
                  } ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20 border border-slate-800 ring-2 ring-emerald-500/50"
                      : "bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-2xs"
                  }`}
                >
                  <TabIcon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${
                      isActive ? "text-emerald-400" : "text-slate-500"
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 pb-8 sm:pb-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed overscroll-contain">
          {/* Subtitle & Concise Narrative Description */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-emerald-800">
              {currentService.subtitle}
            </h3>
            {currentService.description.slice(0, 1).map((paragraph, pIdx) => (
              <p key={pIdx} className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Core Capabilities Breakdown */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-700" />
              <span>Core Service Capabilities:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentService.coreCapabilities.map((cap, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-emerald-300 transition"
                >
                  <h5 className="font-bold text-slate-950 text-xs sm:text-sm mb-1">
                    {cap.title}
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist: What's Included */}
          <div className="bg-[#faf9f6] rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Scope of Work &amp; Procedures:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentService.servicesList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar - Desktop Only (Hidden on Mobile as Floating Mobile Bar covers CTAs) */}
        <div className="hidden sm:flex p-4 sm:p-5 border-t border-slate-100 bg-[#faf9f6] items-center justify-between gap-3 shrink-0">
          <a
            href={phoneRaw}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-950 hover:bg-black text-white font-black text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Call Dispatch: {phoneDisplay}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCallback?.();
            }}
            className="flex-initial flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition active:scale-98 cursor-pointer shadow-sm"
          >
            <Clock className="w-4 h-4 text-emerald-100" />
            <span>Request a Callback</span>
          </button>
        </div>
      </div>
    </div>
  );
}
