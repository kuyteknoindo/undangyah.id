# Dynamic Landing Page undangyah.id — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Ubah landing page undangyah.id dari static HTML menjadi fully dynamic — semua section (Hero, Fitur, Pricing, Katalog, FAQ, Footer, Artikel) dikelola dari admin panel hi.undangyah.id.

**Architecture:**
- Backend: WordPress plugin `weddingsaas` → REST API endpoints per section
- Admin Panel: React (hi.undangyah.id) → CRUD UI per section
- Frontend: undangyah.id → Vite static site yang fetch API saat build (SSG) + client-side hydration untuk interaktif

**Tech Stack:** WordPress REST API, React 19, TypeScript, Vite (vanilla-ts), TailwindCSS-like inline styles

---

## Status Quo — API yang Sudah Ada

| Section | API Endpoint | Status |
|---------|-------------|--------|
| Promo Banner | `GET /landing/promo` | ✅ Ready |
| Pricing | `GET /landing/pricing` | ✅ Ready |
| Pricing Features | `GET /landing/pricing-features` | ✅ Ready |
| Katalog Tema | `GET /landing/catalog` | ✅ Ready |
| Artikel List | `GET /landing/articles?per_page=5&page=1` | ✅ Ready |
| Artikel Single | `GET /landing/articles/{slug}` | ✅ Ready |
| Hero Section | — | ❌ Perlu dibuat |
| Fitur Grid | — | ❌ Perlu dibuat |
| FAQ | — | ❌ Perlu dibuat |
| Footer | — | ❌ Perlu dibuat |

## Status Quo — Admin Panel yang Sudah Ada

| Menu | Path | Status |
|------|------|--------|
| Promo Banner | `/dashboard/admin/landing-promo` | ✅ CRUD |
| Pricing Features | `/dashboard/admin/landing-pricing-features` | ✅ Edit |
| Posts (Artikel) | `/dashboard/admin/posts` | ✅ CRUD |
| Post Editor | `/dashboard/admin/posts/:id/edit` | ✅ Rich text editor |

---

## Phase 1: Backend — Tambah API untuk Section yang Belum Ada

### Task 1.1: Buat tabel `wds_landing_sections`

**Objective:** Tabel generik untuk menyimpan konten section landing page (Hero, Fitur, FAQ, Footer)

**Files:**
- Modify: `/www/wwwroot/app.undangyah.id/wp-content/plugins/weddingsaas/includes/api/class-rest-landing.php`
- Modify: `/www/wwwroot/app.undangyah.id/wp-content/plugins/weddingsaas/includes/class-activator.php`

**Schema:**
```sql
CREATE TABLE {prefix}wds_landing_sections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(50) NOT NULL,       -- 'hero', 'fitur', 'faq', 'footer'
  item_order INT DEFAULT 0,
  title VARCHAR(255) DEFAULT '',
  subtitle VARCHAR(500) DEFAULT '',
  content TEXT DEFAULT '',
  icon VARCHAR(100) DEFAULT '',           -- SVG name atau emoji
  image_url VARCHAR(500) DEFAULT '',
  cta_text VARCHAR(100) DEFAULT '',
  cta_link VARCHAR(500) DEFAULT '',
  extra_data JSON DEFAULT NULL,           -- flexible field
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY section_order (section_key, item_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Task 1.2: Tambah REST API endpoints untuk sections

**Objective:** CRUD endpoints untuk Hero, Fitur, FAQ, Footer

**Endpoints baru:**
```
GET    /weddingsaas/v1/landing/sections/{key}         → Public, get active items
GET    /weddingsaas/v1/admin/landing-sections/{key}   → Admin, get all items
POST   /weddingsaas/v1/admin/landing-sections/{key}   → Admin, create item
PUT    /weddingsaas/v1/admin/landing-sections/{key}/{id} → Admin, update item
DELETE /weddingsaas/v1/admin/landing-sections/{key}/{id} → Admin, delete item
POST   /weddingsaas/v1/admin/landing-sections/{key}/reorder → Admin, reorder items
```

**Section keys:**
- `hero` — 1 item (headline, subtitle, CTA primary, CTA secondary, image)
- `fitur` — N items (icon, title, description)
- `faq` — N items (title=question, content=answer)
- `footer` — N items (title=group label, content=links JSON)

### Task 1.3: Seed data default

**Objective:** Insert data awal dari konten static yang sudah ada

---

## Phase 2: Admin Panel — CRUD UI per Section

### Task 2.1: Halaman Admin "Website" → Landing Sections

**Objective:** Buat halaman admin untuk edit Hero, Fitur, FAQ, Footer

**Files:**
- Create: `/www/wwwroot/hi.undangyah.id/src/pages/admin/LandingSections.tsx`
- Create: `/www/wwwroot/hi.undangyah.id/src/pages/admin/LandingSectionEditor.tsx`
- Create: `/www/wwwroot/hi.undangyah.id/src/api/admin-landing-sections.ts`
- Modify: `/www/wwwroot/hi.undangyah.id/src/App.tsx` (tambah routes)

**UI per section:**

| Section | UI Type |
|---------|---------|
| Hero | Single form: headline, subtitle, 2x CTA (text+link), background image |
| Fitur | Sortable list: icon picker, title, description. Max 6 items |
| FAQ | Sortable list: question + answer (rich text). Unlimited |
| Footer | Group editor: group label + list of links (text + URL) |

### Task 2.2: Integrasi ke sidebar menu admin

**Objective:** Tambah sub-menu di bawah "Website":
- Landing Hero
- Landing Fitur
- Landing FAQ
- Landing Footer
- (existing) Promo Banner
- (existing) Pricing Features

### Task 2.3: Admin Artikel — Tambah field `category/badge`

**Objective:** Tambah taxonomy/meta `badge` ke `dashboard_post` agar artikel punya badge kategori (Budget, Tradisi, Undangan Digital, dll)

**Files:**
- Modify: `/www/wwwroot/app.undangyah.id/wp-content/plugins/weddingsaas/includes/api/class-rest-landing.php` (return badge di response)
- Modify: `/www/wwwroot/hi.undangyah.id/src/pages/admin/PostEditor.tsx` (tambah field badge)

---

## Phase 3: Frontend undangyah.id — Dynamic Rendering

### Task 3.1: Refactor Vite project → fetch API saat build (SSG)

**Objective:** `npm run build` akan fetch semua data dari API dan generate static HTML

**Files:**
- Modify: `/www/wwwroot/undangyah.id/vite.config.js`
- Create: `/www/wwwroot/undangyah.id/src/build-landing.js` (SSG script)
- Modify: `/www/wwwroot/undangyah.id/package.json` (build script)

**Flow:**
```
npm run build
  → node src/build-landing.js
    → fetch /landing/promo
    → fetch /landing/pricing
    → fetch /landing/pricing-features
    → fetch /landing/catalog
    → fetch /landing/sections/hero
    → fetch /landing/sections/fitur
    → fetch /landing/sections/faq
    → fetch /landing/sections/footer
    → generate index.html (SEO-friendly static)
  → vite build (CSS/JS assets)
