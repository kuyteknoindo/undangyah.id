# PRD UI Detail — m.undangyah.id

**Versi:** 1.0  
**Tanggal:** 22 Mei 2026  
**Platform:** Mobile Web (max-w-md, iOS-like elegant, flat design)  
**Stack:** TanStack Start + CF Workers + Tailwind CSS v4

---

## 1. Design Tokens (src/styles.css)

### Radius System
```
--radius: 1.5rem (24px) — base
--radius-sm: calc(var(--radius) - 4px) = 20px
--radius-md: calc(var(--radius) - 2px) = 22px
--radius-lg: var(--radius) = 24px
--radius-xl: calc(var(--radius) + 4px) = 28px
--radius-2xl: calc(var(--radius) + 8px) = 32px
--radius-3xl: calc(var(--radius) + 12px) = 36px
--radius-4xl: calc(var(--radius) + 16px) = 40px
```

### Color Palette

#### Light Mode (:root)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Halaman background, pure white |
| `--foreground` | `oklch(0.2 0.04 270)` | Teks utama, near-black |
| `--card` | `oklch(1 0 0)` | Card background |
| `--primary` | `oklch(0.58 0.24 264)` | Electric Blue — tombol utama, aksen |
| `--primary-foreground` | `oklch(1 0 0)` | Teks di atas primary |
| `--secondary` | `oklch(0.97 0.01 260)` | Background sekunder, badge |
| `--secondary-foreground` | `oklch(0.2 0.04 270)` | Teks di atas secondary |
| `--muted` | `oklch(0.96 0.008 260)` | Background muted |
| `--muted-foreground` | `oklch(0.5 0.03 265)` | Teks muted, placeholder |
| `--accent` | `oklch(0.93 0.05 260)` | Background aksen |
| `--accent-foreground` | `oklch(0.2 0.04 270)` | Teks aksen |
| `--destructive` | `oklch(0.6 0.22 25)` | Tombol hapus, error |
| `--destructive-foreground` | `oklch(1 0 0)` | Teks destructive |
| `--border` | `oklch(0.92 0.015 260)` | Border, divider |
| `--input` | `oklch(0.92 0.02 260)` | Input background |
| `--ring` | `oklch(0.58 0.24 264)` | Focus ring |

#### Dark Mode (.dark)
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0 0 0)` | Pure black |
| `--foreground` | `oklch(0.98 0 0)` | Near-white text |
| `--card` | `oklch(0.04 0 0)` | Card background, dark gray |
| `--primary` | `oklch(0.98 0 0)` | Inverted: white on black |
| `--primary-foreground` | `oklch(0 0 0)` | Teks hitam di atas primary |
| `--secondary` | `oklch(0.12 0 0)` | Dark secondary |
| `--muted` | `oklch(0.10 0 0)` | Muted background |
| `--muted-foreground` | `oklch(0.65 0 0)` | Muted text |
| `--accent` | `oklch(0.14 0 0)` | Accent background |
| `--border` | `oklch(1 0 0 / 10%)` | 10% white border |
| `--input` | `oklch(1 0 0 / 15%)` | 15% white input |
| `--ring` | `oklch(0.65 0 0)` | Focus ring dark |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Body | Plus Jakarta Sans | default (14px base) | 400 | foreground |
| Headline/h1 | Fraunces (serif) | ~2xl-3xl (24-30px) | 700 | foreground |
| H1 bold | Plus Jakarta Sans | 2xl-3xl | 700 | foreground |
| h3/subtitle | Plus Jakarta Sans | base (16px) | 600 | foreground |
| Caption | Plus Jakarta Sans | xs (11-12px) | 400-500 | muted-foreground |
| Button text | Plus Jakarta Sans | sm (14px) | 600 | varies |
| Input | Plus Jakarta Sans | sm (14px) | 400 | foreground |

### Spacing System
- Container: `max-w-md` (max 448px)
- Section padding: `px-5` (20px horizontal)
- Card padding: `p-3` to `p-5` (12px to 20px)
- Gap between cards: `gap-3` (12px)
- Section gap: `mt-6` to `mt-7` (24px to 28px)
- Bottom nav height: ~80px + pb-5

### Component Patterns
- **Buttons:** `rounded-xl` (20px) atau `rounded-full` untuk FAB/CTA utama
- **Cards:** `rounded-2xl` (32px) dengan `border border-border`
- **Inputs:** `rounded-xl` (20px), `h-13` (52px height), `py-3.5`
- **Icons:** Lucide React, ukuran: `h-3 w-3` (12px), `h-4 w-4` (16px), `h-5 w-5` (20px)
- **Avatar:** `h-11 w-11` (44px) rounded-full untuk header, `h-20 w-20` (80px) untuk profile

---

## 2. Root Layout (`/`)

### Layout Structure
```
RootShell (html > body)
└── RootComponent
    ├── QueryClientProvider
    ├── ThemeProvider
    ├── Outlet (page content)
    ├── CommandPalette (global overlay)
    └── Toaster (sonner notifications)
```

### Elements

#### Toaster
- Position: `top-center`
- Rich colors enabled
- Close button visible
- Animasi dari tw-animate-css

#### Command Palette (Dialog)
- Menggunakan komponen UI `CommandDialog` dari shadcn/ui
- Trigger: `Ctrl/Cmd + K` atau dispatch event `command-palette:open`
- Icon per item: `h-4 w-4`, `mr-2`
- Group heading: font-semibold, xs
- Empty state: "Tidak ada hasil ditemukan."

#### Device Redirect Logic
- Domain `m.undangyah.id` + desktop device (>768px + pointer:fine) → redirect ke `hi.undangyah.id`
- Domain `hi.undangyah.id` + mobile device → redirect ke `m.undangyah.id`

---

## 3. Halaman: Login (`/login`)

### Layout Structure
```
div.min-h-screen.flex.flex-col
├── header (fixed/relative, flex, px-6 pt-5)
│   └── img.logo (h-6)
├── main (mx-auto max-w-md, flex-1 flex-col justify-center, px-6 py-6)
│   ├── div.hero-copy
│   │   ├── h1 (text-3xl font-bold)
│   │   └── p (text-sm text-muted-foreground)
│   ├── div.error (conditional)
│   ├── form
│   │   ├── div.email-field
│   │   │   ├── label (text-xs text-muted-foreground)
│   │   │   └── div.relative > Mail.icon + input
│   │   ├── div.password-field
│   │   │   ├── label
│   │   │   └── div.relative > Lock.icon + input + Eye button
│   │   ├── div.forgot-link
│   │   └── button.submit (full-width, h-13, rounded-xl)
│   └── p.link-register (text-center text-xs)
└── div.loading-overlay (conditional, fixed inset-0, z-50)
```

### Elements

#### Logo Header
- Posisi: relative, px-6 pt-5
- Dimensi: `h-6` (24px height)
- Icon: logo image dari URL eksternal

#### Hero Heading
- Font: Plus Jakarta Sans, **bold**
- Size: `text-3xl` (30px)
- Line height: `leading-tight`
- Color: foreground
- Text: "Selamat datang<br />kembali"

#### Hero Subtitle
- Font: Plus Jakarta Sans
- Size: `text-sm` (14px)
- Weight: 400
- Color: muted-foreground
- Margin top: `mt-2` (8px)

#### Error Alert
- Background: destructive/10
- Border: destructive (light: red-200, dark: red-900)
- Padding: `px-4 py-3`
- Font: `text-xs`
- Border radius: `rounded-xl` (20px)
- Color: destructive
- Dark mode: `dark:bg-red-950/50 dark:text-red-300`

#### Email Input Field
- Label: `text-xs font-medium text-muted-foreground`
- Container wrapper: `h-13 w-full rounded-xl border border-border bg-card`
- Input: `pl-11 pr-4 py-3.5 text-sm outline-none`
- Icon (Mail): `pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`
- Focus: `focus:border-primary`
- Placeholder: "kamu@email.com"

#### Password Input Field
- Label: `text-xs font-medium text-muted-foreground`
- Container: `h-13 w-full rounded-xl border border-border bg-card`
- Icon (Lock): `pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`
- Input: `pl-11 pr-12 py-3.5 text-sm outline-none`
- Toggle button: `absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full`
- Icon (Eye/EyeOff): `h-4 w-4 text-muted-foreground hover:bg-secondary`
- Focus: `focus:border-primary`
- Placeholder: "••••••••"

#### Forgot Password Link
- Posisi: flex items-center justify-end
- Padding: `pt-1`
- Font: `text-xs font-medium text-foreground`
- Hover: underline

#### Submit Button
- Dimensi: `h-13 w-full`
- Background: primary
- Padding: `py-3.5`
- Border radius: `rounded-xl` (20px)
- Font: `text-sm font-semibold text-primary-foreground`
- Hover: `hover:opacity-90`
- Disabled: `disabled:opacity-80`
- Icon (ArrowRight/Loader2): `h-4 w-4`
- Icon (Loader2): `animate-spin`

#### Link ke Register
- Text: `text-xs text-muted-foreground`
- Link: `font-semibold text-foreground`
- Arrow text: "←"

#### Loading Overlay
- Position: `fixed inset-0 z-50`
- Background: `bg-background/70 backdrop-blur-sm`
- Content: flex items-center justify-center
- Card: `rounded-2xl border border-border bg-card px-8 py-6 shadow-lg`
- Icon (Loader2): `h-7 w-7 animate-spin text-primary`
- Text: `text-xs font-medium`

### States
- **Normal:** Semua field kosong
- **Error:** Alert merah muncul di bawah form
- **Loading:** Overlay semi-transparan dengan spinner
- **Focus:** Border berubah jadi primary (Electric Blue)

### Dark Mode Differences
- Background: pure black
- Foreground: near-white
- Card: dark gray (oklch 0.04 0 0)
- Input background: lebih gelap dengan opacity

### Interaksi
- Tap: input focus, button press
- Submit: POST ke API `/undangyah/v1/app/login`
- Toggle password: show/hide dengan EyeOff/Eye icon

---

## 4. Halaman: Register (`/register`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto flex min-h-screen flex-col px-6 pb-10)
    ├── header (flex items-center justify-between pt-5)
    │   └── img.logo (h-6)
    ├── div.progress (flex gap-1.5 mt-8)
    │   └── 3x div (h-1 flex-1 rounded-full)
    ├── h1 (text-2xl font-bold mt-6)
    ├── div.error (conditional)
    ├── form/step-1 (mt-6 space-y-4)
    ├── div/step-2 (mt-6 space-y-5) — OTP
    └── div/step-4 (mt-12 flex flex-col items-center text-center) — Success
```

