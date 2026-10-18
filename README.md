# 🔑 Local Lock & Key Service — 24/7 Mobile Locksmith & Dispatch Platform

A production-ready, ultra-fast web platform and administrative dispatch system for emergency and scheduled mobile locksmith services in Manchester, NH and throughout Southern New Hampshire. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase (PostgreSQL + Auth + Storage)**.

---

## 🌟 Key Features

### 🚀 Public Experience
- **24/7 Mobile Dispatch:** Instant call-to-action triggers, direct phone dialer integration, and interactive on-demand callback request flow.
- **Compact & High-Converting Service Grid:**
  - **Automotive Locksmith:** Car lockouts, laser key cutting, smart key fob programming roadside.
  - **Residential Locksmith:** Rekeying, lock replacement, fresh deadbolt boring, kick-in reinforcement.
  - **Commercial Security:** ADA panic exit bars, master key systems, Grade 1 mortise & storefront locks.
  - **Safe & Vault:** Non-destructive dial manipulation, electronic keypad diagnostics, combination resets.
- **Detailed Service Modal:** Fast, focused popup displaying service scope, procedures, and capabilities with one-click category switching.
- **Dynamic Recent Jobs Gallery:** Clean visual showcase of completed field work across New Hampshire with tag filtering and full-screen image preview.
- **Verified Customer Reviews:** Google Reviews integration with 5.0-star rating summary and real client feedback.
- **Collapsible NH Coverage Directory:** Comprehensive directory covering 63+ towns and ZIP codes across 6 key regions (Manchester, Greater Manchester, Nashua, Concord, Salem/Derry, and Laconia) with live search and collapsible accordions.
- **Local SEO & Schema.org:** Pre-configured JSON-LD Structured Data (`Locksmith` / `LocalBusiness`), OpenGraph tags, dynamic `sitemap.xml`, and clean search engine indexing.

### 🛡️ Secure Admin Portal (`/admin`)
- **Interactive Dispatch Kanban & Table:** Real-time job lifecycle tracking (`pending` ➔ `assigned` ➔ `in_progress` ➔ `completed` ➔ `cancelled`).
- **CMS Content Management:** Manage site copy, service categories, job portfolio, and service area data without redeploying.
- **Audit Logs:** Automated tracking of all admin actions and critical system security events.
- **Enterprise-Grade Database Security:**
  - Supabase SSR Cookie-based authentication.
  - Protected API routes and page-level middleware guards.
  - PostgreSQL Row-Level Security (RLS) policies.
  - Search path hardening (`SET search_path = ''` / `public, auth`) and isolated private schemas (`app_private`) to prevent search path hijacking.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL 15+, Auth, Storage)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/locksmith.git
cd locksmith
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your configuration:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DISPATCH_PHONE` | Formatted phone number (e.g. `+1 (603) 290-5554`) |
| `NEXT_PUBLIC_DISPATCH_PHONE_RAW` | Tel link protocol (e.g. `tel:+16032905554`) |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | WhatsApp number with country code |
| `NEXT_PUBLIC_APP_NAME` | Business brand name |
| `NEXT_PUBLIC_CITY_REGION` | Operating service region |
| `NEXT_PUBLIC_SITE_URL` | Production website URL (e.g. `https://locallockkeyservice.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret key |
| `GOOGLE_PLACES_API_KEY` | Google Places API key (optional for reviews sync) |
| `NEXT_PUBLIC_GOOGLE_PLACE_ID` | Google Place ID for business reviews |

### 3. Setup Supabase Database

Run the consolidated SQL setup script in your Supabase SQL Editor:
- Execute `supabase/full_setup_with_admin.sql` to initialize tables, RLS policies, storage buckets, and default admin seed data.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build & Testing

Ensure TypeScript, ESLint, and Next.js static page generation pass cleanly:

```bash
# Run linting check
npm run lint

# Compile optimized production build
npm run build

# Start production server locally
npm run start
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into **Vercel**.
3. Add the environment variables from `.env.example` in project settings.
4. Set up your custom domain under **Settings > Domains** and configure the required DNS records (`A` & `CNAME`).

---

## 📄 License

Private & Proprietary © Local Lock & Key Service. All Rights Reserved.
