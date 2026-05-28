# PRD UI Detail — Desktop hi.undangyah.id

**Versi:** 1.0
**Tanggal:** 22 Mei 2026
**Platform:** Desktop Web (≥768px)
**Stack:** React 19 + Vite + TypeScript + React Router

---

## 1. Design Tokens (Desktop)

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Sidebar BG | `#fdfefe` | `#101010` | Sidebar background |
| Sidebar Border | `#e4e8ee` | `#3b3835` | Sidebar divider |
| Sidebar Active BG | `#eef6ff` | `#1d2430` | Active menu item |
| Sidebar Active Border | `#0078ff` | `#73a0ff` | Active indicator bar |
| Sidebar Hover | `#f5f6f8` | `#1a1a1a` | Hover state |
| Sidebar Text | `#25364d` | `#ded7ce` | Menu text |
| Sidebar Muted | `#6b7a90` | `#a79f96` | Labels, captions |
| Topbar BG | `#fdfefe` | `#101010` | Top bar |
| Main BG | `#f5f6f8` | `#1a1a1a` | Content area |
| Surface Panel | `#ffffff` | dark panel | Cards, modals |
| Primary | `#1677ff` | `#93c5fd` | CTA, links |
| Gradient | `135deg, #1677ff → #0d6ae8` | same | Primary buttons |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title (h2) | 24-28px | 700 | text-strong |
| Card title (h3) | 22px | 700 | text-strong |
| Side title (h4) | 17px | 700 | text-strong |
| Body | 14px | 400-600 | text-default |
| Caption/label | 12px | 600-700 | text-muted |
| Table header | 12px | 700 | #9aaac2, uppercase, letter-spacing 0.18em |
| KPI value | 26px | 700 | text-strong |
| Badge | 12px | 800 | varies |

### Spacing & Radius

| Element | Value |
|---------|-------|
| Sidebar width | 240px (expanded), 64px (collapsed) |
| Topbar height | 56px |
| Main padding | 24px |
| Card radius | 20-28px |
| Button radius | 14-16px |
| Menu item radius | 12px |
| Modal radius | 24px |
| Input radius | 12-16px |

---

## 2. Shell Layout

### Grid Structure

```
.sl-shell (CSS Grid)
├── grid-template-columns: [sidebar-width] [1fr]
├── grid-template-rows: [topbar-height] [1fr]
├── grid-areas: "sidebar topbar" / "sidebar main"
│
├── .sl-sidebar (grid-area: sidebar)
│   ├── .sl-brand (logo + text)
│   ├── .sl-menu-section (MENU label)
│   │   ├── .sl-menu-item (Dashboard) — icon + label
│   │   ├── .sl-menu-item (Themes)
│   │   └── ...
│   ├── .sl-divider
│   ├── .sl-menu-section (admin group toggle)
│   │   ├── .sl-group-toggle (Admin Panel)
│   │   └── .sl-group-list (sub-items)
│   ├── .sl-upgrade (upgrade card)
│   └── .sl-footer (version info)
│
├── .sl-topbar (grid-area: topbar)
│   ├── .sl-topbar-left
│   │   ├── .sl-hamburger (collapse toggle)
│   │   └── Desktop nav items (Dashboard, Themes, Edit, Share, RSVP)
│   ├── .sl-search-wrap (Cmd+K search)
│   └── .sl-topbar-right
│       ├── .sl-circle-btn (notification bell + dot)
│       └── .dt-user-button (avatar + name + role)
│
└── .sl-main (grid-area: main)
    └── [Page Content]
```

### Sidebar Elements

| Element | Spec |
|---------|------|
| Brand logo | 34px height, auto width |
| Brand text | "Undangyah" (16px bold) + "Member Dashboard" (11px muted) |
| Menu item | 14px font, 600 weight, 12px radius, 10px 14px padding |
| Active indicator | 3px wide bar, left side, blue |
| Menu icon | Material Symbols Outlined, 20px |
| Admin group | Collapsible, sub-items indented with left border |
| Upgrade card | 18px radius, gradient bg, purple icon, CTA button |
| Footer | 11px version text, muted |

### Topbar Elements

| Element | Spec |
|---------|------|
| Hamburger | 36px square, 10px radius, border |
| Nav items | Inline tabs when editing (Edit / Share / RSVP) |
| Search | 40px height, 12px radius, max-width 420px, Cmd+K shortcut |
| Notification bell | 38px square, 12px radius, blue dot for unread |
| User button | Avatar (34px, 10px radius) + name (12px) + role badge (10px) |

