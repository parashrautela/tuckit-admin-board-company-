# TUCKIT ADMIN — DEEP RESEARCH + ANTIGRAVITY BUILD SPEC
## Version 2.0 — August 2026

### Purpose
This document is intended to be fed directly to an AI coding agent such as Antigravity to build a production-quality recreation of the Tuckit Admin web application.

### Research scope
This specification combines:
1. The authenticated admin-panel screenshots supplied by the product team.
2. Public Tuckit product/help content researched from the web.
3. Explicit separation between **OBSERVED**, **PUBLICLY VERIFIED**, and **TO VERIFY** behavior.

### Important limitation
The authenticated `admin.tuckit.in` application could not be programmatically logged into from the available web environment. The supplied credentials were therefore **not used or stored in this file**. The private-admin findings below are based on the screenshots supplied in the conversation. Public Tuckit pages were researched independently.

---

# 1. PRODUCT CONTEXT

Tuckit is a self-service short-term locker platform. Customers access lockers through a web app or the touchscreen on a physical Tuckit terminal. Public product documentation describes QR-based access, location permission, mobile-number/OTP login, locker selection, duration selection, a 4-digit locker passcode, and payment. It supports baggage and mobile-phone storage flows. 

The public product documentation says baggage lockers have four standard size categories — Small, Medium, Large and Extra Large — although availability varies by location. Mobile lockers expose 2-phone, 4-phone and 8-phone options.

The public flow also supports:
- Keep / Store
- Pick Up
- Modify Booking
- Pick Up Mobile
- Pay Now
- Pay Later
- automatic extension for excess usage
- location-dependent operating hours
- location-dependent pricing
- QR access to a terminal
- terminal-specific locker availability

The admin product should therefore be treated as an **IoT + booking + payment + physical locker operations console**, not as a generic CRUD dashboard.

---

# 2. ADMIN INFORMATION ARCHITECTURE

## Top navigation observed

```text
Dashboard
Report Analysis
Terminal Management
Locker Status
PESIT
Revenue & Billing
Access Control
System
Control Center
```

Top-right:
```text
parash
SUPERADMIN
P avatar
```

Observed navigation characteristics:
- active module uses a dark underline/emphasis
- some modules have dropdown chevrons
- Revenue & Billing has notification badge `1`
- System has notification/bell indicator
- Control Center is a visually prominent dark CTA/button

## Recommended route map

Use semantic routes:

```text
/dashboard
/reports
/terminals
/lockers
/pesit
/revenue
/access
/system
/control-center
```

Actual private-app route names should be discovered from the live application if browser/network access is later available.

---

# 3. DOMAIN MODEL

The public customer experience and private admin screenshots imply this hierarchy:

```text
Organization
  └── Site
       ├── State
       ├── City
       ├── Site Type
       ├── Operating Hours
       └── Terminals
            ├── Network
            ├── Firmware
            ├── Device Type
            ├── Heartbeat
            └── Lockers
                 ├── Locker Size / Type
                 ├── Availability
                 ├── Status
                 └── Booking

Customer
  └── Booking
       ├── Terminal
       ├── Locker
       ├── Duration
       ├── Payment
       └── Access / Passcode
```

This model should drive the frontend architecture.

---

# 4. SCREEN INVENTORY

## Confirmed from supplied admin screenshots

### Screen A — Dashboard / Booking History
Purpose:
- search and monitor locker reservations
- filter booking records
- export booking data
- inspect booking status/payment/locker information

### Screen B — Terminal Control Center
Purpose:
- real-time monitoring of deployed terminal hardware
- terminal health
- connectivity
- firmware/device information
- state-wise terminal coverage
- terminal search/filter
- operational terminal actions

### Screen C — Terminal Management Grid
Purpose:
- browse terminal inventory as cards
- inspect heartbeat, firmware, device type and location
- print QR
- capture terminal state/screen
- switch grid/list views

