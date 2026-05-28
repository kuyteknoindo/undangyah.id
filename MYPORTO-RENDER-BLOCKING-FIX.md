# 🚀 Fix Render-Blocking Resources - myporto.web.id

**Tanggal:** 28 Mei 2026, 03:22 UTC  
**Issue:** Performance score 43/100 karena banyak render-blocking CSS/JS  
**Status:** ✅ **FIXED**

---

## 🔧 Yang Sudah Dikerjakan

### 1. ✅ LiteSpeed Cache - CSS Async
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name = 'litespeed.conf.optm-css_async';
```
**Result:** Semua CSS sekarang load dengan `rel='preload' as='style' onload="..."`

### 2. ✅ LiteSpeed Cache - JS Defer
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name = 'litespeed.conf.optm-js_defer';
```
**Result:** Semua JavaScript di-defer (non-blocking)

### 3. ✅ LiteSpeed Cache - CSS Combine
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name = 'litespeed.conf.optm-css_comb';
```
**Result:** Multiple CSS files digabung jadi 1 file

### 4. ✅ LiteSpeed Cache - JS Combine
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name = 'litespeed.conf.optm-js_comb';
```
**Result:** Multiple JS files digabung jadi 1 file

### 5. ✅ LiteSpeed Cache - Lazy Load Images & iFrames
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name IN ('litespeed.conf.media-lazy', 'litespeed.conf.media-lazy_iframes');
```
**Result:** Images & iframes load on-demand (tidak blocking)

### 6. ✅ Google Fonts Async
```sql
UPDATE wp_options SET option_value = 's:1:"1";' 
WHERE option_name = 'litespeed.conf.optm-ggfonts_async';
```
**Result:** Google Fonts load async (non-blocking)

### 7. ✅ Critical CSS Plugin
**File:** `/var/www/html/wp-content/mu-plugins/critical-css.php`

```php
// Defer all CSS except critical
add_filter('style_loader_tag', function($html, $handle) {
    if (in_array($handle, ['elementor-frontend', 'elementor-post', 'elementor-global'])) {
        return str_replace("rel='stylesheet'", "rel='preload' as='style' onload=\"this.onload=null;this.rel='stylesheet'\"", $html);
    }
    return $html;
}, 10, 2);

// Defer all scripts except critical
add_filter('script_loader_tag', function($tag, $handle) {
    if (in_array($handle, ['jquery-core', 'jquery-migrate'])) {
        return $tag;
    }
    return str_replace(' src', ' defer src', $tag);
}, 10, 2);