### Collapsed Sidebar

- Width: 64px
- Only icons visible (22px)
- Brand: square logo only (38px)
- Labels, dividers, upgrade card, footer: hidden
- Admin: flyout panel on hover (244px wide, 16px radius)

---

## 3. Halaman: Login (`/login`)

### Elements
- Full-page centered form (no sidebar/topbar)
- Logo top
- Heading: "Masuk ke Dashboard"
- Email/phone input
- Password input + toggle visibility
- "Lupa password?" link
- Submit button (gradient primary)
- Register link
- Dark mode toggle

---

## 4. Halaman: Dashboard (`/dashboard`)

### Layout Structure

```
.dbx-page
├── .dbx-alert (conditional: expiry warning)
├── .dbx-header
│   ├── h2: "Dashboard"
│   ├── p: subtitle
│   └── .dbx-header-meta (badge + date)
├── .dbx-layout (2-column grid: 2.15fr + 0.78fr)
│   ├── .dbx-main (left)
│   │   ├── .dbx-kpis (4-column grid)
│   │   │   ├── KPI: Total Undangan (blue icon)
│   │   │   ├── KPI: Total Tamu (violet icon)
│   │   │   ├── KPI: Total Views (amber icon)
│   │   │   └── KPI: Tagihan Aktif (teal icon)
│   │   └── .dbx-card--table (Invitation table)
│   │       ├── .dbx-card-head (title + search + buttons)
│   │       ├── .dbx-segment (filter tabs: Semua, Aktif, Draft)
│   │       ├── .dbx-bulkbar (bulk actions, conditional)
│   │       ├── .dbx-table-wrap
│   │       │   └── table: checkbox, nama, slug, status, tanggal, actions
│   │       └── .dbx-footer (pagination)
│   └── .dbx-side (right)
│       ├── .dbx-card (RSVP Summary)
│       │   ├── .dbx-side-head: "RSVP Terbaru"
│       │   ├── .dbx-rsvp-summary (3-col: Hadir, Tidak, Belum)
│       │   └── .dbx-rsvp-chart (donut chart + legend)
│       └── .dbx-card (Aktivitas Terbaru)
│           ├── .dbx-side-head: "Aktivitas"
│           └── .dbx-activities (timeline list)
│               └── .dbx-activity (marker + line + copy)
```

### KPI Card Elements
- Icon: 40px, 14px radius, colored bg
- Label: 14px muted
- Value: 26px bold
- Badge: pill, 12px, colored bg
- Optional: progress bar

### Table Elements
- Header: uppercase, 12px, letter-spacing
- Row: checkbox, thumbnail (28px), name+slug, status badge, date, action icons
- Actions: edit, share, preview, more menu (delegate, trash)
- Pagination: numbered buttons, prev/next

### Modals (from Dashboard)
- Delete confirmation modal (420px, 24px radius)
- Delegate modal (520px, user selector)
- Progress dock (fixed bottom-right, 360px)

---

## 5. Halaman: Themes (`/dashboard/themes`)

### Elements
```
├── Page header: "Tema Undangan" + subtitle
├── Filter bar: category tabs (Semua, Premium, Basic, Duluxe)
├── Search input
├── Theme grid (3-4 columns)
│   └── Theme card
│       ├── Thumbnail image (aspect-ratio, rounded)
│       ├── Theme name
│       ├── Category badge
│       ├── Preview button
│       └── "Gunakan" button
└── Empty state (if no themes)
```

---

## 6. Halaman: Editor (`/dashboard/edit/:id`)

### Layout (Full-screen, no sidebar)

```
.edit-shell (full viewport)
├── .edit-topbar
│   ├── Back button (← Dashboard)
│   ├── Invitation title (editable)
│   ├── Status badge (Draft/Active)
│   ├── Preview button
│   └── Save/Publish button
├── .edit-body (2-column or tabbed)
│   ├── .edit-sidebar (section tabs, vertical)
│   │   ├── Setting
│   │   ├── Acara
│   │   ├── Mempelai
│   │   ├── Love Story
│   │   ├── Quotes
│   │   ├── Tema
│   │   ├── Kado
│   │   ├── Musik
│   │   ├── Foto/Gallery
│   │   ├── Livestream
│   │   └── Google Calendar
│   └── .edit-content (form fields per section)
│       ├── Text inputs
│       ├── Textarea
│       ├── Image upload (drag & drop)
│       ├── Date/time pickers
│       ├── Color pickers
│       ├── Toggle switches
│       └── Rich text editor (TipTap)
└── .edit-stage (optional: live preview panel)
```

