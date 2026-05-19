# Plan: Migrasi SEO dari undangyah.com → undangyah.id

## Goal
Memindahkan semua SEO value (ranking, backlinks, authority) dari undangyah.com ke undangyah.id, lalu setup 301 redirect permanent agar traffic dan link juice mengalir ke domain baru.

## Current Context
- **undangyah.com**: shared hosting, WordPress, hanya landing page, ada plugin SEO (Yoast/RankMath), akses SSH + cPanel
- **undangyah.id**: VPS (full control), Vite static site, sudah punya artikel SEO, sitemap, pre-rendered HTML
- Tujuan: undangyah.com → 301 redirect ke undangyah.id (permanent)
- Konten di .com hanya landing page (tidak ada artikel/blog yang perlu dimigrasikan)

## Proposed Approach

**Strategi: Plugin Remote Control + 301 Redirect**

Karena konten di .com hanya landing page (tidak perlu migrasi konten), fokus utama:
1. Buat plugin WP di .com yang bisa di-remote dari VPS untuk setup/manage
2. Setup 301 redirect semua URL .com → .id
3. Update Google Search Console (pindahkan domain)
4. Monitor traffic shift

### Kenapa Plugin Remote Control?
- Bisa manage .com dari VPS tanpa harus login wp-admin manual
- Bisa update redirect rules, cek status, disable plugin nanti
- Berguna jika perlu troubleshoot tanpa buka browser

## Step-by-Step Plan

### Phase 1: Plugin Remote Control (di undangyah.com)

**1.1 Buat plugin `weddingsaas-remote`**
- REST API endpoint dengan auth (secret key)
- Capabilities:
  - `GET /status` — cek plugin aktif, WP version, plugin list
  - `POST /redirect` — setup/update redirect rules
  - `GET /seo-data` — export SEO meta (title, description, OG) dari semua pages
  - `POST /settings` — update WP settings (site title, tagline, dll)
  - `POST /htaccess` — write .htaccess rules (301 redirect)
  - `GET /health` — health check

**1.2 Security**
- Auth via `X-Remote-Key` header (random 64-char token)
- Rate limiting (max 10 req/min)
- IP whitelist (VPS IP only)
- Log semua request

**1.3 Deploy**
- Upload plugin via SSH/SCP ke .com
- Activate via WP-CLI (SSH)

### Phase 2: Export SEO Data

**2.1 Dari plugin, export:**
- Current meta titles & descriptions
- OG tags
- Sitemap URLs yang sudah di-index Google
- Existing backlinks (via Search Console API atau manual check)

**2.2 Pastikan undangyah.id sudah cover semua URL yang ada di .com:**
- Homepage → undangyah.id ✅
- /wp-sitemap.xml → undangyah.id/sitemap.xml ✅

### Phase 3: Setup 301 Redirect

**3.1 Via plugin remote, write .htaccess:**
```apache
# 301 Redirect semua traffic ke undangyah.id
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?undangyah\.com$ [NC]
RewriteRule ^(.*)$ https://undangyah.id/$1 [R=301,L]
```

**3.2 Redirect mapping:**
| From (undangyah.com) | To (undangyah.id) |
|---|---|
| / | / |
| /wp-sitemap.xml | /sitemap.xml |
| /* (catch-all) | / |

### Phase 4: Google Search Console

**4.1 Setup:**
- Tambahkan undangyah.id di Search Console (jika belum)
- Gunakan fitur "Change of Address" di Search Console
- Submit sitemap baru (undangyah.id/sitemap.xml)

**4.2 Monitoring:**
- Pantau indexing status
- Pastikan halaman .com di-deindex dan .id di-index
- Cek coverage errors

### Phase 5: Cleanup (setelah 3-6 bulan)

- Pastikan semua ranking sudah transfer
- Plugin remote bisa di-deactivate (tapi .htaccess redirect tetap aktif)
- Pertimbangkan apakah hosting .com masih perlu diperpanjang

## Files to Create

```
/www/wwwroot/app.undangyah.id/wp-content/plugins/weddingsaas-remote/
├── weddingsaas-remote.php          # Main plugin file
├── includes/
│   ├── class-remote-api.php        # REST API endpoints
│   ├── class-remote-auth.php       # Authentication & security
│   ├── class-redirect-manager.php  # .htaccess redirect management
│   └── class-seo-exporter.php      # Export SEO data
└── readme.txt
```

Note: Plugin dibuat di VPS (app.undangyah.id) lalu di-SCP ke hosting .com.

## Validation / Testing

1. ✅ Plugin active — `curl -H "X-Remote-Key: xxx" https://undangyah.com/wp-json/weddingsaas-remote/v1/status`
2. ✅ SEO export — verify data lengkap
3. ✅ Redirect works — `curl -I https://undangyah.com` → 301 → undangyah.id
4. ✅ All paths redirect — `curl -I https://undangyah.com/random-page` → 301
5. ✅ Google Search Console — Change of Address submitted
6. ✅ Sitemap submitted dan di-crawl

## Risks & Tradeoffs

| Risk | Mitigation |
|---|---|
| SEO drop sementara (1-4 minggu) | Normal, Google butuh waktu re-index. 301 redirect mempercepat transfer. |
| Plugin security breach | Auth key + IP whitelist + rate limit |
| Shared hosting block REST API | Fallback: setup redirect langsung via SSH + .htaccess tanpa plugin |
| Hosting expire sebelum transfer selesai | Perpanjang minimal 6 bulan setelah redirect aktif |

## Open Questions

1. Berapa lama hosting .com masih aktif? (perlu minimal 3-6 bulan setelah redirect)
2. Apakah ada backlink external yang mengarah ke undangyah.com? (perlu di-track)
3. Apakah Google Search Console sudah di-setup untuk undangyah.com?
4. IP VPS berapa? (untuk whitelist di plugin)

## Timeline Estimate

- Phase 1 (Plugin): ~1 jam
- Phase 2 (Export): ~15 menit
- Phase 3 (Redirect): ~15 menit
- Phase 4 (Search Console): manual oleh user
- Phase 5 (Cleanup): 3-6 bulan kemudian

Total implementasi teknis: **~1.5 jam**
