# Redesain Mobile hi.undangyah.id — iOS Elegant Style

## Goal

Redesain total tampilan mobile dashboard hi.undangyah.id dari Samsung One UI style ke **iOS Elegant** style. Fokus pada kesederhanaan, kejelasan, konsistensi, dan keeleganan. Navigasi bawah menggunakan pill hitam dengan rounded ke atas (bukan ke bawah).

---

## Design System — "Undangyah iOS Elegant"

### Filosofi
- **Clean & Minimal** — setiap elemen punya tujuan, tidak ada dekorasi berlebihan
- **Flat colors only** — TIDAK ADA gradasi warna di manapun
- **Generous whitespace** — ruang napas antar elemen
- **Strong typography hierarchy** — ukuran dan weight yang jelas membedakan level informasi
- **Consistent radius** — semua elemen menggunakan radius yang seragam
- **Mobile-first** — desain dimulai dari 320px, scale up ke 480px max

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-page` | `#F8F8FA` | `#0F0F0F` | Background halaman |
| `--bg-card` | `#FFFFFF` | `#1A1A1A` | Card/surface |
| `--bg-card-elevated` | `#FFFFFF` | `#222222` | Card yang lebih menonjol |
| `--bg-input` | `#F2F2F7` | `#2A2A2A` | Input field background |
| `--accent` | `#000000` | `#FFFFFF` | Primary action (tombol utama) |
| `--accent-text` | `#FFFFFF` | `#000000` | Text di atas accent |
| `--accent-soft` | `#F2F2F7` | `#2A2A2A` | Secondary action background |
| `--text-primary` | `#000000` | `#FFFFFF` | Heading, judul utama |
| `--text-secondary` | `#3C3C43` | `#EBEBF5` | Body text |
| `--text-tertiary` | `#8E8E93` | `#636366` | Label, caption, muted |
| `--border` | `#E5E5EA` | `#2C2C2E` | Border card, separator |
| `--success` | `#34C759` | `#30D158` | Status berhasil |
| `--warning` | `#FF9500` | `#FFD60A` | Status warning |
| `--danger` | `#FF3B30` | `#FF453A` | Status error/danger |
| `--nav-bg` | `#000000` | `#1A1A1A` | Bottom nav background |
| `--nav-active` | `#FFFFFF` | `#FFFFFF` | Nav icon active |
| `--nav-inactive` | `#636366` | `#636366` | Nav icon inactive |

### Typography

**Font:** Inter (sudah ada di project)
- Hapus Plus Jakarta Sans dari heading — gunakan Inter untuk semua
- Konsistensi satu font family

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 32px | 700 | 1.1 | Angka besar (saldo, quota) |
| H1 | 26px | 700 | 1.2 | Judul halaman |
| H2 | 20px | 600 | 1.3 | Section title |
| H3 | 17px | 600 | 1.4 | Card title |
| Body | 15px | 400 | 1.5 | Teks utama |
| Body Small | 13px | 400 | 1.4 | Secondary info |
| Caption | 11px | 500 | 1.3 | Label, badge, timestamp |

### Spacing (8px grid)

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| Page padding | 20px horizontal |
| Card padding | 20px |
| Card gap | 12px |

### Border Radius

| Element | Radius |
|---------|--------|
| Card | 20px |
| Button (large) | 14px |
| Button (small/pill) | 999px |
| Input | 12px |
| Badge | 999px |
| Bottom Nav | 24px 24px 0 0 (rounded ATAS, flat bawah) |
| Avatar | 50% |
| Thumbnail | 12px |

### Shadows (subtle, iOS-like)