---

## 7. Halaman: Sebar (`/dashboard/sebar`)

### Elements
```
├── Page header: "Share Undangan" + invitation selector
├── Stats row (3-4 cards)
│   ├── Total Tamu
│   ├── Sudah Dikirim
│   ├── Delivered
│   └── Read/Opened
├── .sebar-layout (2-column)
│   ├── Left: Guest table
│   │   ├── Toolbar: search + filter + add guest button
│   │   ├── Table: checkbox, nama, nomor WA, status kirim, actions
│   │   └── Bulk actions: Kirim WA, Hapus
│   └── Right: Message template
│       ├── Template preview card
│       ├── Edit template button
│       └── Send broadcast button
└── Import guests (CSV upload)
```

---

## 8. Halaman: RSVP (`/dashboard/rsvp`)

### Elements
```
├── Page header: "RSVP Tamu" + invitation selector
├── Stats cards (3 columns)
│   ├── Hadir (green)
│   ├── Tidak Hadir (amber)
│   └── Belum Respon (blue)
├── Filter bar: search + status filter + date range
├── Guest table
│   ├── Columns: nama, status (badge), jumlah tamu, ucapan, timestamp
│   └── Row click → detail panel
├── Chart section (donut/bar chart)
└── Export button (CSV)
```

---

## 9. Halaman: Tagihan (`/dashboard/tagihan`)

### Elements
```
├── Page header: "Tagihan & Pembayaran"
├── Active subscription card
│   ├── Package name + badge
│   ├── Masa aktif (start - end)
│   ├── Status (Aktif/Expired)
│   └── Renew/Upgrade button
├── Invoice table
│   ├── Columns: #invoice, tanggal, paket, jumlah, status, actions
│   └── Status badges: Lunas (green), Pending (amber), Expired (red)
├── Payment methods info
└── Empty state (no invoices)
```

---

## 10. Halaman: Profile (`/dashboard/profile`)

### Elements
```
├── Page header: "Profil"
├── .dp-profile-shell (2-column)
│   ├── Left: Profile card
│   │   ├── Avatar (large, editable)
│   │   ├── Display name
│   │   ├── Email
│   │   ├── Phone
│   │   └── Membership badge
│   └── Right: Settings sections
│       ├── Section: Informasi Akun
│       │   ├── Nama lengkap input
│       │   ├── Email input
│       │   └── Nomor HP input
│       ├── Section: Keamanan
│       │   ├── Ubah password
│       │   └── MFA/2FA toggle
│       ├── Section: Preferensi
│       │   ├── Dark mode toggle
│       │   └── Notification settings
│       └── Section: Danger Zone
│           └── Hapus akun button
```

---

## 11. Halaman: Trash (`/dashboard/trash`)

### Elements
```
├── Page header: "Trash Undangan"
├── Info banner: "Undangan di trash akan dihapus permanen setelah 30 hari"
├── Invitation list (card or table)
│   ├── Thumbnail + nama + tanggal dihapus
│   ├── Restore button
│   └── Delete permanent button
├── Bulk actions: Restore All, Delete All
└── Empty state: "Trash kosong"
```

---

## 12. Halaman: Admin Revenue (`/dashboard/admin/revenue`)

### Elements
```
├── Page header: "Revenue" + date range picker
├── Stats grid (4 cards)
│   ├── Total Revenue
│   ├── Revenue Bulan Ini
│   ├── Total Orders
│   └── Average Order Value
├── Revenue chart (line/area chart, monthly)
├── Revenue breakdown table
│   ├── Columns: produk, qty, revenue, percentage
│   └── Sort by revenue
└── Export button
```

---

## 13. Halaman: Admin Products (`/dashboard/admin/products`)

### Elements
```
├── Page header: "Products" + "Tambah Product" button
├── Toolbar: search + category filter
├── Product table
│   ├── Columns: nama, slug, harga, durasi, status, actions
│   ├── Status: Active/Draft badge
│   └── Actions: edit, duplicate, delete
├── Pagination
└── Product Editor (separate page)
    ├── Nama produk input
    ├── Slug input
    ├── Harga input
    ├── Durasi (hari) input
    ├── Deskripsi (rich text)
    ├── Fitur list (add/remove)
    ├── Status toggle
    └── Save/Cancel buttons
```