## Private screens/modules visible in navigation but not captured

These require additional discovery:

- Report Analysis
- Locker Status
- PESIT
- Revenue & Billing
- Access Control
- System
- Profile menu
- Notification panel
- Batch Console
- File Transfer
- Tailscale IPs
- Create Site
- Install Terminal
- terminal detail
- connection logs
- booking row action menu

---

# 5. SCREEN A — DASHBOARD / BOOKING HISTORY

## Page purpose

Operational booking-management dashboard.

## Filter panel

Header:
```text
Filters
Refine your search and find bookings quickly
```

Controls:
- Advanced
- date range
- Reset Filters
- Show Less

Observed date range:
```text
Aug 01, 2026 - Aug 08, 2026
```

## Filters observed

### Row 1
```text
Mobile Number
Booking Source
Mobile / Baggage
Status
```

### Row 2
```text
State
City
Site Type
Terminal
```

## Filter component behavior

Every filter should:
- expose current value
- support keyboard selection
- support clearing
- update the dataset
- preserve other active filters
- display loading state during server fetch
- support reset

Mobile Number should support text search.

Date range should support:
- start date
- end date
- validation
- clear/reset

Advanced should support expandable additional filters.

---

# 6. BOOKING HISTORY TABLE

Header:
```text
Booking History
Manage and track all locker reservations
```

Actions:
```text
Refresh
Excel
```

Columns observed:

```text
SL.
TERMINAL CODE
INVOICE NUMBER
CUSTOMER NAME
MOBILE NUMBER
OPEN DATE & TIME
BOOKING STATUS
PAYMENT METHOD
DATE OF BIRTH
LOCK NAME
PASSCODE
DURATION
ACTIONS
```

Observed status:
```text
ACTIVE
```

Observed payment methods:
```text
UPI
ONLINE
PAY LATER
```

Row action:
```text
...
```

## Important security requirement

The admin UI visibly exposes a passcode column in the supplied screenshot. For a production implementation, treat passcodes as sensitive data:
- do not log them
- do not expose them to frontend telemetry
- use masking/reveal permissions if product policy permits
- enforce role-based access
- never put passcodes in URLs
- never include them in analytics events

This is a recommended security improvement, not a claim about current backend behavior.

---

# 7. BOOKING DATA MODEL

```ts
interface Booking {
  id: string;
  serialNumber: number;
  terminalCode: string;
  invoiceNumber: string;
  customerName: string;
  mobileNumber: string;
  openDateTime: string;
  bookingStatus: string;
  paymentMethod: string;
  dateOfBirth?: string;
  lockName: string;
  passcode?: string;
  duration: string;
  bookingType?: "BAGGAGE" | "MOBILE" | string;
  bookingSource?: string;
  siteType?: string;
  state?: string;
  city?: string;
}
```

Do not hardcode the observed statuses as the only possible statuses.

---

# 8. BOOKING FLOW — ADMIN

## Search flow

```text
Dashboard
  ↓
Filters
  ↓
Enter/select filters
  ↓
Apply / automatic refresh
  ↓
Booking History
  ↓
Inspect row
  ↓
Open row action menu
```

## Export flow

```text
Dashboard
  ↓
Apply filters
  ↓
Booking History
  ↓
Excel
  ↓
Export current/filtered dataset
```

## TO VERIFY

The supplied screenshot does not reveal:
- booking details
- edit behavior
- cancellation
- refund
- unlock/open action
- invoice details
- customer profile
- audit history

Do not invent these as confirmed functionality.

---

# 9. SCREEN B — TERMINAL CONTROL CENTER

## Header

Title:
```text
Terminal Control Center
```

Badge:
```text
LIVE FEED
```

Description:
```text
Manage, monitor, and configure active deployed terminal hardware in real time.
```

Header actions:

```text
Batch Console
File Transfer
Tailscale IPs
Create Site
Install Terminal
```

---

# 10. TERMINAL KPI CARDS