| Token | Value |
|-------|-------|
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.04)` |
| `--shadow-elevated` | `0 4px 16px rgba(0,0,0,0.08)` |
| `--shadow-nav` | `0 -4px 20px rgba(0,0,0,0.08)` |

### Button Styles

| Type | Background | Text | Border |
|------|-----------|------|--------|
| Primary | `--accent` (hitam) | `--accent-text` (putih) | none |
| Secondary | `--accent-soft` (abu muda) | `--text-primary` | none |
| Outline | transparent | `--text-primary` | 1px `--border` |
| Danger | `--danger` | white | none |
| Ghost | transparent | `--accent` | none |

Semua button: `min-height: 50px`, `font-weight: 600`, `font-size: 15px`

### Bottom Navigation — PILL HITAM ROUNDED ATAS

```
┌─────────────────────────────────────┐  ← rounded 24px atas
│  🏠    📋    🔗    👤              │  ← icon 22px, active = putih
│  Home  Edit  Share Profile          │  ← label 10px, uppercase
└─────────────────────────────────────┘  ← FLAT bawah (menempel ke edge)
```

- Background: hitam solid (`#000000` light / `#1A1A1A` dark)
- Position: fixed bottom, full width
- Border-radius: `24px 24px 0 0` (rounded ATAS, flat BAWAH)
- Height: 72px + safe-area-inset-bottom
- Icon: 22px, stroke style (Lucide icons)
- Active: icon putih + label putih
- Inactive: icon `#636366` + label `#636366`
- Shadow: `0 -4px 20px rgba(0,0,0,0.08)` (hanya di light mode)
- 4 items: Home, Edit, Share, Profile

---

## Halaman yang Diredesain

### 1. LOGIN (`/login`)

**Layout:**
- Full screen, centered vertically
- Logo Undangyah di atas (height 28px)
- Heading: "Masuk ke akun Anda" (H1, 26px, bold)
- Subtitle: "Kelola undangan digital Anda" (Body, tertiary color)

**Form:**
- Input email: bg `--bg-input`, radius 12px, height 50px, padding 16px
- Input password: sama, dengan toggle visibility icon
- "Lupa password?" link di kanan bawah password
- Button "Masuk" — full width, hitam, radius 14px, height 50px
- Divider "atau"
- Button Google — full width, outline style, icon Google di kiri
- Footer: "Belum punya akun? Daftar" link

**Tidak ada:**
- Gradasi
- Ilustrasi besar
- Background pattern

---

### 2. DASHBOARD HOME (`/dashboard`)

**Header:**
- Sticky top, blur backdrop
- Kiri: "Halo, [Nama]" (H2) + "Selamat datang" (caption, tertiary)
- Kanan: Avatar 40px (rounded full)

**Quota Card (WAJIB ADA):**
- Card putih, radius 20px, padding 20px
- Judul: "Kuota Undangan" (H3)
- Display besar: "3/5" (Display size, 32px bold) — undangan terpakai/total
- Progress bar: height 6px, radius 999px, bg `--bg-input`, fill `--accent`
- Info row: "Paket Basic • Aktif sampai 20 Jun 2026" (caption)
- Button: "Upgrade Paket" — secondary style, full width

**Quick Actions (2 kolom grid):**
- "Buat Undangan" — card dengan icon + label
- "Lihat Template" — card dengan icon + label
- Masing-masing: bg `--bg-card`, radius 20px, padding 16px, icon 24px di atas, label 13px di bawah

**Undangan Saya:**
- Section title: "Undangan Saya" (H2) + "Lihat Semua" link di kanan
- Card per undangan:
  - Thumbnail tema (aspect 16:9, radius 12px)
  - Judul undangan (H3, 17px semibold)
  - Status badge: pill, font 11px
  - Row: tanggal acara + jumlah tamu RSVP
  - 3-dot menu (44px touch target)

**RSVP Activity (ringkasan):**
- Card: "Aktivitas RSVP"
- Angka besar: total tamu confirmed
- Mini list: 3 tamu terbaru (avatar + nama + waktu)

---

### 3. EDIT UNDANGAN (`/dashboard/edit/:id`)

**Welcome Screen (section picker):**
- Header sticky: Back button (44px) + Judul undangan (ellipsis) + Menu (44px)
- Grid 3 kolom: icon section (40px circle bg `--bg-input`) + label 11px
- Sections: Setting, Mempelai, Acara, Love Story, Galeri, Musik, Quotes, Kado, Livestream, GCalendar