---

## 14. Halaman: Admin Orders (`/dashboard/admin/orders`)

### Elements
```
├── Page header: "Orders"
├── Stats: Total Orders, Pending, Completed, Revenue
├── Filter: status dropdown + date range + search
├── Orders table
│   ├── Columns: #order, user, produk, jumlah, status, tanggal, actions
│   ├── Status badges: Pending (amber), Completed (green), Failed (red)
│   └── Actions: view detail, confirm payment, cancel
├── Pagination
└── Order detail modal
    ├── User info
    ├── Product info
    ├── Payment proof (image)
    ├── Confirm/Reject buttons
    └── Notes
```

---

## 15. Halaman: Admin Users (`/dashboard/admin/users`)

### Elements
```
├── Page header: "Users" + "Tambah User" button
├── Stats: Total Users, Active, Expired, New (this month)
├── Toolbar: search + role filter + status filter
├── Users table
│   ├── Columns: avatar, nama, email, phone, membership, status, joined, actions
│   ├── Membership badge (Basic/Premium/Duluxe/Admin)
│   └── Actions: edit, impersonate, delete
├── Pagination
└── User Editor (separate page)
    ├── Profile section
    ├── Membership section
    ├── Invitations owned
    └── Activity log
```

---

## 16. Halaman: Admin Themes (`/dashboard/admin/themes`)

### Elements
```
├── Page header: "Themes" + "Tambah Theme" button
├── Toolbar: search + category filter
├── Theme table
│   ├── Columns: thumbnail, nama, kategori, slug, status, actions
│   └── Actions: edit, preview, duplicate, delete
├── Pagination
└── Theme Editor
    ├── Nama + slug
    ├── Kategori (Basic/Premium/Duluxe)
    ├── Thumbnail upload
    ├── Demo URL
    ├── Template file/code
    ├── Status toggle
    └── Save
```

---

## 17. Halaman: Admin Vouchers (`/dashboard/admin/vouchers`)

### Elements
```
├── Page header: "Vouchers" + "Tambah Voucher" button
├── Voucher table
│   ├── Columns: kode, diskon, tipe (% / fixed), usage, max usage, expiry, status
│   └── Actions: edit, copy code, delete
├── Pagination
└── Voucher Editor
    ├── Kode voucher
    ├── Tipe diskon (percentage / fixed)
    ├── Nilai diskon
    ├── Max usage
    ├── Expiry date
    ├── Applicable products
    └── Status toggle
```

---

## 18. Halaman: Admin Invoices (`/dashboard/admin/invoices`)

### Elements
```
├── Page header: "Invoices"
├── Filter: status + date range + search
├── Invoice table
│   ├── Columns: #invoice, user, produk, amount, status, created, paid_at
│   ├── Status: Paid (green), Pending (amber), Overdue (red), Cancelled (gray)
│   └── Actions: view, mark paid, send reminder, delete
└── Pagination
```

---

## 19. Halaman: Admin Musik (`/dashboard/admin/musik`)

### Elements
```
├── Page header: "Musik Library" + "Upload Musik" button
├── Toolbar: search + category filter
├── Musik table/grid
│   ├── Columns: play button, judul, artist, kategori, durasi, usage count
│   └── Actions: edit, preview (audio player), delete
├── Upload modal
│   ├── File upload (mp3)
│   ├── Judul input
│   ├── Artist input
│   ├── Kategori select
│   └── Save
└── Audio player (inline, mini)
```

---

## 20. Halaman: Admin Media (`/dashboard/admin/media`)

### Elements
```
├── Page header: "Media Manager"
├── Stats: Total files, Storage used, Images, Audio
├── Toolbar: search + type filter (image/audio/video) + upload button
├── Media grid (masonry or fixed grid)
│   ├── Thumbnail card
│   │   ├── Image preview
│   │   ├── Filename
│   │   ├── Size
│   │   └── Actions: copy URL, delete
│   └── Lightbox on click
├── Upload zone (drag & drop)
└── Pagination / infinite scroll
```

---

## 21. Halaman: Admin Notifications (`/dashboard/admin/notifications`)