Five cards are observed.

## Total Terminals

```text
TOTAL TERMINALS
238
ALL CONFIGURED
↓ -71% VS LAST MONTH
```

Includes mini trend visualization.

## Online Devices

```text
ONLINE DEVICES
223
ONLINE
94%
WS CONNECTED
223
```

## Offline Devices

```text
OFFLINE DEVICES
15
REQUIRES ATTENTION
CHECK CONNECTION LOGS
```

## Connection Types

Observed approximate values:

```text
13% / 28
87% / 194
0% / 1
```

The exact labels should be verified.

## Auto Refresh Feed

```text
AUTO-REFRESH FEED
LIVE SYNCING
10s Intervals
LAST CHECKED: 1:10:30 PM
1 SLOW NET
```

---

# 11. REAL-TIME TERMINAL MODEL

The UI indicates:
- live feed
- live syncing
- 10-second refresh
- heartbeat values
- WS/WebSocket-like connection labels

Recommended implementation:

```text
Initial REST fetch
      ↓
Realtime connection
      ↓
Terminal events
      ↓
Normalized terminal store
      ↓
Derived KPIs
      ↓
UI
```

Suggested interface:

```ts
interface TerminalRealtimeService {
  connect(): Promise<void>;
  disconnect(): void;
  subscribe(handler: (event: TerminalEvent) => void): () => void;
}
```

If real WebSocket support is unavailable:
- poll every 10 seconds
- show connection freshness
- expose stale-data state

---

# 12. TERMINAL HEALTH STATES

Keep these dimensions separate.

```ts
type ConnectivityStatus =
  | "ONLINE"
  | "OFFLINE";

type LifecycleStatus =
  | "ACTIVE"
  | "INACTIVE";

type HealthStatus =
  | "HEALTHY"
  | "WARNING"
  | "ERROR";
```

Reason:
A terminal can be:
```text
ACTIVE + OFFLINE
ACTIVE + ONLINE
INACTIVE + OFFLINE
```

Do not model all of these as one status.

---

# 13. STATE-WISE TERMINAL COVERAGE

Section:
```text
STATE-WISE TERMINAL COVERAGE
```

Observed dataset:

| State | Total | Online | Offline |
|---|---:|---:|---:|
| Andhra Pradesh | 4 | 4 | 0 |
| Chhattisgarh | 1 | 1 | 0 |
| Delhi | 6 | 6 | 0 |
| Goa | 5 | 4 | 1 |
| Gujarat | 7 | 7 | 0 |
| Haryana | 1 | 1 | 0 |
| Himachal Pradesh | 5 | 3 | 2 |
| Jharkhand | 3 | 2 | 1 |
| Karnataka | 57 | 52 | 5 |
| Kerala | 21 | 19 | 2 |
| Madhya Pradesh | 11 | 11 | 0 |
| Maharashtra | 28 | 28 | 0 |
| Odisha | 7 | 6 | 1 |
| Punjab | 2 | 2 | 0 |
| Rajasthan | 10 | 10 | 0 |
| Tamil Nadu | 17 | 16 | 1 |
| Telangana | 25 | 24 | 1 |
| Uttar Pradesh | 22 | 21 | 1 |
| Uttarakhand | 4 | 4 | 0 |
| West Bengal | 2 | 2 | 0 |

Each card contains:
- state name
- total
- online/offline progress bar
- online count
- offline count
- decorative background illustration

Potential interaction:
```text
Click state
→ filter terminal inventory
```
This is **INFERRED**, not confirmed.

---

# 14. TERMINAL SEARCH + FILTER

Search placeholder:

```text
Search terminals by code, site name, city, state, type...
```

Keyboard hint:
```text
⌘ K
```

View controls:
```text
Grid
List
```

Filters:
```text
State
City
Terminal
Site Type
Locker Type
Status
Network
```

Default:
```text
All States
All Cities
All Terminals
All Site Types
All Locker Types
All Status
All Network
```