**Section Editor (setelah pilih section):**
- Header: Back + Section title + Save indicator
- Form fields stacked vertikal
- Input: height 50px, bg `--bg-input`, radius 12px, padding 16px
- Textarea: min-height 120px, same style
- Label: 13px, semibold, `--text-tertiary`, margin-bottom 6px
- Field gap: 16px
- Image upload: dashed border card, 120px height, icon + "Upload Foto"

**Save FAB:**
- Fixed bottom-right
- Hitam, radius 14px, padding 14px 24px
- Text: "Simpan" + checkmark icon
- Shadow: `--shadow-elevated`
- Bottom offset: 88px + safe-area (di atas nav)

**Section Details:**

| Section | Fields |
|---------|--------|
| Setting | Judul, slug, tanggal, waktu, timezone |
| Mempelai | Nama pria, nama wanita, foto pria, foto wanita, nama ayah/ibu, urutan |
| Acara | Nama acara, tanggal, waktu mulai, waktu selesai, tempat, alamat, maps link |
| Love Story | Timeline items (tanggal + judul + deskripsi), sortable |
| Galeri | Grid foto (3 kolom), upload multiple, drag reorder |
| Musik | Search + list musik, play preview (44px button), select |
| Quotes | Textarea ayat/quotes, sumber |
| Kado | Toggle aktif, rekening (bank + no rek + nama), e-wallet |
| Livestream | Toggle aktif, platform, URL |
| GCalendar | Auto-generate dari data acara, preview link |

---

### 4. RSVP (`/dashboard/rsvp`)

**Header:**
- "RSVP" (H1) + filter icon button

**Summary Cards (horizontal scroll):**
- 3 cards: Total Tamu | Hadir | Tidak Hadir
- Masing-masing: angka besar (Display) + label (caption) + warna indicator

**Guest List:**
- Search input (height 44px, icon search, radius 12px)
- Filter chips: Semua | Hadir | Tidak Hadir | Pending (horizontal scroll)
- Card per tamu:
  - Avatar initial (40px, bg `--bg-input`)
  - Nama (H3) + jumlah tamu (badge)
  - Status pill (hijau/merah/abu)
  - Ucapan (body small, max 2 line, ellipsis)
  - Timestamp (caption)

**Empty state:**
- Ilustrasi simple (SVG line art)
- "Belum ada tamu" (H2)
- "Bagikan undangan untuk mulai menerima RSVP" (body, tertiary)
- Button "Bagikan Undangan" (primary)

---

### 5. SHARE (`/dashboard/sebar`)

**Header:**
- "Bagikan Undangan" (H1)

**Preview Card:**
- Thumbnail undangan (aspect 16:9, radius 12px)
- Link undangan (monospace, bg `--bg-input`, radius 12px, padding 12px)
- Button "Salin Link" (secondary, icon copy)

**Share Methods:**
- Card list, masing-masing:
  - Icon platform (WhatsApp hijau, Telegram biru, dll) — 40px
  - Nama platform (H3)
  - Deskripsi singkat (caption)
  - Chevron right
  - Min-height 64px per item

**Blast WhatsApp:**
- Card: "Kirim ke Banyak Tamu"
- Input: pilih/upload daftar tamu
- Template pesan (textarea, editable)
- Button "Kirim Blast" (primary)
- Quota indicator: "Sisa kuota: 45/50 pesan"

---

### 6. CHECKOUT (`/checkout/:slug`)

**Layout:** Standalone (no bottom nav)

**Header:**
- Back button + "Checkout" (H2) + logo kecil

**Product Card:**
- Nama paket (H2)
- Harga (Display, 32px bold)
- Durasi + fitur ringkas (body small)
- Badge "POPULER" jika premium

**Addons (optional):**
- Toggle cards: icon + nama + harga + switch

**Form Section:**
- Jika belum login: input nomor WA + OTP verification
- Jika sudah login: info user (readonly card)

**Payment Methods:**
- Radio card list:
  - Logo payment (height 24px)
  - Nama method
  - Radio indicator kanan
  - Active: border `--accent`

**Voucher:**
- Input + button "Terapkan" inline
- Success state: badge hijau + nominal diskon