### Elements

#### Progress Indicator
- 3 bar dengan `gap-1.5` (6px)
- Bar: `h-1 flex-1 rounded-full`
- Active: `bg-primary`
- Inactive: `bg-secondary`
- Transition: `transition-colors`

#### Form Fields (Step 1)
- Same pattern dengan Login (icon + input)
- 4 fields: Nama (User icon), Email (Mail icon), WhatsApp (Phone icon), Password (Lock icon)
- Input height: `py-3.5`
- Border: `rounded-xl`
- Focus: `focus:border-primary`

#### Continue Button
- `flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground`
- Disabled: `disabled:opacity-50`
- Icon: ArrowRight atau Loader2 (animate-spin)

#### OTP Input (Step 2)
- Container: `flex justify-center gap-2.5`
- Input: `h-13 w-11 rounded-xl border border-border bg-card text-center text-lg font-bold`
- Focus: `focus:border-primary`
- 6 digit inputs dengan auto-focus navigation

#### Phone Display Card
- `flex items-center gap-3 rounded-xl border border-border bg-card p-4`
- Icon container: `flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`
- Icon (Phone): `h-5 w-5 text-primary`

#### Resend OTP Button
- Active: `text-xs text-muted-foreground` (countdown)
- Inactive: `text-xs font-semibold text-primary`

#### Success State (Step 4)
- Icon container: `flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950`
- Icon (Check): `h-8 w-8 text-emerald-600`
- Heading: `text-lg font-bold`
- Subtitle: `text-sm text-muted-foreground`
- Auto-redirect: 1500ms ke dashboard

### States
- **Step 1:** Form input data diri
- **Step 2:** OTP verification dengan 6-digit input
- **Step 4:** Success dengan auto-redirect
- **Error:** Alert dengan `bg-destructive/10 text-destructive`
- **Loading:** Spinner di button, button disabled

### Dark Mode
- Background: pure black
- Input background: dark gray
- OTP inputs: dark surface

### Interaksi
- Keyboard navigation antar OTP input (Backspace, Arrow keys)
- Auto-focus next input saat karakter dimasukkan
- Countdown timer untuk resend OTP (60 detik)

---

## 5. Halaman: Onboarding (`/onboarding`)

### Layout Structure
```
div.flex.min-h-screen.flex-col.bg-background
└── div.max-w-md (mx-auto flex w-full flex-1 flex-col px-6 pt-6 pb-8)
    ├── header.flex (items-center justify-between)
    │   ├── div.brand (flex items-center gap-2)
    │   │   ├── div.h-9.w-9.rounded-xl.bg-primary
    │   │   │   └── Sparkles icon (h-4 w-4 text-primary-foreground)
    │   │   └── span (text-sm font-semibold)
    │   └── Link "Lewati" (text-xs text-muted-foreground)
    ├── div.center-content (flex flex-1 flex-col items-center justify-center text-center)
    │   ├── div.icon-container (flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground)
    │   │   └── Heart/Calendar/Image icon (h-7 w-7)
    │   ├── h1.font-serif (text-3xl font-bold)
    │   └── p (text-sm text-muted-foreground max-w-xs)
    ├── div.pagination (flex items-center justify-center gap-1.5)
    │   └── 3x span (h-1.5 rounded-full)
    └── button.cta (flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground)
```

### Elements

#### Brand Badge
- Container: `flex items-center gap-2`
- Icon box: `h-9 w-9 rounded-xl bg-primary text-primary-foreground`
- Icon: `Sparkles h-4 w-4`
- Text: `text-sm font-semibold`

#### Skip Link
- Position: top-right
- Font: `text-xs text-muted-foreground`
- Style: text link
- Target: navigasi ke "/"

#### Slide Icon
- Container: `h-20 w-20 rounded-2xl bg-primary text-primary-foreground`
- Icon center: `h-7 w-7`
- 3 slides dengan icons berbeda: Heart, Calendar, Image

#### Slide Title
- Font: Fraunces (serif), `text-3xl font-bold`
- Line height: `leading-tight`

#### Slide Description
- Font: Plus Jakarta Sans
- Size: `text-sm`
- Color: muted-foreground
- Max width: `max-w-xs` (320px)
- Margin top: `mt-3`

#### Pagination Dots
- Container: `flex gap-1.5`
- Active dot: `w-6 bg-primary` (24px width)
- Inactive dot: `w-1.5 bg-secondary` (6px width)
- Height: `h-1.5` (6px)
- Transition: `transition-all`

#### CTA Button
- Full width: `w-full`
- Padding: `py-3.5`
- Border radius: `rounded-xl` (20px)
- Font: `text-sm font-semibold text-primary-foreground`
- Last slide: text "Mulai Buat Undangan" + Check icon
- Other slides: text "Lanjut" + ArrowRight icon

### States
- **Slide 1:** "Selamat datang 🎉", Heart icon
- **Slide 2:** "Atur acara Anda", Calendar icon
- **Slide 3:** "Tema & Galeri", Image icon
- **Active dot:** Wide (24px), primary color
- **Inactive dot:** Narrow (6px), secondary color

### Dark Mode
- Background: pure black
- Icon container: primary (inverted to white)

### Interaksi
- Tap next: increment slide index, navigate on last
- Tap skip: navigate to "/invitations/new"
- Pagination animates with CSS transition

---

## 6. Halaman: Dashboard (`/`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-28)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-5)
    ├── section.quota-hero (px-5 mt-6)
    ├── section.stats (px-5 mt-6)
    ├── section.invitations (px-5 mt-7)
    ├── Quick Actions (KelolaUndangan component)
    ├── section.activities (px-5 mt-7)
    └── Bottom Navigation (fixed bottom-0)