---

# 15. TERMINAL CARD

Observed card structure:

```text
[Terminal Icon] TERMINAL CODE     [ONLINE] [ACTIVE]

Site Name

Firmware:       v1.1.23
Device Type:    LEGACY / BEST VIEW
Location Pin:   5316
Heartbeat:      8s ago

[Print QR]      [Capture]
```

## Card metadata

### Terminal code
Unique terminal identifier.

### Site
Human-readable deployment location.

### Firmware
Version plus health indicator.

### Device type
Observed:
```text
LEGACY
BEST VIEW
```

### Location PIN
Numeric location/physical-site identifier.

### Heartbeat
Relative time since terminal last communicated.

### Connection
Observed:
```text
WS
```

---

# 16. TERMINAL CARD ACTIONS

## Print QR

Expected:
```text
Terminal card
  ↓
Print QR
  ↓
Generate/display terminal QR
  ↓
Print/download
```

Exact output is TO VERIFY.

## Capture

Expected:
```text
Terminal card
  ↓
Capture
  ↓
Request terminal screen/state capture
  ↓
Show result
```

Exact modal and capture mechanism are TO VERIFY.

---

# 17. TERMINAL DATA MODEL

```ts
interface Terminal {
  id: string;
  code: string;
  siteName: string;
  state: string;
  city: string;
  siteType: string;
  lockerType: string;

  lifecycleStatus: "ACTIVE" | "INACTIVE";
  connectivityStatus: "ONLINE" | "OFFLINE";

  networkType: string;
  firmwareVersion: string;
  deviceType: string;
  locationPin: string;

  lastHeartbeatAt: string;
  heartbeatSecondsAgo: number;
}
```

---

# 18. PUBLIC CUSTOMER FLOW — RELEVANT TO ADMIN

Public Tuckit documentation confirms the customer-side lifecycle:

## Baggage — Keep

```text
Scan terminal QR
  ↓
Allow location
  ↓
Open web app
  ↓
Select Keep / Store
  ↓
Mobile number
  ↓
Generate OTP
  ↓
Complete first-time details
  ↓
Select locker size
  ↓
Select duration
  ↓
Create 4-digit locker code
  ↓
Payment
  ├── Pay Now
  └── Pay Later
  ↓
Locker door opens
  ↓
Store belongings
```

## Baggage — Pick Up

```text
Scan QR
  ↓
Location access
  ↓
Pick Up
  ↓
Mobile number + 4-digit passcode
  ↓
Select booked locker
  ↓
Open door
  ↓
Retrieve belongings
  ↓
Close door
```

## Modify Booking

```text
Scan QR
  ↓
Mobile + passcode
  ↓
Modify Booking
  ↓
Select locker
  ↓
Open door
  ↓
Payment if applicable
  ↓
Add / remove items
  ↓
Close door
```

## Mobile locker

Public documentation describes:
```text
2 phones
4 phones
8 phones
```

and:
```text
Keep Mobile
Pick Up Mobile
```

---

# 19. BUSINESS RULES FROM PUBLIC RESEARCH

These are useful for admin data models and validation.

## Booking duration

Public documentation says:
- duration options vary by location
- some locations offer packages such as 1/3/6/12/24 hours
- maximum booking duration can be 12 or 24 hours depending on location
- operating/access hours depend on the venue

## Excess usage

If a customer exceeds the selected duration:
- booking can automatically extend
- extra time is charged during retrieval

## Modify booking

Public documentation says:
- modification is free during the first 30 minutes in the described flow
- nominal charges can apply afterward
- modification is disabled during the last 30 minutes
- pay-later modification can require payment of storage + modification charges

## Payments

Public documentation says:
- online payment methods are supported
- UPI/online payment behavior is part of the customer flow
- pay-later is supported in the product flow

## Advance booking