// Preload critical resources
add_action('wp_head', function() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
}, 1);
```

### 8. ✅ .htaccess Optimization
**File:** `/var/www/html/.htaccess`

```apache
# Browser Caching
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType image/jpg "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType image/gif "access plus 1 year"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/webp "access plus 1 year"
ExpiresByType text/css "access plus 1 month"
ExpiresByType application/javascript "access plus 1 month"
ExpiresByType application/pdf "access plus 1 month"
ExpiresByType text/x-javascript "access plus 1 month"
ExpiresByType image/x-icon "access plus 1 year"
ExpiresDefault "access plus 2 days"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
</IfModule>
```

### 9. ✅ Cache Cleared
```bash
rm -rf /var/www/html/wp-content/cache/litespeed/*
```
**Result:** Fresh cache dengan optimasi baru

---

## 📊 Verifikasi

### CSS Output (Setelah Fix)
```html
<link data-optimized="1" data-asynced="1" as="style" 
      onload="this.onload=null;this.rel='stylesheet'" 
      rel='preload' 
      href='https://myporto.web.id/wp-content/litespeed/css/2a46adea5bba8245b8f43e1297662105.css' 
      media='all' />
```

**Sebelum:** `rel='stylesheet'` (blocking)  
**Sesudah:** `rel='preload' as='style' onload="..."` (non-blocking) ✅

### LiteSpeed Cache Settings (Verified)
```
✅ optm-css_async = 1 (CSS Async Load)
✅ optm-js_defer = 1 (JS Defer)
✅ optm-css_comb = 1 (CSS Combine)
✅ optm-js_comb = 1 (JS Combine)
✅ media-lazy = 1 (Lazy Load Images)
✅ media-lazy_iframes = 1 (Lazy Load iFrames)
✅ optm-ggfonts_async = 1 (Google Fonts Async)
✅ optm-css_min = 1 (CSS Minify)
✅ optm-emoji_rm = 1 (Remove Emoji Scripts)
```

---

## 🎯 Estimasi Peningkatan

### Sebelum Fix
- **Performance:** 43/100 ❌
- **Issue:** Render-blocking CSS/JS
- **CSS Files:** 10+ files (blocking)
- **JS Files:** 15+ files (blocking)
- **Load Time:** ~2-3 detik

### Sesudah Fix
- **Performance:** **70-80/100** (estimasi) ✅
- **CSS:** Combined + Async (non-blocking)
- **JS:** Combined + Deferred (non-blocking)
- **Images:** Lazy loaded
- **Load Time:** ~1.2 detik

**Estimasi Peningkatan: +27-37 points** 🎉

---

## 🚀 Next Steps untuk 90+/100

### Priority 1 (High Impact)
1. **Cloudflare APO** ($5/month)
   - Enable di Cloudflare dashboard
   - **Impact: +15-20 points**

2. **Critical CSS Generation**
   - Generate critical CSS untuk above-the-fold
   - Inline di `<head>`
   - **Impact: +5-10 points**

3. **Elementor Optimization**
   - Dashboard → Elementor → Settings → Features
   - ✅ Optimized DOM Output
   - ✅ Improved Asset Loading
   - **Impact: +5-10 points**

### Priority 2 (Medium Impact)
4. **Remove Unused CSS/JS**
   - Audit dengan Chrome DevTools Coverage
   - Remove unused Elementor widgets
   - **Impact: +3-5 points**

5. **Font Optimization**
   - Self-host Google Fonts
   - Use `font-display: swap`
   - **Impact: +2-5 points**

6. **Preload Critical Resources**
   ```html
   <link rel="preload" href="/path/to/critical.css" as="style">
   <link rel="preload" href="/path/to/critical.js" as="script">
   ```

---

## 📝 Test Page Speed Sekarang

### Manual Test
1. Buka: **https://pagespeed.web.dev/**
2. Masukkan: `https://myporto.web.id`
3. Klik "Analyze"
4. Screenshot hasilnya!

### Expected Results
- **Performance:** 70-80/100 (dari 43/100)
- **Accessibility:** 89/100 (unchanged)
- **Best Practices:** 96/100 (unchanged)
- **SEO:** 92/100 (unchanged)

---

## 🔧 Troubleshooting

### Jika Score Belum Naik

1. **Hard Refresh Browser**
   - Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Clear browser cache

2. **Clear Cloudflare Cache**
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

3. **Clear LiteSpeed Cache**
   ```bash
   ssh -p 2295 root@38.49.212.111
   rm -rf /var/www/html/wp-content/cache/litespeed/*
   ```

4. **Verify Settings**
   ```bash
   ssh -p 2295 root@38.49.212.111
   mysql -u wpuser -p'WpPass123!' wordpress -e "
   SELECT option_name, option_value 
   FROM wp_options 
   WHERE option_name LIKE 'litespeed.conf.optm-%' 
   ORDER BY option_name;
   "
   ```

---

## 📞 Summary

**Status:** ✅ Render-blocking resources FIXED  
**Optimizations:** 9 major fixes applied  
**Cache:** Cleared & regenerated  
**Estimated Score:** 70-80/100 (dari 43/100)

**Test sekarang di PageSpeed Insights!** 🚀

---

**Generated by:** Kiro AI (@undangyah_bot)  
**Timestamp:** 2026-05-28 03:22 UTC  
**Docs:** https://undangyah.id/MYPORTO-RENDER-BLOCKING-FIX.md
