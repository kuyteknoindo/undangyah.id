# PRD: Desain UI m.undangyah.id

**Versi:** 1.0  
**Tanggal:** 22 Mei 2026  
**Platform:** Mobile-first PWA  
**Stack:** TanStack Start + Cloudflare Workers + Tailwind CSS v4

---

## 1. Overview & Tujuan Produk

m.undangyah.id adalah mobile dashboard untuk platform undangan digital pernikahan. Aplikasi ini memungkinkan pengguna mengelola undangan, memantau statistik, broadcast ke tamu, dan mengatur profil — semua dari smartphone.

**Tujuan utama:**
- Pengalaman mobile-native yang cepat dan intuitif
- Akses cepat ke fitur utama (buat undangan, sebar, lihat statistik)
- Desain iOS-elegant: clean, flat, konsisten

---

## 2. Target User

- Calon pengantin (usia 20-35 tahun)
- Familiar dengan smartphone, belum tentu tech-savvy
- Mengakses dashboard terutama dari HP (90%+ mobile traffic)
- Butuh workflow sederhana: buat → edit → sebar → pantau

---

## 3. Design System

### 3.1 Color Palette

**Light Mode:**
| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `--primary` | oklch(0.58 0.24 264) — Electric Blue | CTA, badge aktif, accent |
| `--background` | oklch(1 0 0) — Pure White | Background utama |
| `--foreground` | oklch(0.2 0.04 270) — Dark Navy | Teks utama |
| `--muted-foreground` | oklch(0.5 0.03 265) — Gray | Teks sekunder |
| `--card` | oklch(1 0 0) — White | Card background |
| `--border` | oklch(0.92 0.015 260) — Light Gray | Border, divider |
| `--destructive` | oklch(0.6 0.22 25) — Red | Hapus, error |

**Dark Mode:**
| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `--primary` | oklch(0.98 0 0) — Near White | CTA, text primary |
| `--background` | oklch(0 0 0) — Pure Black | Background (OLED-friendly) |
| `--card` | oklch(0.04 0 0) — Near Black | Card surface |
| `--border` | oklch(1 0 0 / 10%) — Subtle White | Border |

### 3.2 Typography

- **Body:** Plus Jakarta Sans (sans-serif)
- **Display/Heading:** Fraunces (serif, optical sizing)
- **Size scale:** 10px (badge) → 11px (caption) → 12px (small) → 14px (body) → 16px (title) → 24-40px (hero number)
- **Weight:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### 3.3 Spacing & Radius

- **Base radius:** 1.5rem (24px) — sangat rounded
- **Card radius:** rounded-2xl (16px) atau rounded-3xl (24px)
- **Button radius:** rounded-full (pill) untuk CTA, rounded-xl/2xl untuk secondary
- **Page padding:** px-5 (20px horizontal)
- **Section gap:** mt-6 sampai mt-7 (24-28px)
- **Card padding:** p-3 sampai p-6

### 3.4 Komponen Dasar

**Button variants:**
- Primary: `bg-primary text-primary-foreground rounded-full` (pill shape)
- Secondary: `border border-border bg-card rounded-2xl`
- Icon button: `h-11 w-11 rounded-full border border-border bg-card`
- Destructive: `bg-destructive/10 text-destructive rounded-full`

**Card:**
- `rounded-2xl border border-border bg-card p-3`
- Dengan hover state untuk interactive cards