Public FAQ currently says advance booking is not offered. Therefore any admin "advance booking" feature should **not** be assumed to be a live customer feature without verification.

---

# 20. SITE MANAGEMENT MODEL

The Terminal Control Center exposes:

```text
State
City
Site Type
Terminal
Locker Type
Network
```

This strongly suggests a site hierarchy.

Recommended:

```ts
interface Site {
  id: string;
  name: string;
  state: string;
  city: string;
  siteType: string;
  address?: string;
  operatingHours?: OperatingHours;
  terminals: string[];
}
```

---

# 21. LOCKER MODEL

Recommended:

```ts
interface Locker {
  id: string;
  terminalId: string;
  name: string;
  type: string;
  size: "SMALL" | "MEDIUM" | "LARGE" | "XL" | string;
  status: string;
  availability: "AVAILABLE" | "OCCUPIED" | "OUT_OF_SERVICE" | string;
  bookingId?: string;
}
```

Mobile lockers may use:
```text
2 / 4 / 8 phone capacity
```

---

# 22. REUSABLE COMPONENT SYSTEM

Build these before implementing individual screens.

## Navigation

```text
TopNav
NavItem
NavDropdown
UserMenu
RoleBadge
NotificationButton
```

## Filters

```text
FilterPanel
SearchInput
Select
MultiSelect
DateRangePicker
AdvancedFilter
ResetFilters
FilterChip
```

## Data

```text
DataTable
TableHeader
TableRow
TableCell
Pagination
RowActionMenu
ExportButton
RefreshButton
```

## Status

```text
StatusBadge
ConnectivityBadge
LifecycleBadge
HealthBadge
PaymentBadge
```

## Cards

```text
MetricCard
TerminalCard
StateCoverageCard
```

## Feedback

```text
Toast
Modal
Drawer
ConfirmDialog
Skeleton
EmptyState
ErrorState
```

---

# 23. VISUAL DESIGN SYSTEM

## Style

The supplied screenshots show:
- white canvas
- very light borders
- rounded cards
- compact enterprise spacing
- black/dark typography
- orange Tuckit branding
- green online/success states
- red offline/error states
- blue informational/active accents
- subtle shadows
- large horizontal desktop canvas

## Design tokens

Use CSS variables:

```css
--brand-primary
--text-primary
--text-secondary
--surface-primary
--surface-secondary
--border-default
--success
--warning
--danger
--info
--radius-sm
--radius-md
--radius-lg
--shadow-sm
```

Do not scatter raw hex values throughout the code.

---

# 24. ACCESSIBILITY

Required:
- keyboard-accessible dropdowns
- visible focus states
- semantic buttons
- proper form labels
- accessible icon buttons
- table headers
- screen-reader status labels
- color must not be the only status indicator
- accessible modals
- Escape-to-close
- logical tab order

---

# 25. RESPONSIVE BEHAVIOR

## Desktop

Target:
- full top navigation
- 5 KPI cards
- state grid
- 4-column terminal grid
- wide booking table

## Tablet

- fewer card columns
- wrapped filters
- horizontal table scrolling
- condensed navigation

## Mobile

Recommended:
- hamburger/collapsible nav
- stacked KPI cards
- one-column terminal cards
- filter drawer
- horizontally scrollable table or mobile card representation

Exact mobile design is TO VERIFY.

---

# 26. API ARCHITECTURE

Recommended separation:

```text
services/
  api/
    auth.ts
    bookings.ts
    terminals.ts
    sites.ts
    lockers.ts
    reports.ts
    revenue.ts
    access.ts
    system.ts

  realtime/
    terminalSocket.ts
```

Server state:
- TanStack Query

Client/UI state:
- Zustand or Redux Toolkit

Forms:
- React Hook Form + Zod

---

# 27. ROUTE/FEATURE ARCHITECTURE