```

### Task 3.2: Refactor halaman artikel → dynamic

**Objective:** `/artikel/index.html` di-generate dari API

**Files:**
- Modify: `/www/wwwroot/undangyah.id/prerender-articles.cjs`

**Flow:**
```
node prerender-articles.cjs
  → fetch /landing/articles?per_page=100
  → generate /artikel/index.html (with pagination JS)
  → generate /artikel/{slug}/index.html per artikel
```

### Task 3.3: Auto-rebuild via webhook

**Objective:** Setiap kali admin save perubahan di panel, trigger rebuild landing page

**Options:**
1. Cron setiap 5 menit cek last_modified
2. Webhook dari WP plugin → hit rebuild endpoint
3. Admin panel punya tombol "Publish Landing Page"

**Recommended:** Option 3 — tombol manual di admin panel yang trigger `POST /admin/landing-rebuild` → server-side `npm run build`

---

## Phase 4: Artikel CRUD (sudah ada, perlu enhancement)

### Task 4.1: Artikel sudah bisa dibuat/edit/hapus dari admin

**Status:** ✅ Sudah ada di `/dashboard/admin/posts`

**Enhancement yang perlu:**
- [ ] Tambah field `badge` (kategori artikel)
- [ ] Tambah field `is_featured` (untuk hero section artikel)
- [ ] Preview link ke undangyah.id/artikel/{slug}
- [ ] Auto-regenerate static HTML setelah publish/update/delete

### Task 4.2: Artikel thumbnail auto-generate

**Objective:** Saat artikel di-publish, auto-generate thumbnail via API (sudah ada `article-thumbnail.php`)

---

## Prioritas Implementasi

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| 🔴 P0 | 3.2 Artikel dynamic | 2-3 jam | Artikel sudah ada API, tinggal fetch |
| 🟡 P1 | 1.1-1.3 Backend sections | 3-4 jam | Foundation untuk semua section |
| 🟡 P1 | 2.1-2.2 Admin UI sections | 4-5 jam | CRUD untuk Hero/Fitur/FAQ/Footer |
| 🟢 P2 | 3.1 SSG landing page | 3-4 jam | Full dynamic landing |
| 🟢 P2 | 3.3 Auto-rebuild | 1-2 jam | Automation |
| 🟢 P3 | 4.1-4.2 Artikel enhancement | 2 jam | Polish |

**Total estimasi: 15-20 jam kerja**

---

## Quick Win (bisa langsung sekarang)

Karena API `/landing/articles`, `/landing/pricing`, `/landing/catalog` sudah ready, halaman `/artikel/index.html` bisa langsung di-refactor untuk fetch dari API instead of hardcoded HTML. Ini bisa dikerjakan tanpa perubahan backend.