**Badge/Chip:**
- `rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Variants: primary (aktif), secondary (draft), accent (lainnya)

**Input:**
- `rounded-xl bg-input border-0 px-4 py-3 text-sm`

**Stat Card (4 tone variants):**
- Blue, Mint, Peach, Lavender
- Masing-masing punya: card bg, icon bg, delta text color
- Support dark mode

---

## 4. Sitemap & Struktur Halaman

```
/ (Dashboard)
├── /login
├── /register
├── /forgot-password
├── /onboarding
├── /catalog (Pilih Tema)
├── /checkout/$slug
├── /share (Sebar Undangan)
├── /notifications
├── /ai-assistant
├── /help
├── /invitations
│   ├── /new (Buat Baru)
│   ├── /trash
│   └── /$id
│       ├── /edit (Editor)
│       ├── /edit/$section (Section Editor)
│       ├── /share (Sebar per Undangan)
│       ├── /rsvp (Daftar RSVP)
│       ├── /broadcast (Kirim WA)
│       ├── /analytics (Statistik)
│       ├── /amplop (Amplop Digital)
│       └── /preview
├── /profile
│   ├── /edit
│   ├── /keamanan
│   ├── /tagihan
│   ├── /orders
│   ├── /domain
│   ├── /bantuan
│   ├── /notifikasi
│   ├── /affiliate
│   ├── /analytics
│   └── /paket
```

---

## 5. Detail Per Halaman

### 5.1 Dashboard (/)

**Layout:**
1. **Header** — Avatar (initials) + nama user + 3 icon buttons (Search, Bell, Menu)
2. **Quota Hero Card** — Blue card (rounded-3xl), badge paket, kuota used/total, progress bar, CTA "Buat Undangan Baru"
3. **Stats Grid** — 2x2 grid: Pengunjung, RSVP, Ucapan, Kuota Tersisa
4. **Daftar Undangan** — List card dengan thumbnail initials, title, visitor count, status badge
5. **Kelola Undangan** — Quick action section (muncul jika ada undangan)
6. **Aktivitas Terbaru** — Timeline card: nama tamu + aksi + waktu
7. **Bottom Nav** — Floating pill: Home, Catalog, + (buat), Share, Profile

**Interaksi:**
- Pull-to-refresh (fetch ulang data)
- Skeleton loading state
- Empty state dengan CTA
- "Muat lainnya" untuk list > 5 item
- Command palette (Ctrl+K / search button)

### 5.2 Login (/login)

**Layout:**
- Centered card, max-w-md
- Logo + form (email/phone + password)
- Link ke register & forgot-password
- No header/navbar on mobile

### 5.3 Catalog (/catalog)

**Layout:**
- Grid tema undangan (thumbnail + nama + harga)
- Filter/search
- Preview button per tema
- CTA checkout

### 5.4 Invitation Editor (/invitations/$id/edit)

**Layout:**
- Section-based editor
- Sections: Cover, Mempelai, Acara, Galeri, Musik, RSVP, dll
- Each section expandable/collapsible
- Preview button (floating)
- Auto-save indicator

### 5.5 Share/Broadcast (/invitations/$id/share)

**Layout:**
- Daftar tamu (nama + nomor)
- Bulk select
- Send via WhatsApp button
- Status: terkirim/pending/gagal
- Add tamu baru (inline form)

### 5.6 RSVP (/invitations/$id/rsvp)

**Layout:**
- List tamu yang sudah RSVP
- Filter: Hadir / Tidak Hadir / Semua
- Detail: nama, jumlah tamu, ucapan
- Export option

### 5.7 Profile (/profile)

**Layout:**
- Avatar besar + nama + email
- Menu list (rounded cards):
  - Edit Profil
  - Keamanan
  - Tagihan
  - Pesanan
  - Domain Custom
  - Paket Layanan
  - Affiliate
  - Analytics
  - Notifikasi
  - Bantuan
- Logout button di bawah

### 5.8 AI Assistant (/ai-assistant)

**Layout:**
- Chat-like interface
- Suggestions/quick prompts
- Input field di bawah
- Konteks: bantu edit undangan, sarankan kata-kata

---

## 6. Navigation Pattern

### 6.1 Bottom Navigation (Floating Pill)

```
[ 🏠 Home ] [ 📱 Catalog ] [ ➕ Buat ] [ 📤 Share ] [ 👤 Profile ]
```

- Fixed bottom, z-40
- Container: `max-w-md mx-auto px-5 pb-5`
- Bar: `rounded-full border bg-card/95 backdrop-blur shadow-lg p-2`
- Active state: `bg-secondary text-foreground`
- CTA center: `bg-primary text-primary-foreground`
- Tampil di: Dashboard, Catalog, Share, Profile
- Tersembunyi di: Editor, Login, Detail pages

### 6.2 Side Menu (Drawer)

- Trigger: hamburger icon di header
- Slide dari kanan (translate-x)
- Overlay: `bg-black/40`
- Content: dark mode toggle + menu items + logout
- Menu items: Tagihan, Analytics, Paket, Affiliate, Notifikasi, AI Assistant, Trash

### 6.3 Back Navigation

- Halaman detail: back arrow di top-left
- Breadcrumb tidak digunakan (terlalu complex untuk mobile)

---

## 7. Dark Mode

**Strategi:** Class-based (`.dark` on root)

**Prinsip:**
- Background pure black (oklch(0 0 0)) — OLED friendly
- Card surface: near-black (oklch(0.04 0 0))
- Border: white 10% opacity
- Primary flip ke near-white untuk kontras
- Stat cards punya dedicated dark variants (darker bg, lighter text)
- Toggle via side menu drawer

**Transisi:** Instant (no animation on theme switch)

---

## 8. Performance Requirements

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle size:** Minimal (code-split per route)
- **Runtime:** Cloudflare Workers (edge, <50ms TTFB)
- **Caching:** CF cache + stale-while-revalidate untuk API
- **Images:** Lazy load, WebP, thumbnail untuk list
- **Skeleton:** Tampilkan skeleton saat loading data
- **Offline:** Service worker untuk shell caching (future)

---

## 9. Accessibility

- Semua interactive element punya `aria-label`
- Focus visible state (ring)
- Color contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (large text)
- Touch target minimum 44x44px (h-11 w-11)
- Screen reader friendly: semantic HTML (nav, main, section, header)

---

## 10. Prinsip Desain

1. **iOS Elegant** — Clean lines, generous whitespace, subtle borders
2. **Flat** — Tidak ada gradasi (kecuali hero card yang sudah ada). Warna solid.
3. **Rounded** — Semua elemen sangat rounded (24px base radius)
4. **Consistent** — Spacing, sizing, dan pattern yang sama di semua halaman
5. **Mobile-first** — Max-width 448px (max-w-md), centered
6. **Minimal chrome** — Fokus ke konten, navigasi tidak mengganggu
7. **Feedback** — Loading states, empty states, error states selalu ada

---

## 11. Flow Aplikasi (User Journey)

### 11.1 Flow: User Baru (First Time)

```
Register → Onboarding (3 slides) → Buat Undangan Baru → Editor → Dashboard
```

**Screen-by-screen:**

1. **Register** `/register`
   - Form: nama, email, nomor HP, password
   - CTA: "Daftar" → redirect ke onboarding

2. **Onboarding** `/onboarding`
   - 3 slide carousel (swipe/tap "Lanjut"):
     - Slide 1: "Selamat datang 🎉" — intro platform
     - Slide 2: "Atur acara Anda" — fitur utama
     - Slide 3: "Tema & Galeri" — visual preview
   - Dot indicator (active = pill panjang, inactive = dot kecil)
   - CTA slide terakhir: "Mulai Buat Undangan" → `/invitations/new`
   - Skip link: "Lewati" → langsung ke Dashboard

3. **Buat Undangan** `/invitations/new` (3-step wizard)
   - Progress bar: 3 segment (filled = primary color)
   - Step 1 — Mempelai: input nama pria + wanita
   - Step 2 — Tanggal & Link: date picker + slug input (real-time availability check ✓/✗)
   - Step 3 — Pilih Tema: grid 2 kolom, search + filter tier, thumbnail preview
   - Bottom fixed CTA: "Lanjutkan" → "Buat & Mulai Edit"
   - Back button: arrow di header

4. **Editor** `/invitations/$id/edit`
   - Section-based editing (cover, mempelai, acara, galeri, musik, RSVP)
   - Auto-save
   - Preview floating button

5. **Dashboard** `/`
   - Landing setelah semua flow selesai

---

### 11.2 Flow: User Existing (Returning)

```
Login → Dashboard → [Kelola Undangan / Lihat Stats / Sebar / Edit]
```

**Screen-by-screen:**

1. **Login** `/login`
   - Form: email/HP + password
   - Link: "Lupa password?" → `/forgot-password`
   - Link: "Belum punya akun? Daftar" → `/register`
   - No header/navbar on mobile

2. **Dashboard** `/`
   - Header: avatar + nama + search/bell/menu icons
   - Quota hero card (blue, progress bar, CTA "Buat Undangan Baru")
   - Stats grid 2x2 (pengunjung, RSVP, ucapan, kuota tersisa)
   - Daftar undangan (card list, max 5 + "Muat lainnya")
   - Aktivitas terbaru (timeline)
   - Bottom nav: Home | Catalog | + | Share | Profile

---

### 11.3 Flow: Sebar Undangan

```
Dashboard → Pilih Undangan → Share Page → Input Tamu → Kirim via WA
```

1. **Share** `/invitations/$id/share`
   - Daftar tamu (nama + nomor)
   - Input tamu baru (inline)
   - Bulk select checkboxes
   - CTA: "Kirim via WhatsApp"
   - Status per tamu: terkirim / pending / gagal

2. **Broadcast** `/invitations/$id/broadcast`
   - Template pesan (editable)
   - Preview pesan
   - Kirim massal

---

### 11.4 Flow: Upgrade Paket

```
Dashboard (Upgrade link) → Catalog → Pilih Paket → Checkout → Pembayaran
```

1. **Catalog** `/catalog`
   - Grid paket/tema dengan harga
   - Filter kategori
   - CTA per item: "Pilih"

2. **Checkout** `/checkout/$slug`
   - Detail paket terpilih
   - Form: nama, email, HP (+ OTP verifikasi)
   - Addon selection (optional)
   - Voucher input + apply
   - Ringkasan harga (subtotal, diskon, total)
   - CTA: "Bayar Sekarang"

---

### 11.5 Flow: Kelola Profil

```
Dashboard → Profile → [Edit / Keamanan / Tagihan / Domain / dll]
```

1. **Profile** `/profile`
   - Avatar + nama + email
   - Menu list → sub-pages

2. **Sub-pages:**
   - `/profile/edit` — Edit nama, email, foto
   - `/profile/keamanan` — Ganti password
   - `/profile/tagihan` — Riwayat pembayaran
   - `/profile/orders` — Daftar pesanan
   - `/profile/domain` — Custom domain setting
   - `/profile/paket` — Paket aktif + upgrade
   - `/profile/affiliate` — Referral program
   - `/profile/analytics` — Statistik akun
   - `/profile/notifikasi` — Pengaturan notif
   - `/profile/bantuan` — FAQ + kontak

---

### 11.6 Flow: AI Assistant

```
Dashboard (Menu drawer) → AI Assistant → Chat → Hasil/Saran
```

1. **AI Assistant** `/ai-assistant`
   - Chat interface
   - Quick suggestion chips
   - Input field di bawah
   - Konteks: bantu tulis kata-kata undangan, saran tema, edit konten

---

### 11.7 Navigasi Antar Flow

```
┌─────────────────────────────────────────────────┐
│                  BOTTOM NAV                       │
├──────┬──────────┬───────┬─────────┬─────────────┤
│ Home │ Catalog  │   +   │  Share  │   Profile   │
│  /   │ /catalog │ /new  │ /share  │  /profile   │
└──────┴──────────┴───────┴─────────┴─────────────┘