```text
src/
  app/
    router/
    providers/

  components/
    ui/
    navigation/
    filters/
    tables/
    cards/
    status/
    feedback/

  features/
    dashboard/
      pages/
      components/
      api/
      types/

    bookings/
    terminals/
    lockers/
    sites/
    reports/
    revenue/
    access-control/
    system/
    pesit/

  services/
    api/
    realtime/

  stores/
  hooks/
  utils/
  types/
  constants/
```

---

# 28. MOCK DATA REQUIREMENTS

Use screenshot-derived initial data:

```text
Total terminals: 238
Online: 223
Offline: 15
Online ratio: 94%
```

Create:
- 238 terminal mock records
- 20 state coverage records
- multiple site types
- multiple locker types
- multiple networks
- 20+ bookings
- UPI
- ONLINE
- PAY LATER
- ACTIVE bookings
- different heartbeat ages
- both LEGACY and BEST VIEW device types

The dashboard KPIs must be derived from the terminal dataset, not separately hardcoded.

---

# 29. DEVELOPMENT-ONLY REALTIME SIMULATION

Until the real API exists:

```text
Every 10 seconds:
  update heartbeat timestamps
  optionally change selected terminal connectivity
  recompute:
    total
    online
    offline
    connection distribution
    state coverage
```

Add a clearly marked development mock mode.

Never use random mutations in production.

---

# 30. ERROR / LOADING / EMPTY STATES

Every module must implement:

## Loading
- skeleton KPI
- skeleton cards
- skeleton table rows
- disabled actions during mutation

## Empty

```text
No terminals found
Try changing your search or filters.
```

## Error

```text
Unable to load terminal data
Check your connection and try again.
```

Button:
```text
Retry
```

## Stale realtime data

Recommended:
```text
Live feed unavailable
Last updated 42s ago
Retry connection
```

---

# 31. SECURITY / PERMISSIONS

Observed role:
```text
SUPERADMIN
```

Recommended permission model:

```ts
type Permission =
  | "booking.read"
  | "booking.export"
  | "booking.manage"
  | "terminal.read"
  | "terminal.manage"
  | "terminal.install"
  | "terminal.capture"
  | "site.create"
  | "billing.read"
  | "billing.manage"
  | "access.manage"
  | "system.manage";
```

Sensitive operations should be permission-gated.

---

# 32. AUDITABILITY

For an operational IoT admin product, mutations should generate audit events.

Recommended:

```ts
interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
```

Recommended actions:
- install terminal
- create site
- modify booking
- refund
- change terminal status
- remote action
- access-control change
- billing change

These are architectural recommendations and are not claims that the current UI exposes them.

---

# 33. DISCOVERY MATRIX

| Area | Status | Evidence |
|---|---|---|
| Dashboard | CONFIRMED | Supplied screenshot |
| Booking filters | CONFIRMED | Supplied screenshot |
| Booking table | CONFIRMED | Supplied screenshot |
| Excel export | CONFIRMED | Supplied screenshot |
| Terminal Control Center | CONFIRMED | Supplied screenshot |
| Terminal KPIs | CONFIRMED | Supplied screenshot |
| State coverage | CONFIRMED | Supplied screenshot |
| Terminal grid | CONFIRMED | Supplied screenshot |
| Terminal filters | CONFIRMED | Supplied screenshot |
| Grid/List toggle | CONFIRMED | Supplied screenshot |
| Print QR | CONFIRMED | Supplied screenshot |
| Capture | CONFIRMED | Supplied screenshot |
| Live feed | CONFIRMED | Supplied screenshot |
| 10s refresh | CONFIRMED | Supplied screenshot |
| Booking details | TO VERIFY | Not captured |
| Booking actions | TO VERIFY | Not captured |
| Terminal details | TO VERIFY | Not captured |
| Create Site | TO VERIFY | CTA visible only |
| Install Terminal | TO VERIFY | CTA visible only |
| Batch Console | TO VERIFY | CTA visible only |
| File Transfer | TO VERIFY | CTA visible only |
| Tailscale IPs | TO VERIFY | CTA visible only |
| Connection Logs | TO VERIFY | CTA visible only |
| Locker Status | TO VERIFY | Nav only |
| PESIT | TO VERIFY | Nav only |
| Revenue & Billing | TO VERIFY | Nav only |
| Access Control | TO VERIFY | Nav only |
| System | TO VERIFY | Nav only |
| Report Analysis | TO VERIFY | Nav only |
| Public customer booking | PUBLICLY VERIFIED | Tuckit public documentation |