```

### Elements

#### Header Bar
- Layout: `flex items-center justify-between px-5 pt-6 pb-5`
- Left: Avatar + Greeting
- Right: Search button + Bell button + Menu button

#### User Avatar (Header)
- Container: `flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold`
- Size: 44x44px
- Content: initials (2 huruf pertama nama)
- Text: `text-sm font-semibold text-primary-foreground`

#### Greeting Text
- Welcome text: `text-xs text-muted-foreground`
- User name: `text-base font-semibold leading-tight`

#### Icon Buttons (Header)
- Container: `flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card`
- Icon size: `h-5 w-5`
- Icons: Search (Search icon), Bell (Bell icon), Menu (Menu icon)
- Stroke: muted-foreground

#### Quota Hero Card
- Container: `relative overflow-hidden rounded-3xl bg-[#2563eb] p-6 text-white`
- Dimensions: full width - 40px, padding 24px
- Border radius: `rounded-3xl` (40px)
- Background: Electric Blue (#2563eb)
- Decorative circles: `absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5`

#### Quota Badge
- Container: `flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur`
- Icon: `Sparkles h-3 w-3`
- Border radius: full (pill shape)

#### Upgrade Link
- Font: `text-[11px] font-medium text-white/80`
- Hover: underline
- Position: top-right dari badge

#### Quota Number
- Label: `text-xs text-white/70`
- Number: `text-4xl font-bold tabular-nums`
- Total: `text-sm text-white/70`
- Format: "X / Y undangan"

#### Quota Progress Bar
- Container: `mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15`
- Fill: `h-full rounded-full bg-white transition-all`
- Width: calculated percentage

#### Quota Expiry Text
- Font: `text-[11px] text-white/70`
- Margin top: `mt-2`

#### Create Button (Hero)
- Container: `mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3`
- Font: `text-sm font-semibold text-[#2563eb]`
- Icon: `Plus h-4 w-4`
- Width: full width
- Border radius: full (pill)

#### Stats Cards (Grid 2x2)
- Grid: `grid grid-cols-2 gap-3`
- Card dimensions: varied, padding `p-4`
- Border radius: `rounded-2xl` (32px)
- Border: `border` dengan warna tone-specific
- Tone colors (4 variants):
  - **Blue:** card `bg-[#eaf2ff]`, border `border-[#cfe0ff]`, icon `bg-[#2563ff] text-white`
  - **Mint:** card `bg-[#e6f7f1]`, border `border-[#c4ecdd]`, icon `bg-[#10b981] text-white`
  - **Peach:** card `bg-[#fff1e8]`, border `border-[#ffdcc4]`, icon `bg-[#f97316] text-white`
  - **Lavender:** card `bg-[#f1ecff]`, border `border-[#dcd1ff]`, icon `bg-[#8b5cf6] text-white`

#### Stat Card Icon
- Container: `flex h-8 w-8 items-center justify-center rounded-full`
- Icon size: `h-4 w-4`
- Icon color: white

#### Stat Card Value
- Font: `text-xl font-bold leading-tight text-foreground`
- Tabular nums untuk number formatting

#### Stat Card Label
- Font: `text-xs text-muted-foreground`

#### Stat Card Delta
- Font: `text-[10px] font-semibold`
- Color: tone-specific

#### Section Title (Daftar Undangan)
- Font: `text-base font-semibold`
- Margin bottom: `mb-3`

#### View All Link
- Font: `text-xs text-muted-foreground`
- Position: right-aligned

#### Invitation Card
- Container: `flex items-center gap-3 rounded-2xl border border-border bg-card p-3`
- Border radius: `rounded-2xl` (32px)
- Padding: `p-3`

#### Invitation Initials Box
- Container: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-semibold`
- Size: 40x40px

#### Invitation Title
- Font: `text-sm font-semibold leading-tight`
- Truncate: aktif

#### Invitation Stats
- Font: `text-[11px] text-muted-foreground`
- Icon: `h-3 w-3`

#### Status Badge
- Pill shape: `rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Aktif: `bg-primary text-primary-foreground`
- Draft: `bg-secondary text-foreground`
- Border radius: full (pill)

#### Chevron Arrow
- Container: `flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground`
- Icon: `ChevronRight h-4 w-4`

#### Delete Button (Admin)
- Container: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive`
- Icon: `X h-3.5 w-3.5`
- Only visible untuk admin

#### Load More Button
- Container: `flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3`
- Font: `text-sm font-medium text-muted-foreground`

#### Empty State Card
- Container: `rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center`
- Icon: `h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center`
- Icon (Sparkles): `h-5 w-5 text-muted-foreground`
- Title: `text-sm font-semibold mt-3`
- Subtitle: `text-xs text-muted-foreground mt-1`
- CTA: `mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground`

#### Bottom Navigation
- Container: `fixed inset-x-0 bottom-0 z-40`
- Wrapper: `mx-auto max-w-md px-5 pb-5`
- Nav bar: `flex items-center justify-around rounded-full border border-border bg-card/95 p-2 shadow-lg backdrop-blur`
- Item size: `h-12 w-12 rounded-full`
- Active item: `bg-secondary text-foreground`
- Inactive item: `text-muted-foreground`
- Center FAB: `bg-primary text-primary-foreground`

#### Side Menu Drawer
- Overlay: `fixed inset-0 z-50 bg-black/40`
- Drawer: `fixed inset-y-0 right-0 z-50 w-[78%] max-w-xs bg-background shadow-2xl`
- Transition: `transition-transform duration-300`
- Transform: `translate-x-0` (open) / `translate-x-full` (closed)

#### Menu Header
- Layout: `flex items-center justify-between px-6 pt-6 pb-4`
- Title: `text-lg font-semibold`
- Close button: `h-9 w-9 rounded-full border border-border`

#### Dark Mode Toggle
- Container: `flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5`
- Icon (Sun): `h-4 w-4 text-muted-foreground`
- Label: `text-sm font-medium`
- Toggle switch: `relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors`
- Active: `bg-primary`
- Inactive: `bg-input`
- Knob: `inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform`
- Active transform: `translate-x-6`
- Inactive transform: `translate-x-1`

#### Menu Items
- Container: `flex items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-secondary`
- Icon container: `flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground`
- Icon: `h-4 w-4`
- Label: `text-sm font-medium`
- Chevron: `ChevronRight h-4 w-4 text-muted-foreground`

#### Logout Button
- Container: `block w-full rounded-2xl border border-border bg-card py-3 text-center text-sm font-medium`
- Position: `absolute inset-x-0 bottom-0 px-6 pb-6`

#### Activity Row
- Container: `flex items-center gap-3 rounded-2xl border border-border bg-card p-3`
- Avatar: `h-10 w-10 rounded-full bg-secondary text-xs font-semibold`
- Text: `text-sm font-medium`
- Subtext: `text-[11px] text-muted-foreground`
- Icon (Clock): `h-3 w-3`

### States
- **Loading:** Skeleton cards dengan animate-pulse
- **Empty:** Empty state card dengan CTA
- **Populated:** List of invitation cards
- **Admin view:** Delete button visible

### Dark Mode
- Background: pure black
- Card backgrounds: dark surface
- Quota hero: pure black (no blue)
- Bottom nav: semi-transparent black

### Responsive
- Max width: 448px (md)
- Full height untuk touch
- Safe area di bottom untuk iOS

---

## 7. Halaman: Buat Undangan Baru (`/invitations/new`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-32)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── div.progress (px-5)
    ├── div.error (mx-5 mt-4)
    ├── div.steps (px-5 pt-8)
    │   ├── Step 1: Mempelai form
    │   ├── Step 2: Tanggal & Link form
    │   └── Step 3: Theme grid
    └── Fixed Bottom Action Bar
```

### Elements

#### Back Button (Header)
- Container: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Icon: `ArrowLeft h-4 w-4`
- Action: navigate back atau ke "/"

#### Step Indicator
- Font: `text-xs text-muted-foreground`
- Format: "Langkah X dari 3"

#### Progress Bars
- Container: `flex gap-2`
- Bar: `h-1.5 flex-1 rounded-full`
- Active: `bg-primary`
- Inactive: `bg-secondary`

#### Step 1: Mempelai
- Title: `text-2xl font-bold`
- Subtitle: `text-sm text-muted-foreground mt-1`
- Form fields dengan icon (Heart)

#### Form Field Component
- Label: `text-xs font-medium text-muted-foreground`
- Required star: `text-red-500`
- Container: `mt-1.5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4`
- Icon: `h-4 w-4 text-muted-foreground`
- Input: `flex-1 bg-transparent py-3.5 text-sm outline-none`
- Date input: native `type="date"`

#### Step 2: Tanggal & Link
- Title: `text-2xl font-bold`
- Slug input container: `flex items-center overflow-hidden rounded-2xl border bg-card`
- Border color states:
  - Available: `border-emerald-400`
  - Taken: `border-red-400`
  - Default: `border-border`
- Slug prefix: `text-xs text-muted-foreground pl-4`
- Slug input: `flex-1 bg-transparent px-2 py-3.5 text-sm outline-none`
- Slug status icon: Loader2 (checking), Check (available)

#### Step 3: Theme Grid
- Title: `text-2xl font-bold`
- Subtitle: `text-xs text-muted-foreground`
- Search bar: `flex flex-1 items-center overflow-hidden rounded-lg border border-border bg-card`
- Search input: `flex-1 bg-transparent px-3 py-2.5 text-xs outline-none`
- Search button: `bg-primary text-primary-foreground px-3.5 h-full flex items-center justify-center`
- Search icon: `h-3.5 w-3.5`

#### Tier Filter Chips
- Container: `mt-3 flex gap-1.5 overflow-x-auto pb-1`
- Chip: `shrink-0 rounded-lg border px-3.5 py-1.5 text-[11px] font-semibold transition`
- Active: `border-primary bg-primary text-primary-foreground`
- Inactive: `border-border bg-card text-foreground`

#### Theme Card
- Container: `overflow-hidden rounded-md border bg-card p-2 transition`
- Border active: `border-primary ring-2 ring-primary/30`
- Border inactive: `border-border`
- Thumbnail: `aspect-square rounded-[5px] bg-secondary overflow-hidden`
- Image: `h-full w-full object-cover`
- Check badge: `absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground`
- Check icon: `h-3 w-3`
- Overlay: `absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 p-2 text-center`
- Badge text: `text-[8px] uppercase tracking-[0.2em] opacity-70 text-white`
- Name: `font-serif text-xs italic text-white`
- Category: `text-[10px] text-muted-foreground`
- Title: `text-sm font-semibold leading-tight truncate`
- Select button: `w-full rounded-md border py-1.5 text-[11px] font-semibold transition`
- Selected: `border-primary bg-primary text-primary-foreground`
- Unselected: `border-primary bg-transparent text-primary`

#### Theme Grid
- Layout: `mt-4 grid grid-cols-2 gap-3`

#### Loading State
- Container: `flex items-center justify-center py-12`
- Icon: `Loader2 h-6 w-6 animate-spin text-muted-foreground`

#### Bottom Action Bar
- Container: `fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur`
- Inner: `mx-auto max-w-md px-5 py-4`
- Button: `flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50`
- Icon (Loader2): `h-4 w-4 animate-spin`

### States
- **Step 1:** Nama mempelai pria & wanita
- **Step 2:** Tanggal + slug + availability check
- **Step 3:** Theme selection grid
- **Loading:** Spinner, disabled buttons
- **Error:** Red alert box
- **Slug checking:** Spinner icon
- **Slug available:** Green checkmark
- **Slug taken:** Red border

### Dark Mode
- Background: pure black
- Card: dark surface
- Theme overlay: gradient dari black

### Interaksi
- Step navigation via bottom button
- Theme selection tap to toggle
- Slug auto-clean (alphanumeric + dash only)
- Debounced slug availability check (500ms)

---

## 8. Halaman: Edit Undangan (`/invitations/$id/edit`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-10)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── section.hero (px-5)
    │   └── Dark hero card dengan progress
    ├── section.grid (mt-7 px-5)
    │   └── 3-column grid of EditTiles
    └── section.tips (mt-7 px-5)
        └── Tips card
```

### Elements

#### Back Button
- Link to="/"
- Container: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Icon: `ArrowLeft h-4 w-4`

#### Header Title
- Main: `text-sm font-semibold`
- Sub: `mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground`
- Sub icon (Cloud): `h-3 w-3`
- Saving state: `animate-pulse`

#### Share Button
- Link to="/invitations/$id/share"
- Container: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Icon: `Share2 h-4 w-4`

#### Hero Card (Dark)
- Container: `overflow-hidden rounded-3xl bg-[#0f0f11] p-5 text-white`
- Border radius: `rounded-3xl` (40px)
- Background: near-black (#0f0f11)
- Padding: `p-5` (20px)

#### Status Badge
- Container: `flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold`
- Active: `bg-emerald-500/20 text-emerald-300`
- Draft: `bg-white/10 text-white/70`
- Dot: `h-1.5 w-1.5 rounded-full`
- Active dot: `bg-emerald-400`
- Draft dot: `bg-white/50`

#### Hero Title
- Font: `text-xl font-bold`
- Color: white
- Source: invitation title atau couple name

#### Hero Subtitle
- Font: `text-xs text-white/70`
- Format: "{date} · undangyah.id/{slug}"

#### Progress Section
- Label: `text-[11px] text-white/70`
- Number: `text-2xl font-bold tabular-nums text-white`
- Unit: `text-base font-medium text-white/70`
- Right side: `text-sm font-semibold`
- Subtext: `text-[11px] text-white/70`

#### Progress Bar
- Container: `mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15`
- Fill: `h-full rounded-full bg-white transition-all`

#### Action Buttons Row
- Layout: `mt-5 grid grid-cols-3 gap-2`
- Button: `flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold`
- Preview: `bg-white/10 text-white backdrop-blur`
- RSVP: `bg-white/10 text-white backdrop-blur`
- Amplop: `bg-white text-[#0f0f11]`
- Amplop icon (Wallet): `h-4 w-4`

#### Section Title
- Font: `text-base font-semibold`
- Margin: `mb-3`

#### Edit Tile Grid
- Layout: `grid grid-cols-3 gap-3`

#### Edit Tile
- Container: `flex flex-col items-center text-center`
- Icon container: `relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-sm`
- Icon size: `h-5 w-5`
- Complete badge: `absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-background`
- Badge icon: `h-3 w-3`
- Progress badge: `absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-muted-foreground ring-2 ring-background`
- Label: `mt-2 text-[11px] font-medium leading-tight`

#### Tips Card
- Container: `rounded-2xl border border-dashed border-border bg-card p-4`
- Title: `text-sm font-semibold`
- Text: `text-xs text-muted-foreground mt-1`

### States
- **Loading:** Full screen spinner
- **Draft:** Status badge gray
- **Published:** Status badge green
- **Saving:** Cloud icon pulses
- **Section complete:** Green checkmark badge
- **Section incomplete:** Progress percentage badge

### Dark Mode
- Hero card: pure black
- Edit tiles: blue (#2563eb)
- Progress badges: dark backgrounds

### Interaksi
- Toggle status: POST ke API
- Tap tile: navigate to section edit
- Toast notifications untuk save/error

---

## 9. Halaman: Share Undangan (`/invitations/$id/share`)

### Layout Structure
```
div.bg-secondary/40
├── Pull indicator
└── div.max-w-md (mx-auto pb-28)
    ├── header.flex
    ├── section.tambah-tamu (px-5 pt-5)
    ├── section.link (px-5)
    ├── section.daftar-tamu (px-5 mt-5)
    ├── Sticky search + filter
    ├── section.list (px-5 pt-3)
    ├── FAB (fixed bottom-6 right-6)
    ├── Bulk action bar (fixed bottom)
    ├── Alert dialogs
    ├── Import modal (fixed)
    └── Edit guest modal (fixed)
```

### Elements

#### Header
- Layout: `flex items-center justify-between px-5 pt-6 pb-4`
- Back button: `ArrowLeft` + Home button
- Title: `text-sm font-semibold`
- Menu button: `Menu h-4 w-4`

#### Tambah Tamu Card
- Container: `rounded-2xl bg-background p-5 shadow-sm`
- Title: `text-base font-bold`
- Subtitle: `text-[11px] text-muted-foreground`

#### Step Pills
- Layout: `grid grid-cols-2 gap-2`
- Container: `flex items-center gap-3 rounded-2xl border p-3 text-left transition`
- Active: `border-primary bg-primary/5`
- Inactive: `border-border bg-background`
- Number badge: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold`
- Active badge: `bg-primary text-primary-foreground`
- Inactive badge: `bg-secondary text-foreground`
- Step title: `text-sm font-bold leading-tight`
- Step sub: `text-[10px] text-muted-foreground truncate`

#### Input Fields
- Name input: `w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none`
- Phone input: `flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none`
- Remove row button: `flex h-10 w-10 items-center justify-center rounded-full border border-border`
- Remove icon: `X h-4 w-4 text-muted-foreground`
- Add row button: `flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold`
- Add icon: `Plus h-4 w-4`

#### Group Input
- Label: `text-sm font-bold`
- Input: `mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none`

#### Next Button
- Container: `mt-3 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground`

#### Template Textarea
- Container: `mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none`
- Rows: 7
- Variable tags: `code rounded bg-secondary px-1 text-[10px]`

#### Action Buttons Row (Step 2)
- Back: `flex-1 rounded-full border border-border bg-background py-3 text-sm font-semibold`
- Save: `flex-[1.5] rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground`

#### Link Card
- Container: `rounded-2xl bg-background p-4 shadow-sm`
- Label: `text-xs font-semibold text-muted-foreground`
- Link display: `flex items-center gap-2 rounded-xl border border-border bg-secondary/40 p-2 pl-3`
- Icon (Link2): `h-4 w-4 shrink-0 text-muted-foreground`
- URL text: `flex-1 truncate text-xs`
- Copy button: `flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground`
- Copy icon: `Copy h-3 w-3` atau `Check h-3 w-3` saat copied

#### Guest Section Title
- Font: `text-base font-bold`
- Export button: `flex items-center gap-1 text-xs font-semibold text-primary`

#### Sticky Search Bar
- Container: `sticky top-0 z-20 -mx-0 mt-1 bg-secondary/80 px-5 py-2 backdrop-blur`
- Input container: `flex items-center gap-2 rounded-xl border border-border bg-background px-3`
- Icon (Search): `h-4 w-4 text-muted-foreground`
- Input: `flex-1 bg-transparent py-2.5 text-xs outline-none`
- Clear button: `X h-3.5 w-3.5 text-muted-foreground`

#### Filter Chips
- Container: `flex gap-1.5 overflow-x-auto`
- Chip: `shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition`
- Active: `bg-primary text-primary-foreground`
- Inactive: `border border-border bg-background text-muted-foreground`
- Count badge: `rounded-full px-1.5 text-[10px]`
- Active badge: `bg-primary-foreground/20`
- Inactive badge: `bg-secondary`

#### Guest Card (GuestCard component)
- Container: `rounded-2xl bg-background p-4 shadow-sm transition`
- Checked: `ring-2 ring-primary`
- Checkbox: `mt-2 h-4 w-4 rounded border-border`
- Avatar: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary`
- Name: `text-sm font-bold capitalize`
- Group badge: `mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold`
- Phone: `mt-1 text-[11px] text-muted-foreground`
- Status badge: `shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Opened: `bg-emerald-100 text-emerald-700`
- Not opened: `bg-amber-100 text-amber-700`

#### Status Tags
- Container: `mt-3 flex flex-wrap gap-1.5`
- Tag: `rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Sent: `bg-emerald-100 text-emerald-700`
- Not sent: `bg-amber-100 text-amber-700`
- RSVP Hadir: `bg-emerald-100 text-emerald-700`
- RSVP Tidak: `bg-rose-100 text-rose-700`
- RSVP Pending: `bg-amber-100 text-amber-700`

#### Action Buttons Grid
- Layout: `mt-3 grid grid-cols-3 gap-2`
- Button: `flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-semibold`
- WA button: `border-emerald-200 bg-emerald-50 text-emerald-700`
- Copy button: `bg-secondary text-foreground border-border`
- More button: `bg-blue-50 text-blue-700 border-blue-200`

#### Empty State
- Container: `flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-6 py-12 text-center`
- Icon: `flex h-16 w-16 items-center justify-center rounded-full bg-secondary`
- Icon (Search/Inbox): `h-7 w-7 text-muted-foreground`
- Title: `mt-4 text-sm font-bold`
- Subtitle: `mt-1 text-xs text-muted-foreground`

#### FAB (Floating Action Button)
- Container: `fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30`
- Size: 56x56px
- Icon: `Plus h-6 w-6`

#### Bulk Action Bar
- Container: `fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4`
- Bar: `flex w-full max-w-md items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-xl`
- Clear button: `flex h-10 w-10 items-center justify-center rounded-xl bg-secondary`
- Clear icon: `X h-4 w-4`
- Count: `flex-1 px-1 text-xs font-semibold`
- Select all: `rounded-xl bg-secondary px-3 py-2 text-[11px] font-semibold`
- WA bulk: `flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white`
- Delete bulk: `flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-[11px] font-semibold text-white`

#### Menu Dropdown
- Container: `absolute right-0 top-12 z-40 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg`
- Item: `flex w-full items-center gap-3 border-b border-border px-3.5 py-3 text-left text-sm hover:bg-secondary/50`
- Danger item: `text-rose-600`
- Item icon: `h-4 w-4`

#### Import Modal
- Container: `fixed inset-0 z-50 flex items-end justify-center bg-black/40`
- Sheet: `w-full max-w-md rounded-t-2xl bg-card p-5 pb-8 space-y-4`
- Handle: `mx-auto mb-4 h-1 w-10 rounded-full bg-border`
- Title: `text-sm font-bold`
- Close: `text-xs text-muted-foreground`
- Textarea: `w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none resize-none focus:border-primary font-mono`
- Button: `flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-semibold`

#### Edit Guest Modal
- Container: `fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm`
- Sheet: `w-full max-w-md rounded-t-3xl bg-background p-5 pb-8`
- Handle: `mx-auto mb-4 h-1 w-10 rounded-full bg-border`
- Title: `text-base font-bold`
- Field label: `text-xs font-medium text-muted-foreground`
- Input: `mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary`
- Cancel button: `flex-1 rounded-xl border border-border py-3 text-sm font-semibold`
- Save button: `flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50`

### States
- **Step 1:** Input data tamu
- **Step 2:** Template pesan
- **Loading:** Skeleton
- **Empty:** Empty state
- **Filtered:** Filtered list
- **Selected:** Ring highlight
- **Copied:** Checkmark icon + "Tersalin"

### Dark Mode
- Background: pure black
- Cards: dark surface
- Secondary: dark gray

### Interaksi
- Pull to refresh (60px threshold)
- Swipe left on guest: delete
- Swipe right on guest: send WA
- Tap checkbox: toggle selection
- Bulk actions untuk multiple select

---

## 10. Halaman: Broadcast WhatsApp (`/invitations/$id/broadcast`)

### Layout Structure
```
div.min-h-screen.bg-background
├── header.sticky (flex items-center gap-3 px-4 py-3)
│   ├── Back button
│   ├── Title + subtitle
│   └── Status badge
├── div.tabs (flex border-b border-border)
│   └── 3x Tab button
└── div.p-4 (space-y-4)
    ├── Device tab content
    ├── Send tab content
    └── History tab content
```

### Elements

#### Header
- Layout: `sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg`
- Back button: `flex h-9 w-9 items-center justify-center rounded-full border border-border`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-bold`
- Subtitle: `text-[11px] text-muted-foreground`
- Status badge: `flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400`
- Badge icon: `Wifi h-3 w-3`

#### Tab Buttons
- Layout: `flex-1 py-3 text-xs font-semibold transition`
- Active: `border-b-2 border-primary text-primary`
- Inactive: `text-muted-foreground`

#### Device Card
- Container: `rounded-2xl border border-border bg-card p-4`
- Icon container: `flex h-10 w-10 items-center justify-center rounded-xl`
- Connected: `bg-emerald-100 dark:bg-emerald-950`
- Disconnected: `bg-rose-100 dark:bg-rose-950`
- Icon: `Wifi h-4 w-4` atau `WifiOff h-4 w-4`
- Title: `text-sm font-semibold`
- Subtitle: `text-xs font-medium`
- Connected: `text-emerald-600`
- Buttons: `flex h-9 w-9 items-center justify-center rounded-xl border border-border`
- Logout button: `border-rose-200 text-rose-600`

#### QR Code Container
- Container: `flex flex-col items-center rounded-2xl border border-border bg-card p-6`
- QR image: `rounded-xl border border-border bg-white p-3`
- QR size: `h-48 w-48`
- Refresh button: `flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50`
- Check button: `flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold`
- Instructions: `mt-3 text-center text-[11px] text-muted-foreground`

#### Quota Card
- Container: `rounded-2xl border border-border bg-card p-4`
- Label: `text-xs font-medium text-muted-foreground`
- Number: `text-2xl font-bold`
- Total: `text-xs text-muted-foreground`
- Progress bar: `mt-2 h-2 overflow-hidden rounded-full bg-secondary`
- Fill: `h-full rounded-full bg-primary transition-all`

#### No Device State
- Container: `flex flex-col items-center py-10 text-center`
- Icon: `Smartphone h-12 w-12 text-muted-foreground`
- Title: `mt-4 text-sm font-semibold`
- Subtitle: `mt-1 text-xs text-muted-foreground`
- CTA: `mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50`

#### Broadcast Active Card
- Container: `rounded-2xl border border-border bg-card p-4`
- Title: `text-sm font-bold`
- Status badge: `rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Running: `bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400`
- Paused: `bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400`
- Stats grid: `mt-3 grid grid-cols-3 gap-3`
- Stat: `rounded-xl bg-secondary p-3 text-center`
- Stat number: `text-lg font-bold`
- Stat label: `text-[10px] text-muted-foreground`
- Progress bar: `mt-3 h-2 overflow-hidden rounded-full bg-secondary`
- Fill: `h-full rounded-full bg-emerald-500 transition-all`

#### Pause/Resume Button
- Pause: `flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-semibold`
- Resume: `flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground`

#### Recipient Row
- Container: `flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5`
- Status icon: `h-4 w-4`
- Sent: `text-emerald-500`
- Failed: `text-rose-500`
- Pending: `text-muted-foreground`
- Name: `text-xs font-medium truncate`
- Phone: `text-[10px] text-muted-foreground`
- Status text: `text-[10px] font-semibold`
- More indicator: "+X lainnya"

#### Send Tab - Eligible Count
- Container: `rounded-2xl border border-border bg-card p-4`
- Icon: `flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`
- Icon: `Users h-5 w-5 text-primary`
- Label: `text-sm font-semibold`
- Count: `text-xs text-muted-foreground`

#### Send Button
- Container: `flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-semibold text-white disabled:opacity-50`
- Icon: `Send h-4 w-4`

#### Alert Box
- Container: `flex flex-col items-center rounded-2xl border border-dashed border-border py-10 text-center`
- Icon: `AlertTriangle h-10 w-10 text-amber-500`
- Title: `mt-3 text-sm font-semibold`
- Subtitle: `mt-1 text-xs text-muted-foreground`
- CTA: `mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground`

#### History Card
- Container: `rounded-2xl border border-border bg-card p-4`
- Date: `text-xs font-semibold`
- Status badge: `rounded-full px-2 py-0.5 text-[10px] font-semibold`
- Completed: `bg-emerald-100 text-emerald-700`
- Failed: `bg-rose-100 text-rose-700`
- Other: `bg-blue-100 text-blue-700`
- Stats row: `mt-2 flex gap-4 text-xs text-muted-foreground`
- Stat: `flex items-center gap-1`

### States
- **Device disconnected:** Shows QR code
- **Device connecting:** Shows loading
- **Device connected:** Shows green status
- **Broadcast running:** Shows progress
- **Broadcast paused:** Shows paused state
- **Broadcast completed:** Shows completion

### Dark Mode
- Background: pure black
- Cards: dark surface
- QR container: white border
- Status badges: dark variants

---

## 11. Halaman: RSVP Tamu (`/invitations/$id/rsvp`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-10)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── section.stats (px-5)
    ├── section.search (mt-5 px-5)
    ├── section.tabs (mt-4 px-5)
    └── section.list (mt-4 px-5)
```

### Elements

#### Header
- Back link: `Link to="/invitations/$id/edit"`
- Back button: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-semibold`
- Export button: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Export icon: `Download h-4 w-4`

#### Stats Grid
- Layout: `grid grid-cols-3 gap-2`
- Card: `rounded-2xl border border-border bg-card p-3 text-center`
- Icon container: `mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-secondary`
- Icon size: `h-3.5 w-3.5`
- Value: `text-lg font-bold leading-none tabular-nums mt-2`
- Label: `text-[10px] text-muted-foreground mt-1`

#### Search Bar
- Container: `flex items-center gap-2 rounded-full border border-border bg-card px-4`
- Icon: `Search h-4 w-4 text-muted-foreground`
- Input: `flex-1 bg-transparent py-3 text-sm outline-none`

#### Tab Chips
- Container: `flex gap-2 overflow-x-auto`
- Chip: `shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition`
- Active: `bg-primary text-primary-foreground`
- Inactive: `border border-border bg-card text-muted-foreground`

#### RSVP Row Card
- Container: `rounded-2xl border border-border bg-card p-3`
- Avatar: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold`
- Name: `text-sm font-semibold truncate`
- Meta: `flex items-center gap-2 text-[11px] text-muted-foreground`
- Meta icon: `Clock h-3 w-3`
- Guests: `flex items-center gap-1`
- Guests icon: `Users h-3 w-3`
- Status badge: `rounded-full px-2.5 py-1 text-[10px] font-semibold`
- Hadir: `bg-primary text-primary-foreground`
- Tidak: `bg-accent text-foreground`
- Pending: `bg-secondary text-foreground`
- Edit button: `flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary`
- Delete button: `flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10`
- Edit icon: `Pencil h-3.5 w-3.5`
- Delete icon: `Trash2 h-3.5 w-3.5`

#### Message Box
- Container: `mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3`
- Icon: `MessageCircle h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5`
- Text: `text-xs text-foreground/80`

#### Edit Form (Inline)
- Container: `rounded-2xl border border-primary bg-card p-4 space-y-3`
- Input: `w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary`
- Select: `flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary`
- Pax input: `w-20 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary`
- Textarea: `w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary resize-none`
- Cancel button: `flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold`
- Save button: `flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground`

#### Empty State
- Container: `rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground`

### States
- **Loading:** Full screen spinner
- **Empty:** Empty state message
- **Filtered:** Tab-filtered results
- **Editing:** Inline edit form

### Dark Mode
- Background: pure black
- Cards: dark surface
- Secondary: dark gray

---

## 12. Halaman: Analytics Undangan (`/invitations/$id/analytics`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-10)
    ├── SmartBack header
    ├── section.inv-info (px-5)
    ├── section.metrics (mt-4 grid grid-cols-2 gap-3 px-5)
    ├── section.chart (mt-6 px-5)
    └── section.summary (mt-6 px-5)
```

### Elements

#### Invitation Info Card
- Container: `rounded-2xl border border-border bg-card p-5`
- Title: `text-xs text-muted-foreground`
- Slug: `text-sm font-semibold mt-1`
- Trend badge: `mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300`
- Trend icon: `TrendingUp h-3 w-3`

#### Metric Card
- Container: `rounded-2xl border border-border bg-card p-4`
- Icon container: `flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground`
- Icon: `h-4 w-4`
- Value: `text-lg font-bold mt-3`
- Label: `text-[11px] text-muted-foreground`

#### Chart Section
- Title: `text-sm font-semibold mb-3`
- Container: `rounded-2xl border border-border bg-card p-5`
- Bar chart: `flex items-end justify-between gap-2`
- Bar: `w-full rounded-md bg-primary/80`
- Bar label: `text-[10px] text-muted-foreground text-center`

#### Source Row
- Container: `flex items-center gap-3 rounded-xl border border-border bg-card p-3`
- Icon container: `flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground`
- Label: `text-sm font-medium`
- Value: `text-sm font-bold`

### States
- **Loading:** Spinner
- **No data:** Empty sections

### Dark Mode
- Background: pure black
- Cards: dark surface

---

## 13. Halaman: Katalog Paket (`/catalog`)

### Layout Structure
```
div.min-h-screen.bg-secondary/40
└── div.max-w-md (mx-auto pb-32)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── Packages section (px-5)
    ├── Addons section (mt-6 px-5)
    └── Summary section (mt-6 px-5)
└── Fixed CTA (bottom)
```

### Elements

#### Header
- Back button: `flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-semibold`
- Spacer: `h-10 w-10`

#### Section Header
- Icon: `Package h-4 w-4 text-primary` atau `Sparkles h-4 w-4 text-primary`
- Title: `text-base font-bold`

#### Package Card
- Container: `relative w-full rounded-xl border bg-background p-4 text-left transition`
- Active: `border-primary ring-1 ring-primary/30`
- Inactive: `border-border`
- Popular badge: `absolute -top-2 right-4 rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground`
- Checkbox: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full border`
- Active checkbox: `border-primary bg-primary text-primary-foreground`
- Inactive checkbox: `border-border`
- Check icon: `h-3 w-3`
- Title: `text-sm font-bold`
- Price: `text-sm font-bold text-primary`
- Tier badge: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- Features grid: `mt-2 grid grid-cols-2 gap-x-2 gap-y-1`
- Feature item: `flex items-center gap-1 text-[11px] text-muted-foreground`
- Feature icon: `Check h-2.5 w-2.5 text-emerald-600`

#### Addon Card
- Container: `relative rounded-xl border bg-background p-3 text-left transition`
- Icon container: `flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground`
- Icon: `h-4 w-4`
- Title: `text-sm font-bold leading-tight mt-2`
- Desc: `text-[10px] text-muted-foreground`
- Price: `text-xs font-bold text-primary mt-1.5`
- Price format: `+Rp Xk`
- Check badge: `absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground`

#### Summary Card
- Container: `rounded-xl bg-background p-4 shadow-sm`
- Row: `flex items-center justify-between text-sm`
- Label: `text-muted-foreground`
- Value: `font-semibold`
- Divider: `my-2 border-t border-dashed border-border`
- Total label: `text-sm font-bold`
- Total value: `text-lg font-bold text-primary`

#### CTA Button
- Container: `mx-auto max-w-md px-5 pt-3 bg-gradient-to-t from-background via-background to-transparent`
- Button: `flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg`
- Icon: `ShoppingCart h-4 w-4`

### States
- **Loading:** Full screen spinner
- **Selected package:** Ring + checkmark
- **Selected addon:** Check badge visible

### Dark Mode
- Background: pure black
- Cards: dark surface

---

## 14. Halaman: Checkout (`/checkout/$slug`)

### Layout Structure
```
div.min-h-screen.bg-secondary/40
└── div.max-w-md (mx-auto pb-32)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── Error alert (mx-5 mb-4)
    ├── Product summary section
    ├── Addons section (mt-5 px-5)
    ├── Registration section (mt-6 px-5)
    ├── Payment methods section (mt-6 px-5)
    ├── Voucher section (mt-6 px-5)
    └── Summary section (mt-6 px-5)
└── Fixed CTA (bottom)
```

### Elements

#### Product Card
- Container: `overflow-hidden rounded-2xl bg-background shadow-sm border border-border`
- Header: `bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5`
- Badge: `inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary`
- Title: `text-xl font-bold`
- Price: `text-2xl font-bold text-primary`
- Unit: `text-xs text-muted-foreground`
- Divider: `border-t border-border`
- Feature list: `border-t border-border px-5 py-4`
- Feature header: `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5`

#### Feature Row
- Layout: `flex items-center gap-2`
- Check: `Check h-3 w-3 text-emerald-600`
- Text: varies

#### Addon Row
- Container: `flex w-full items-center gap-3 rounded-xl border bg-background p-4 text-left transition`
- Active: `border-primary ring-1 ring-primary/30`
- Inactive: `border-border`
- Checkbox: `flex h-5 w-5 shrink-0 items-center justify-center rounded-md border`
- Name: `text-sm font-semibold`
- Desc: `text-[11px] text-muted-foreground`
- Price: `shrink-0 text-xs font-semibold`

#### Registration Section
- Title: `text-base font-bold mb-3`
- Container: `space-y-3 rounded-xl bg-background p-5 shadow-sm`
- Field: `space-y-1`
- Field label: `text-xs font-semibold`
- Input: `flex-1 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background`
- Verify button: `rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-50`
- Verified badge: `flex items-center gap-1 rounded-lg bg-emerald-100 px-3 text-xs font-semibold text-emerald-700`

#### Payment Method Row
- Container: `flex w-full items-center gap-3 rounded-xl border bg-background p-4 text-left transition`
- Radio: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full border`
- Payment image: `h-6 w-auto`
- Name: `text-sm font-semibold`
- Fee: `text-[11px] text-muted-foreground`

#### Voucher Section
- Title: `text-base font-bold mb-3`
- Container: `rounded-xl bg-background p-3 shadow-sm`
- Input: `flex-1 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm uppercase outline-none`
- Apply button: `rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50`
- Result: `mt-2 text-[11px] font-semibold`
- Success: `text-emerald-600`
- Error: `text-destructive`

#### Summary Section
- Title: `text-base font-bold mb-3`
- Container: `space-y-2 rounded-xl bg-background p-5 shadow-sm`
- Row: `flex items-center justify-between`
- Label: `text-muted-foreground` atau `text-sm font-bold`
- Value: `font-semibold` atau `text-lg font-bold text-primary`
- Divider: `my-2 border-t border-dashed border-border`

#### CTA Button
- Container: `mx-auto max-w-md px-5 pb-5 pt-3 bg-gradient-to-t from-background via-background to-transparent`
- Button: `flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg`

### States
- **Loading:** Full screen spinner
- **Error:** Red alert box
- **Logged in:** Registration section hidden
- **Voucher applied:** Success/error message
- **Phone verified:** Green badge

### Dark Mode
- Background: pure black
- Cards: dark surface
- Gradient header: dark variant

---

## 15. Halaman: Profil (`/profile`)

### Layout Structure
```
div.min-h-screen.bg-background
└── div.max-w-md (mx-auto pb-10)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    ├── section.profile-card (px-5)
    ├── section.quick-stats (mt-4 px-5)
    ├── section.info (mt-6 px-5)
    ├── section.akun (mt-6 px-5)
    ├── section.pengaturan (mt-6 px-5)
    └── section.logout (mt-6 px-5)
```

### Elements

#### Header
- Back link: `Link to="/"`
- Back button: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-semibold`
- Edit button: `Link to="/profile/edit"`
- Edit button: `flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card`
- Edit icon: `Pencil h-4 w-4`

#### Profile Card
- Container: `rounded-3xl border border-border bg-card p-5 text-center`
- Avatar container: `relative mx-auto h-20 w-20`
- Avatar image: `h-20 w-20 rounded-full object-cover`
- Avatar fallback: `flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground`
- Camera button: `absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow`
- Camera icon: `Camera h-3.5 w-3.5` atau `Loader2 h-3.5 w-3.5 animate-spin`
- Name: `text-lg font-bold mt-3`
- Email: `text-xs text-muted-foreground`
- Package badge: `mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground`
- Badge icon: `Crown h-3 w-3`

#### Quick Stats
- Container: `grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card`
- Cell: `p-3 text-center`
- Value: `text-lg font-bold tabular-nums`
- Label: `text-[10px] text-muted-foreground`

#### Info Section
- Section label: `text-xs font-semibold text-muted-foreground uppercase tracking-wider`

#### Info Row
- Container: `flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5`
- Icon container: `flex h-9 w-9 items-center justify-center rounded-xl bg-secondary`
- Icon: `h-4 w-4`
- Label: `text-[11px] text-muted-foreground`
- Value: `text-sm font-medium truncate`

#### Menu Group
- Container: `overflow-hidden rounded-2xl border border-border bg-card`

#### Menu Row
- Container: `flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary/50`
- Last item: no border
- Other items: `border-b border-border`
- Icon container: `flex h-9 w-9 items-center justify-center rounded-xl bg-secondary`
- Icon: `h-4 w-4`
- Label: `text-sm font-medium`
- Hint: `text-xs text-muted-foreground`
- Chevron: `ChevronRight h-4 w-4 text-muted-foreground`

#### Theme Toggle Row
- Container: `flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition hover:bg-secondary/50`
- Icon container: `flex h-9 w-9 items-center justify-center rounded-xl bg-secondary`
- Toggle: `relative h-6 w-11 rounded-full transition-colors`
- Active: `bg-primary`
- Inactive: `bg-secondary`
- Knob: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform`
- Active transform: `translate-x-5`
- Inactive transform: `translate-x-0.5`

#### Logout Button
- Container: `flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground`
- Icon: `LogOut h-4 w-4`

#### Version Text
- Container: `mt-4 text-center`
- Font: `text-[11px] text-muted-foreground`

### States
- **Loading:** Full screen spinner
- **Uploading avatar:** Camera button shows spinner

### Dark Mode
- Background: pure black
- Cards: dark surface
- Toggle: inverted

---

## 16. Halaman: Notifikasi (`/notifications`)

### Layout Structure
```
div.min-h-screen.bg-background
├── header.sticky (flex items-center gap-3 px-4 py-3)
│   ├── Back button
│   ├── Title + unread count
│   ├── Refresh button
│   └── Mark all read button
├── div.tabs (flex border-b border-border)
│   ├── Inbox tab
│   └── General tab
└── div.p-4
    └── Notification list
```

### Elements

#### Header
- Layout: `sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg`
- Back button: `flex h-9 w-9 items-center justify-center rounded-full border border-border`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-bold`
- Unread: `text-[11px] text-primary font-medium`
- Refresh button: `flex h-9 w-9 items-center justify-center rounded-full border border-border`
- Refresh icon: `RefreshCw h-4 w-4` dengan conditional `animate-spin`
- Mark all button: `flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-[11px] font-semibold`
- Icon: `CheckCheck h-3.5 w-3.5`

#### Tab Buttons
- Layout: `flex-1 py-3 text-xs font-semibold transition`
- Active: `border-b-2 border-primary text-primary`
- Inactive: `text-muted-foreground`
- Badge: `ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground`

#### Notification Card
- Container: `flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition`
- Unread: `border-primary/20 bg-primary/5`
- Read: `border-border bg-card`
- Icon container: `mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl`
- Admin: `bg-amber-100 dark:bg-amber-950`
- Regular: `bg-blue-100 dark:bg-blue-950`
- Icon: `Megaphone h-4 w-4 text-amber-600` atau `Info h-4 w-4 text-blue-600`
- Title: `text-xs font-bold` (unread) atau `text-xs font-medium` (read)
- Unread dot: `h-2 w-2 shrink-0 rounded-full bg-primary`
- Message: `text-[11px] text-muted-foreground line-clamp-2 mt-0.5`
- Time: `text-[10px] text-muted-foreground mt-1`

#### Empty State
- Container: `flex flex-col items-center py-16 text-center`
- Icon: `flex h-14 w-14 items-center justify-center rounded-full bg-secondary`
- Icon: `BellOff h-6 w-6 text-muted-foreground`
- Title: `mt-4 text-sm font-semibold`
- Subtitle: `mt-1 text-xs text-muted-foreground`

#### Loading State
- Container: `flex items-center justify-center py-16`
- Spinner: `Loader2 h-6 w-6 animate-spin text-muted-foreground`

### States
- **Loading:** Spinner
- **Empty:** BellOff icon + message
- **Unread:** Blue/amber background + dot
- **Read:** Default card style

### Dark Mode
- Background: pure black
- Unread: dark tint
- Admin icon: dark amber
- Regular icon: dark blue

---

## 17. Halaman: AI Assistant (`/ai-assistant`)

### Layout Structure
```
div.min-h-screen.bg-background
├── header.sticky (flex items-center gap-3 px-4 py-3)
│   ├── Back button
│   ├── Title + subtitle
│   └── Sparkles icon
└── div.p-4 (space-y-4)
    ├── Mode tabs
    ├── Input section
    └── Results section
```

### Elements

#### Header
- Layout: `sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg`
- Back button: `flex h-9 w-9 items-center justify-center rounded-full border border-border`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-bold`
- Subtitle: `text-[11px] text-muted-foreground`
- Icon: `Sparkles h-5 w-5 text-primary`

#### Mode Tabs
- Container: `flex gap-1 rounded-xl bg-secondary p-1`
- Tab: `flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-semibold transition`
- Active: `bg-background shadow-sm`
- Inactive: `text-muted-foreground`
- Icon: `FileText h-4 w-4` atau `Image h-4 w-4`

#### Text Input Section
- Description: `text-xs text-muted-foreground`
- Textarea: `w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none resize-none focus:border-primary`
- Rows: 8
- Placeholder: multi-line example text

#### Image Upload Section
- Image grid: `grid grid-cols-3 gap-2`
- Image tile: `relative aspect-square rounded-xl overflow-hidden border border-border`
- Image: `h-full w-full object-cover`
- Remove button: `absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-[10px]`
- Upload button: `flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-xs font-semibold text-muted-foreground`
- Upload icon: `Image h-5 w-5`

#### Submit Button
- Container: `flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50`
- Icon: `Sparkles h-4 w-4` atau `Loader2 h-4 w-4 animate-spin`

#### Result Header
- Container: `flex items-center justify-between`
- Left: `flex items-center gap-2`
- Left icon: `CheckCircle2 h-4 w-4 text-emerald-500`
- Left text: `text-xs font-bold`
- Right: `flex items-center gap-2`
- Confidence badge: `rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary`
- Copy button: `flex h-7 w-7 items-center justify-center rounded-lg border border-border`
- Copy icon: `Copy h-3.5 w-3.5` atau `Check h-3.5 w-3.5 text-emerald-500`

#### Warning Box
- Container: `rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30`
- Warning item: `flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300`
- Icon: `AlertTriangle h-3 w-3 shrink-0 mt-0.5`

#### Result Section
- Container: `rounded-xl border border-border bg-card p-3`
- Section label: `mb-2 text-[10px] font-bold text-muted-foreground uppercase`
- Row: `flex items-start gap-2 py-1.5 border-b border-border last:border-0`
- Key: `w-28 shrink-0 text-[10px] font-medium text-muted-foreground uppercase`
- Value: `flex-1 text-xs`

### States
- **Mode text:** Textarea visible
- **Mode image:** Upload grid visible
- **Loading:** Spinner + disabled button
- **Success:** Result sections visible
- **Warnings:** Warning box visible

### Dark Mode
- Background: pure black
- Warning: dark variant

---

## 18. Halaman: Share Picker (`/share`)

### Layout Structure
```
div.min-h-screen.bg-secondary/40
└── div.max-w-md (mx-auto pb-10)
    ├── header.flex (items-center justify-between px-5 pt-6 pb-4)
    └── section (px-5 space-y-2)
        └── List of invitation links
```

### Elements

#### Header
- Back button: `flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card`
- Back icon: `ArrowLeft h-4 w-4`
- Title: `text-sm font-semibold`
- Spacer: `w-10`

#### Invitation Row
- Container: `flex items-center gap-3 rounded-xl bg-card p-4`
- Icon: `flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary`
- Icon: `Share2 h-4 w-4`
- Title: `text-sm font-bold truncate`
- Slug: `text-[11px] text-muted-foreground`
- Chevron: `ChevronRight h-4 w-4 text-muted-foreground`

#### Empty State
- Container: `rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center`
- Text: `text-sm text-muted-foreground`
- CTA: `mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground`

#### Loading State
- Container: `flex min-h-screen items-center justify-center bg-background`
- Spinner: `Loader2 h-5 w-5 animate-spin text-primary`

### States
- **Loading:** Spinner, auto-redirect if 1 invitation
- **Single invitation:** Auto-redirect to share page
- **Multiple invitations:** List displayed
- **Empty:** Empty state with CTA

### Dark Mode
- Background: pure black
- Cards: dark surface

---

## 19. Components: KelolaUndangan

### Layout
```
section.mt-7.px-5
├── div.header (flex items-end justify-between)
│   ├── h3.title
│   └── Link "Semua"
├── div.tabs (conditional, horizontal scroll)
│   └── Buttons
└── div.grid (grid-cols-4 gap-3)
    └── 4x QuickLink
```

### Elements

#### Section Title
- Font: `text-base font-semibold`
- Margin bottom: `mb-3`

#### View All Link
- Font: `text-xs text-muted-foreground`

#### Tab Pills (Multi-invitation)
- Container: `mb-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1`
- Pill: `shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition`
- Active: `border-primary bg-primary text-primary-foreground`
- Inactive: `border-border bg-card text-muted-foreground`

#### Quick Link
- Container: `flex flex-col items-center gap-2`
- Icon box: `flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card`
- Icon: varies
- Label: `text-[11px] font-medium text-muted-foreground`

### States
- **Single invitation:** No tabs
- **Multiple invitations:** Tab pills visible
- **Active tab:** Primary style

### Dark Mode
- Cards: dark surface
- Active tab: inverted

---

## 20. Components: CommandPalette

### Layout
```
CommandDialog (shadcn/ui)
├── CommandInput (placeholder)
├── CommandList
│   ├── CommandEmpty
│   ├── CommandGroup "Navigasi"
│   ├── CommandSeparator
│   ├── CommandGroup "Akun"
│   ├── CommandSeparator
│   └── CommandGroup "Tindakan"
└── CommandItems
```

### Elements

#### CommandInput
- Placeholder: "Cari halaman atau fitur..."
- Styled by shadcn Command component

#### CommandGroup
- Heading: defined by shadcn, styled via CSS

#### CommandItem
- Icon: `h-4 w-4 mr-2`
- Text: varies per item
- Active state: handled by shadcn

#### Available Items
- Dashboard: `Home`
- Katalog Tema: `LayoutGrid`
- Buat Undangan Baru: `Plus`
- Bagikan Undangan: `Share2`
- Profil: `User`
- Paket Layanan: `Crown`
- Tagihan: `Receipt`
- Analytics: `BarChart3`
- Notifikasi: `Bell`
- Keamanan: `Shield`
- Bantuan: `HelpCircle`
- Ganti Tema: `Sun`/`Moon`
- Keluar: `LogOut`

### Trigger
- Keyboard: `Ctrl/Cmd + K`
- Event: `command-palette:open`

### Dark Mode
- Dialog: dark surface
- Handled by shadcn theming

---

## 21. Components: Countdown

### Layout
```
div.rounded-2xl.border.border-border.bg-card.p-4
├── p.title (conditional, text-xs text-muted-foreground)
└── div.grid (grid-cols-4 gap-2 text-center)
    └── 4x Unit boxes
```

### Elements

#### Title
- Font: `text-xs font-semibold text-muted-foreground`
- Margin bottom: `mb-3`
- Conditional: only rendered if `title` prop provided

#### Unit Box
- Container: `rounded-xl bg-secondary py-2.5`
- Value: `text-lg font-bold tabular-nums leading-none`
- Format: 2 digits, zero-padded (padStart 2)
- Label: `text-[10px] text-muted-foreground mt-1`

#### Units
- Hari: `day`
- Jam: `h`
- Menit: `m`
- Detik: `s`

### Behavior
- Updates every 1 second via `setInterval`
- Zero-padded display
- SSR-safe (initial zeros, client hydration)

### Dark Mode
- Card: dark surface
- Box: dark secondary

---

## 22. Components: SkeletonCard & SkeletonList

### SkeletonCard
```
div.flex.animate-pulse.items-center.gap-3.rounded-2xl.border.border-border.bg-card.p-3
├── div.avatar (h-10 w-10 rounded-xl bg-secondary)
├── div.content (flex-1 space-y-2)
│   ├── div.title (h-3 w-2/3 rounded bg-secondary)
│   └── div.subtitle (h-2.5 w-1/3 rounded bg-secondary)
└── div.badge (h-6 w-14 rounded-full bg-secondary)
```

### SkeletonList
```
div.space-y-3
└── N x SkeletonCard
```

### Animation
- `animate-pulse` from Tailwind
- Skeleton color: `bg-secondary`

### Dark Mode
- Card: dark surface
- Skeleton: dark secondary

---

## 23. Global Pattern: Bottom Navigation

### Structure
```
nav.fixed.inset-x-0.bottom-0.z-40
└── div.mx-auto.max-w-md.px-5.pb-5
    └── div.flex.items-center.justify-around.rounded-full.border.border-border.bg-card/95.p-2.shadow-lg.backdrop-blur
        ├── NavItem (home, active)
        ├── NavItem (catalog)
        ├── NavItem (create, primary)
        ├── NavItem (share)
        └── NavItem (profile)
```

### NavItem
- Container: `h-12 w-12 rounded-full`
- Active: `bg-secondary text-foreground`
- Inactive: `text-muted-foreground`
- Icon: `h-5 w-5`

### FAB Center Button
- Container: `bg-primary text-primary-foreground`
- Icon: `Plus h-5 w-5`

### Dark Mode
- Background: pure black
- Card: dark with blur
- Active: dark secondary

---

## 24. Global Pattern: Error States

### 404 Page
```
div.flex.min-h-screen.items-center.justify-center.bg-background.px-4
└── div.max-w-md.text-center
    ├── h1 (text-7xl font-bold)
    ├── h2 (text-xl font-semibold)
    ├── p (text-sm text-muted-foreground)
    └── Link button
```

### Error Page
```
div.flex.min-h-screen.items-center.justify-center.bg-background.px-4
└── div.max-w-md.text-center
    ├── h1 (text-xl font-semibold)
    ├── p (text-sm text-muted-foreground)
    └── div.mt-6 flex flex-wrap justify-center gap-2
        ├── Retry button (primary)
        └── Dashboard button (outline)
```

### Toast Notifications
- Position: top-center
- Rich colors enabled
- Close button visible
- Auto-dismiss

---

## 25. Responsive Behavior

### Breakpoints
- Mobile-first approach
- Max container width: `max-w-md` (448px)
- All pages centered in this container

### Safe Areas
- Bottom padding accounts for mobile navigation bar
- `pb-28` on pages with bottom nav
- `pb-32` on pages with tall bottom CTAs

### Touch Targets
- Minimum tap target: 44x44px
- Icon buttons: `h-11 w-11` or `h-10 w-10`
- List items: adequate padding for touch

### iOS Considerations
- `backdrop-blur` for overlays
- Safe area insets via CSS
- No hover states relying on hover only

---

## 26. Icon Reference (Lucide React)

| Icon | Usage |
|------|-------|
| `Menu` | Hamburger menu |
| `X` | Close, remove |
| `Plus` | Add, create |
| `Eye` | Views, preview |
| `Users` | Guests, RSVPs |
| `MessageCircle` | Wishes, messages |
| `Share2` | Share invitation |
| `Settings` | Settings section |
| `Image` | Photo, gallery |
| `Music` | Music section |
| `Clock` | Time, timestamps |
| `ChevronRight` | Navigation arrow |
| `Home` | Dashboard nav |
| `LayoutGrid` | Catalog nav |
| `BarChart3` | Analytics |
| `User` | Profile nav |
| `Sparkles` | AI, premium badge |
| `Sun` | Light mode |
| `Receipt` | Bills, invoices |
| `Package` | Packages |
| `UserPlus` | Affiliate |
| `Globe` | Domain |
| `Ticket` | Quota |
| `Calendar` | Events |
| `Heart` | Couple, love |
| `BookHeart` | Love story |
| `Quote` | Quotes |
| `Palette` | Theme |
| `Gift` | Gift, envelope |
| `Camera` | Photo upload |
| `Images` | Gallery |
| `Video` | Live stream |
| `CalendarPlus` | Google Calendar |
| `Cloud` | Cloud sync |
| `Wallet` | Digital envelope |
| `Search` | Search |
| `Bell` | Notifications |
| `Trash2` | Delete |
| `Loader2` | Loading spinner |
| `ArrowLeft` | Back navigation |
| `ArrowRight` | Forward |
| `Mail` | Email |
| `Lock` | Password |
| `Eye` / `EyeOff` | Show/hide password |
| `Phone` | Phone number |
| `ShieldCheck` | Verify |
| `Check` | Confirm |
| `Copy` | Copy to clipboard |
| `Link2` | Link URL |
| `Download` | Export |
| `Upload` | Import |
| `Send` | Send broadcast |
| `Inbox` | Empty state |
| `MoreHorizontal` | More options |
| `Pencil` | Edit |
| `Wifi` / `WifiOff` | Device status |
| `QrCode` | QR code |
| `RefreshCw` | Refresh |
| `Pause` / `Play` | Broadcast control |
| `CheckCircle2` / `XCircle` | Status indicators |
| `Crown` | Premium package |
| `BellOff` | No notifications |
| `CheckCheck` | Mark all read |
| `Info` | Info notification |
| `Megaphone` | Admin notification |
| `AlertTriangle` | Warning |
| `Shield` | Security |
| `HelpCircle` | Help |
| `LogOut` | Logout |
| `Moon` | Dark mode |
| `CheckCircle2` | AI success |
| `FileText` | Text mode |
| `Tag` | Voucher |
| `ShoppingCart` | Checkout |
| `TrendingUp` | Analytics trend |

---

## 27. Form Validation Patterns

### Input States
- **Default:** `border-border`
- **Focus:** `border-primary` (ring via ring token)
- **Error:** `border-red-400`
- **Disabled:** `opacity-50`, pointer-events-none

### Button States
- **Default:** `bg-primary text-primary-foreground`
- **Hover:** `hover:opacity-90`
- **Active:** press feedback via opacity
- **Disabled:** `disabled:opacity-50 disabled:cursor-not-allowed`
- **Loading:** Spinner icon + disabled

### Loading Indicators
- Spinner: `Loader2` with `animate-spin`
- Pulse: `animate-pulse` for skeletons
- Progress bars: `transition-all` width changes

---

Dokumen ini mencakup SEMUA elemen UI pada aplikasi m.undangyah.id dengan spesifikasi exact yang diperlukan untuk handoff ke designer dan developer.