**Summary (sticky bottom):**
- Card: subtotal, diskon, total
- Button "Bayar Rp[total]" — full width, hitam, height 54px
- Safe area padding bottom

---

## File yang Akan Berubah

### CSS (rewrite/major changes)
- `src/styles/mobile-pages.css` — rewrite dengan design system baru
- `src/styles/dashboard-mobile.css` — rewrite dashboard home mobile
- `src/styles/edit-page.css` — update mobile section (lines 1-400)
- `src/styles/sidebar-layout.css` — bottom nav redesign
- `src/styles/auth-pages.css` — login page mobile
- `src/styles/checkout-pages.css` — checkout mobile section
- `src/styles/sebar.css` — share page mobile
- `src/index.css` — update `:root` tokens

### Components (modify mobile branch)
- `src/pages/Login.tsx` — mobile layout
- `src/components/dashboard/DashboardMobileView.tsx` — full redesign
- `src/pages/Edit.tsx` — mobile section (welcome + editor)
- `src/pages/Profile.tsx` — mobile branch
- `src/pages/Checkout.tsx` — mobile form
- `src/layout/components/MobileBottomNav.tsx` — pill hitam rounded atas

### New Files (possible)
- `src/styles/ios-design-system.css` — centralized token file
- `src/components/mobile/MobileNavBar.tsx` — new bottom nav component

---

## Execution Plan (Urutan Implementasi)

### Phase 1: Design System Foundation
1. Buat `ios-design-system.css` dengan semua token baru
2. Update `:root` di `index.css` — override token lama
3. Update font: hapus Plus Jakarta Sans dari heading, Inter only
4. Update bottom nav: pill hitam, rounded atas, flat bawah

### Phase 2: Login & Auth
5. Redesain login page mobile
6. Update PhoneVerification modal (sudah diperbaiki, sesuaikan token)

### Phase 3: Dashboard Home
7. Redesain DashboardMobileView — quota card, quick actions, undangan list
8. Update RSVP activity section

### Phase 4: Edit Undangan
9. Redesain welcome screen (section picker grid)
10. Update form fields styling (input, textarea, upload)
11. Update save FAB
12. Pastikan semua section editor konsisten

### Phase 5: RSVP & Share
13. Redesain RSVP page mobile (summary + guest list)
14. Redesain Share/Sebar page mobile

### Phase 6: Checkout
15. Redesain checkout mobile form
16. Payment method cards
17. Sticky summary bottom

### Phase 7: Polish & Dark Mode
18. Verify semua halaman di dark mode
19. Test di 320px, 375px, 414px, 480px
20. Accessibility check (touch targets, contrast)

---

## Validasi & Testing

- [ ] Build tanpa error (`npm run build`)
- [ ] Semua halaman accessible di 320px width
- [ ] Touch target minimum 44px di semua interactive element
- [ ] Dark mode konsisten di semua halaman
- [ ] Tidak ada gradasi warna di manapun
- [ ] Bottom nav konsisten di semua dashboard pages
- [ ] Font hanya Inter (no Plus Jakarta Sans di mobile)
- [ ] Spacing mengikuti 8px grid
- [ ] Border radius konsisten sesuai design system

---

## Risks & Tradeoffs

1. **Breaking desktop** — Semua perubahan harus di-scope ke mobile only (`@media max-width: 768px` atau `useIsMobileLayout` branch). Desktop TIDAK boleh berubah.
2. **Dark mode regression** — Setiap token baru harus punya dark variant.
3. **Admin pages** — TIDAK termasuk dalam redesain ini. Hanya user-facing pages.
4. **Performance** — Menambah CSS baru harus minimal. Prefer override token daripada duplicate rules.
5. **Backward compat** — Class name lama tetap ada, styling di-override via specificity atau new wrapper class.

---

## Open Questions

1. Bottom nav items — tetap 4 (Home, Edit, Share, Profile) atau mau ditambah/diubah?
2. Warna accent hitam — apakah berlaku juga untuk link text, atau link tetap biru?
3. Quota card — tampilkan juga sisa hari aktif paket?
4. RSVP — perlu export ke Excel/CSV dari mobile?