### Elements
```
├── Page header: "Notifications" + "Kirim Notifikasi" button
├── Tabs: Semua, Admin, System
├── Notification list
│   ├── Item: icon + title + message + timestamp + read status
│   └── Actions: mark read, delete
├── Bulk: Mark all read, Clear all
└── Send notification modal
    ├── Target: All users / specific user / role
    ├── Title input
    ├── Message textarea
    ├── Type: info / warning / promo
    └── Send button
```

---

## 22. Global Components

### Notification Dropdown (Topbar)
```
.dt-notif-modal (456px wide, 22px radius)
├── Header: "NOTIFIKASI" + unread badge + settings + refresh
├── Tabs: Semua | Admin | Sistem
├── List (max-height 420px, scrollable)
│   └── Item: icon (36px) + title + meta (time + type) + message + link
└── Empty state: "Belum ada notifikasi"
```

### Profile Dropdown (Topbar)
```
.dt-user-menu (272px wide, 18px radius)
├── Head: avatar + name + email
├── Group Primary: Dashboard, Profile, Tagihan
├── Group Secondary: Admin Panel (if admin)
├── Theme switcher: Light / Dark / System
├── Footer: plan badge + upgrade CTA
└── Logout (danger red)
```

### Search Modal (Cmd+K)
```
.sl-search-modal (full-width of search, 18px radius)
├── Head: "Hasil Pencarian" + count
├── List (max-height 320px)
│   └── Item: icon + label + description + section badge
└── Keyboard navigation (arrow keys + enter)
```

### Empty State
- Centered icon (large, muted)
- Title text (16px bold)
- Description (14px muted)
- CTA button (optional)

### Loading State
- Skeleton cards (pulse animation)
- Table skeleton (rows with shimmer)
- Full-page skeleton for initial load

### Toast Notifications
- Position: top-right
- Types: success (green), error (red), warning (amber), info (blue)
- Auto-dismiss, close button
- Rich content support

---

## 23. Responsive Behavior (Desktop)

### Container Queries (sl-main)

| Breakpoint | Behavior |
|------------|----------|
| ≤1120px | 2-col layout → 1-col, side panels stack below |
| ≤960px | KPI grid 2-col, card headers stack, tables scroll |
| ≤720px | All grids 1-col, buttons full-width |
| ≤640px | Stats 1-col, filters stack |

### Sidebar Collapse
- Toggle via hamburger button
- Collapsed: 64px, icons only
- Admin menu: flyout panel on hover
- Transition: 210ms smooth

---

## 24. Dark Mode (Desktop)

| Element | Light | Dark |
|---------|-------|------|
| Sidebar | #fdfefe | #101010 |
| Main bg | #f5f6f8 | #1a1a1a |
| Cards | white, border | dark panel, dark border |
| KPI icons | light colored bg | darker colored bg, lighter icon |
| Status badges | light bg | semi-transparent bg |
| Table headers | light soft bg | dark soft bg |
| Active menu | blue bg tint | dark blue tint |
| Text strong | dark | light |
| Text muted | gray | lighter gray |

---

## 25. Admin Panel Shared Patterns

### Admin Table Pattern
```
├── .admin-card (28px radius, panel bg)
│   ├── .admin-card-head
│   │   ├── Title (h3)
│   │   └── .admin-toolbar-controls (search + filters + add button)
│   ├── .admin-table-wrap (overflow-x: auto)
│   │   └── table (full-width, border-collapse)
│   │       ├── thead (uppercase, muted, sticky)
│   │       └── tbody (rows with hover, border-top)
│   └── .admin-footer (pagination + count)
```

### Admin Form Pattern
```
├── .admin-form-card (28px radius)
│   ├── .admin-form-head (title + back button)
│   ├── .admin-form-body
│   │   ├── Form sections (grouped fields)
│   │   ├── Input: label + input (46px height, 16px radius)
│   │   ├── Select: label + select
│   │   ├── Textarea: label + textarea
│   │   ├── Toggle: label + switch
│   │   └── File upload: drag zone
│   └── .admin-form-actions (Cancel + Save buttons)
```

### Admin Stats Card
- 40px icon (14px radius, colored bg)
- Label (12px muted, uppercase)
- Value (24-28px bold)
- Optional: trend indicator (+12% green / -5% red)

---

Dokumen ini mencakup semua elemen UI pada desktop hi.undangyah.id untuk handoff ke Lovable sebagai referensi layout dan komponen.