---

# 34. ANTIGRAVITY EXECUTION ORDER

## Phase 1 — Design system
Build:
- tokens
- typography
- buttons
- inputs
- selects
- badges
- cards
- tables
- modals
- nav

## Phase 2 — App shell
Build:
- top navigation
- user menu
- routing
- global notification state
- responsive layout

## Phase 3 — Dashboard
Build:
- filter panel
- date picker
- booking table
- row menu
- refresh
- export

## Phase 4 — Terminal Control Center
Build:
- KPI cards
- live indicator
- state coverage
- search/filter
- grid/list
- terminal cards

## Phase 5 — Terminal operations
Add placeholders/components for:
- QR
- capture
- connection logs
- site creation
- terminal installation

Do not invent unseen fields until discovered.

## Phase 6 — Remaining modules
Implement after screen capture/research:
- Report Analysis
- Locker Status
- PESIT
- Revenue & Billing
- Access Control
- System

---

# 35. WHAT ANTIGRAVITY MUST NOT DO

Do not:
- turn this into a generic SaaS dashboard
- invent random charts
- invent random sidebar items
- replace the top navigation with a conventional left sidebar
- invent business rules and present them as real
- hardcode KPI values separately from the data model
- merge online/offline and active/inactive into one status
- create fake backend APIs that hide missing functionality
- expose sensitive booking data in logs
- use excessive glassmorphism
- use huge consumer-style cards
- replace the dense operational table with a simplistic list

---

# 36. WHAT ANTIGRAVITY SHOULD DO

Build:
- high visual fidelity to the supplied admin screenshots
- reusable components
- typed domain models
- realistic mock data
- functional filters
- derived metrics
- responsive layouts
- realtime-ready terminal architecture
- clear status semantics
- API-ready service boundaries
- loading/empty/error states
- accessible interactions

---

# 37. FINAL BUILD PROMPT

Use this as the instruction after attaching this specification:

> Build the Tuckit Admin web application from this specification.
>
> Treat screenshot-confirmed behavior as authoritative.
> Treat TO VERIFY sections as unknown and create clean placeholders rather than inventing functionality.
>
> Recreate the desktop UI with high visual fidelity: Tuckit orange branding, white canvas, compact enterprise spacing, rounded cards, subtle borders/shadows, dark typography, green online states, red offline states and blue operational accents.
>
> Start with the application shell, Dashboard/Booking History and Terminal Control Center.
>
> Build the reusable component system first.
>
> Make filters functional against a typed mock dataset.
>
> Derive terminal KPIs and state coverage from the same terminal dataset.
>
> Implement grid/list switching for terminals.
>
> Implement 10-second development-mode realtime simulation and architect the code so it can later be replaced by WebSocket/SSE.
>
> Keep all API access behind service modules.
>
> Use TypeScript throughout.
>
> Do not invent screens that have not been researched.
>
> When a feature is marked TO VERIFY, create a clearly isolated placeholder and continue implementing the confirmed product.
>
> The result should look and behave like an operational IoT/locker management platform, not a generic dashboard template.

---

# 38. RESEARCH SOURCES

Public Tuckit sources used for product-domain verification:
- Tuckit homepage
- Tuckit How To Use
- Tuckit Baggage Locker product page
- Tuckit Mobile Locker product page
- Tuckit FAQ

Private admin source:
- Supplied screenshots from the authenticated Tuckit Admin application.

