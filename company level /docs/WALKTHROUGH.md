# Tuckit Admin Control Center — Comprehensive Agent Walkthrough & Operations Manual

> **Location:** `company level/docs/WALKTHROUGH.md`  
> **Last Updated:** 2026-08-17  
> **Status:** Active Production Replica (Frontend-First, 100% In-Memory Reactive State)

---

## 🚨 MANDATORY PROTOCOL FOR ALL AI AGENTS & CONTRIBUTORS

> [!IMPORTANT]
> **RULE 1: START OF SESSION — ALWAYS READ THIS FILE FIRST**  
> Before making any code modifications, architectural changes, or creating new features, any AI agent or engineer working on this repository **MUST** read this file (`company level/docs/WALKTHROUGH.md`) and `DESIGN.md` in full to understand the existing state, established architectural patterns, and design constraints.

> [!IMPORTANT]
> **RULE 2: END OF SESSION — ALWAYS UPDATE THIS LOG BEFORE PUSHING**  
> Before running `git push` to GitHub, you **MUST** append a comprehensive record to the [Changelog & Session Trajectory](#chronological-changelog--trajectory-history) section at the bottom of this file. The record must include:
> 1. **Session Date & Context**
> 2. **Previous State** (What was broken, missing, or in progress)
> 3. **Exact Changes Made** (Components modified/created, state logic added)
> 4. **Files Touched** (Clickable file links)
> 5. **Verification & Build Results** (`npm run build` verification output)
> 6. **Git Commit Hash**

---

## 1. Project Overview & Architecture

### Tech Stack
- **Framework:** React 18 + TypeScript + Vite 5 + Tailwind CSS v3
- **Routing:** `react-router-dom` v6 with SPA wildcard rewrites for Vercel (`vercel.json`), Netlify (`netlify.toml`), and static hosting (`public/_redirects`).
- **Icons:** `lucide-react`
- **State Architecture:** Client-side in-memory reactive stores (`AuthContext.tsx`, `RealtimeContext.tsx`) with zero external backend dependencies. Data is seeded from authentic production dataset (`mockData.ts`) containing 238 terminals, 191 sites across 20 Indian states, 143 internal admins, 125 roles, and 81 live telemetry alarms.

### Design System & Visual Philosophy
Strict adherence to `DESIGN.md` structural guidelines:
- **Brand Accent:** `#F97316` (Tuckit Orange) is the sole vibrant accent across the entire app. Never use Intercom's literal `#ff5600`.
- **Typography:** `Inter` (Google Fonts) using weight 500 for display/headings with negative letter-spacing, weight 400 for body text. `JetBrains Mono` for hardware codes/telemetry/timestamps.
- **Surfaces & Borders:** Flat zinc surfaces (`surface.canvas` `#F9FAFB`, `surface.1` `#FFFFFF`, `surface.2` `#F4F4F5`) with 1px hairline borders (`border-hairline` `#E4E4E7`). **No heavy shadows, no loud gradients, no decorative orbs.**
- **Radius Scale:** `xs` (4px), `sm` (6px for badges), `md` (8px for inputs/buttons), `lg` (12px for cards), `xl` (16px for modals/drawers).

---

## 2. Navigation IA & Route Structure

The console utilizes a **persistent vertical left sidebar rail** (256px wide, collapsible to 64px icon rail) organized into 4 logical groups:

| Group | Route | Label | Purpose |
|---|---|---|---|
| **Main** | `/dashboard` | Dashboard & Main View | Real-time booking table, PII masking toggles, quick date presets, export controls |
| | `/reports` | Reports & Analysis | Executive financial KPIs, source share analytics, 4 dedicated export cards |
| | `/device-status` | Device / Terminal Status | Full 238-terminal IoT kiosk status, network diagnostics, grid & list view pagination |
| | `/locker-status` | Locker Status | Interactive physical door grid, drawer door inspector, vacate/maintenance controls |
| | `/future-first` | Future First | Partner station telemetry (Solar wattage, Battery charge, RF signal dBm) |
| **PESIT Locker** | `/pesit-terminals` | PESIT Terminals | Campus kiosk cluster with tiered bulk solenoid release & credentials SMS |
| | `/pesit-students` | Student Management | Student roster, RFID card bindings, roll number search, allocation approvals |
| | `/pesit-managers` | Locker Managers | On-campus floor wardens and physical locker supervisors |
| **Revenue & Billing** | `/refund-requests` | Refund Requests | Pending customer refund queue with approval/rejection audit trail |
| | `/refund-history` | Refund History | Historical resolved refunds, gateway reference logs, settled amounts |
| | `/pricing` | Pricing Control | Dynamic tariff rules, base hourly rates, penalty slabs, promotional discounts |
| | `/state-gst` | State GST Config | Inter-state IGST vs. intra-state CGST/SGST tax slabs by jurisdiction |
| | `/staff-credit` | Staff Credit Request | Field executive pocket allowances and cash top-up approval queue |
| | `/staff-profiles` | Staff Profiles | Field technician cash-handling profiles and balance tracking |
| **User Management** | `/users` | Customers | Public customer registry, booking history count, verification status |
| | `/admins` | Internal Admins | Operations console staff, assigned role profiles, account active state |
| | `/employee-monitor` | Employee Monitor | Real-time staff audit stream, active IP addresses, last seen tracking |
| | `/roles` | Roles & RBAC | 2-column permission matrix across 4 category groups |
| | `/blacklist-history` | Block / Unblock History | User restriction logs, block reasons, unblock timestamps |
| | `/audit-logs` | Audit Logs | Immutable security event log (PII reveals, exports, reboots, force unlocks) |
| **System** | `/profile` | Profile | Operator account overview and security preferences |
| | `/alerts` | System Alerts | Real-time critical hardware alerts, remote reboot triggers, alarm acknowledgments |
| **Overlay** | N/A | Control Center Drawer | Global drawer for remote screen streams, AWS S3 OTA updates, batch terminal console |

---

## 3. Trust, Safety & Security Rules (P0 Guidelines)

1. **PII Masking by Default:**
   - Date of Birth (`b.dateOfBirth`) and Door Passcodes (`b.passcode`) **MUST** render masked (`••••-••-••` / `••••`) everywhere by default (table cells, modals, drawer inspectors).
   - Unmasking requires explicit operator action and automatically generates an audit log entry (`PII_REVEAL` or `PII_EXPORT_UNMASKED`).
2. **Destructive Action Friction:**
   - Any destructive action (door solenoid release, force unlock, reboot, bulk unlock, blacklist) **MUST** use `DestructiveActionModal.tsx`.
   - Reason field **MUST** start empty and be strictly required.
   - Bulk/Fleet actions require typed confirmation of the target kiosk code.
3. **Zero Artificial Slice Caps:**
   - Never use `.slice(0, 30)` or `.slice(0, 50)` on terminal dropdowns.
   - Always use `SearchableSelect.tsx` (combobox with type-ahead search) or pagination (`paginatedTerminals`).

---

## Chronological Changelog & Trajectory History

### [2026-08-17] — P1: Navigation IA & Design System Overhaul
- **Commit:** `83b4949`
- **Previous State:**
  - Horizontal top navbar with dropdown menus was cramped, caused horizontal overflow on medium screens, and lacked hierarchical clarity for 23 routes.
  - Components had inconsistent border radii (`rounded-2xl`, `rounded-3xl`), heavy drop shadows, and dark/colored background surfaces.
  - Login page featured heavy blur orbs and loud gradients inconsistent with `DESIGN.md`.
- **Changes Made:**
  - Built persistent left sidebar (`Sidebar.tsx`) with 4 collapsible groups, active left-accent bars, badge counters, and collapse toggle.
  - Built standalone mobile navigation drawer (`MobileNav.tsx`).
  - Redesigned `Layout.tsx` with horizontal sidebar offset and 48px sticky top bar featuring breadcrumbs and alert bell.
  - Upgraded `tailwind.config.js` and `index.css` with DESIGN.md surface/ink tokens, typography scale with paired letter-spacing, and radius scale.
  - Reskinned `StatusBadge.tsx` (`rounded-sm`, 500 weight), `Modal.tsx` (`rounded-xl`, hairline border, `shadow-card`), `Toast.tsx` (white surface, hairline border), `Drawer.tsx`, and `Login.tsx`.
- **Files Modified / Created:**
  - `company level/src/components/layout/Sidebar.tsx` (NEW)
  - `company level/src/components/layout/MobileNav.tsx` (NEW)
  - `company level/src/components/layout/Layout.tsx`
  - `company level/src/components/common/StatusBadge.tsx`
  - `company level/src/components/common/Modal.tsx`
  - `company level/src/components/common/Toast.tsx`
  - `company level/src/components/common/Drawer.tsx`
  - `company level/src/pages/Login.tsx`
  - `company level/tailwind.config.js`
  - `company level/src/index.css`
- **Verification:** `npm run build` passed with 0 errors (built in 824ms).

---

### [2026-08-16] — P0: Trust, Safety & Scale Fixes
- **Commits:** `84c7601`, `506c3aa`, `1a669f4`
- **Previous State:**
  - Passcodes and DOBs were visible in plain text in certain table cells and CSV exports.
  - Destructive modals had prefilled justification strings and inconsistent confirmation friction.
  - Terminal select dropdowns were capped with `.slice(0, 30)` and `.slice(0, 50)`, hiding 180+ terminals from operators.
- **Changes Made:**
  - Masked DOB and Passcodes by default in table, detail drawer, and CSV exports. Added export options modal with audit logging.
  - Created `DestructiveActionModal.tsx` with tiered friction (single, bulk, fleet), mandatory empty reason, and typed code confirmation.
  - Created `SearchableSelect.tsx` with type-ahead search and converted all capped terminal dropdowns.
  - Added full fleet pagination across `DeviceStatus.tsx` and `LockerStatus.tsx`.
- **Files Modified / Created:**
  - `company level/src/components/common/DestructiveActionModal.tsx` (NEW)
  - `company level/src/components/common/SearchableSelect.tsx` (NEW)
  - `company level/src/pages/Dashboard.tsx`
  - `company level/src/pages/DeviceStatus.tsx`
  - `company level/src/pages/LockerStatus.tsx`
  - `company level/src/pages/Reports.tsx`
  - `company level/src/pages/PESITTerminals.tsx`
  - `company level/src/components/control-center/ForceUnlockModal.tsx`
  - `company level/src/components/control-center/TerminalRebootModal.tsx`
  - `company level/src/components/control-center/SmsUnlockModal.tsx`
  - `company level/src/components/control-center/RemoteAssistanceModal.tsx`
  - `company level/src/components/modals/BlacklistUserModal.tsx`
  - `company level/src/context/RealtimeContext.tsx`
- **Verification:** `npm run build` passed with 0 errors.

---

### [2026-08-16] — Production Deployment Fixes (Vercel & Netlify SPA Wildcard Rewrites)
- **Commits:** `79c9112`, `a932cb8`
- **Previous State:**
  - Build failed on CI (`sh: tsc: command not found`).
  - Hard refresh on sub-routes (`/dashboard`, `/reports`, etc.) resulted in 404 Not Found on Vercel and Netlify.
- **Changes Made:**
  - Moved `typescript` and `vite` to production dependencies and added build hooks.
  - Added `vercel.json` rewrites (`"source": "/(.*)", "destination": "/index.html"`).
  - Added `netlify.toml` redirects (`from = "/*" to = "/index.html" status = 200`).
  - Added `company level/public/_redirects` (`/* /index.html 200`).
- **Files Modified / Created:**
  - `vercel.json`
  - `netlify.toml`
  - `company level/public/_redirects` (NEW)
  - `company level/vercel.json` (NEW)
  - `company level/package.json`
  - `package.json`

---

### [2026-08-15] — 1:1 Parity & Feature Expansion Pass
- **Commit:** `c95dbe2`
- **Changes Made:**
  - Implemented 1:1 replica of `Reports.tsx` (Executive KPI Summary, Source Share, 4 Export Cards, Column Customizer).
  - Implemented `FutureFirst.tsx` (Telemetry sensor stream, battery charge %, solar wattage, RF dBm).
  - Implemented `PESITTerminals.tsx`, `PESITStudents.tsx`, and `PESITManagers.tsx`.
  - Implemented `RefundHistory.tsx` with settled/pending KPI summary and gateway reference audit trail.
  - Implemented `Roles.tsx` with 2-column interactive RBAC matrix and role creation modal.
  - Implemented `SystemAlerts.tsx` with live telemetry alarm triage and remote reboot triggers.
  - Created Control Center IoT Simulator (Live touch screen remote stream, AWS S3 4-stage OTA pipeline, batch terminal execution console).