┌─────────────────────────────────────────────────┐
│               SIDE MENU (DRAWER)                 │
├─────────────────────────────────────────────────┤
│ 🌙 Mode Gelap [toggle]                          │
│ ─────────────────────                           │
│ 📄 Tagihan                                      │
│ 📊 Analytics                                    │
│ 📦 Paket Layanan                                │
│ 👥 Affiliate                                    │
│ 🔔 Notifikasi                                   │
│ ✨ AI Assistant                                  │
│ 🗑️ Trash                                        │
│ ─────────────────────                           │
│ [Keluar]                                        │
└─────────────────────────────────────────────────┘
```

**Aturan tampil/sembunyi:**
- Bottom nav: tampil di Dashboard, Catalog, Share, Profile
- Bottom nav: tersembunyi di Login, Register, Onboarding, Editor, Checkout
- Side menu: accessible dari semua halaman yang punya header
- Back button: tampil di semua halaman detail (bukan root nav)

---

## 12. Komponen UI Library

Berbasis shadcn/ui (Radix primitives + Tailwind):

Accordion, Alert, AlertDialog, Avatar, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, Dialog, Drawer, DropdownMenu, Form, Input, InputOTP, Label, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Sheet, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip

**Custom:**
- `CommandPalette` — Search overlay (Ctrl+K)
- `KelolaUndangan` — Quick action panel
- `Countdown` — Timer ke hari H
- `SkeletonList` — Loading placeholder
- `ThemeProvider` — Dark/light mode
- `MusicSection` — Music player (editor)

---

## 13. Roadmap Iterasi UI

**Phase 1 (Current) ✅**
- Dashboard + quota card + stats grid
- Bottom nav floating pill
- Side menu drawer + dark mode toggle
- Command palette
- Buat undangan wizard (3 step)
- Onboarding slides

**Phase 2 (Next)**
- Improved invitation editor (drag-drop sections)
- Real-time notification badge
- Haptic feedback on actions
- Swipe gestures (swipe-to-delete, pull-to-refresh)

**Phase 3 (Future)**
- Offline mode (Service Worker + IndexedDB)
- Push notifications
- AI content suggestions inline
- Multi-language
- Animated page transitions
