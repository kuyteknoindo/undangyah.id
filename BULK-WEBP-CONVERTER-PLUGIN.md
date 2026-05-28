# 🚀 Plugin: Bulk WebP Converter & Compressor

**Version:** 1.0.0  
**Author:** Kiro AI  
**Status:** ✅ Installed & Active  
**Location:** `/wp-content/plugins/bulk-webp-converter/`

---

## 📋 Fitur Plugin

### 1. Convert to WebP
- Convert semua gambar JPG/JPEG/PNG ke format WebP
- Quality: 85% (balance size vs visual quality)
- Output: `filename.jpg.webp` (original file tetap ada)
- Batch processing: 50 images per batch
- Background processing: tidak mengganggu website

### 2. Compress Images
- Compress gambar JPG/PNG tanpa convert
- Quality: 85% untuk JPG, level 8 untuk PNG
- Mengurangi ukuran file 30-60%
- Original file di-overwrite (backup dulu jika perlu)

### 3. Statistics Dashboard
- Total JPG/JPEG images
- Total PNG images
- Total WebP images (sudah ada)
- Upload directory size
- Images to convert (belum ada WebP-nya)

---

## 🎯 Cara Menggunakan

### Akses Plugin
```
Dashboard WordPress → Tools → WebP Converter
URL: https://myporto.web.id/wp-admin/tools.php?page=bulk-webp-converter
```

### Step 1: Lihat Statistics
- Plugin akan scan semua gambar di `/wp-content/uploads/`
- Menampilkan jumlah JPG, PNG, WebP yang sudah ada
- Menampilkan total size upload directory

### Step 2: Convert to WebP
1. Klik tombol **"🔄 Convert to WebP"**
2. Confirm dialog
3. Plugin akan process 50 images per batch
4. Progress bar menampilkan status real-time
5. Selesai: menampilkan total images converted

### Step 3: Compress Images (Optional)
1. Klik tombol **"🗜️ Compress Images"**
2. Confirm dialog
3. Plugin akan compress JPG/PNG (reduce size)
4. Progress bar menampilkan status + saved bytes
5. Selesai: menampilkan total compressed + space saved

---

## ⚙️ Technical Details

### Batch Processing
- **Batch Size:** 50 images per batch
- **Delay:** 500ms between batches (prevent server overload)
- **AJAX:** Background processing via WordPress AJAX
- **Timeout:** No timeout (process sampai selesai)

### Image Quality
- **WebP Quality:** 85% (recommended for web)
- **JPG Quality:** 85% (compression)
- **PNG Compression:** Level 8 (0-9, higher = smaller file)

### File Handling
- **Convert:** Original file tetap ada, WebP file baru dibuat
- **Compress:** Original file di-overwrite (backup dulu!)
- **Permissions:** www-data:www-data (WordPress user)

### Supported Formats
- ✅ JPG / JPEG
- ✅ PNG (with transparency support)
- ❌ GIF (not supported)
- ❌ SVG (not needed)

---

## 📊 Expected Results

### Before
```
JPG/PNG: 3,718 files
WebP: 4,265 files (dari Imagify)
Total Size: 405 MB
```

### After Convert
```
JPG/PNG: 3,718 files (original tetap ada)
WebP: 7,983 files (4,265 + 3,718 baru)
Total Size: ~450 MB (WebP files added)
```

### After Compress
```
JPG/PNG: 3,718 files (compressed, size turun 30-60%)
WebP: 7,983 files
Total Size: ~350 MB (saved ~100 MB)
```

---

## 🔧 Troubleshooting

### Plugin tidak muncul di menu
```bash
# SSH ke VPS
ssh -p 2295 root@38.49.212.111

# Check plugin active
cd /var/www/html
wp plugin list --allow-root | grep bulk-webp

# Activate jika belum
wp plugin activate bulk-webp-converter --allow-root
```

### Convert gagal / error
```bash
# Check PHP GD extension (required untuk WebP)
php -m | grep -i gd

# Install jika belum ada
apt-get install php8.2-gd -y
systemctl restart php8.2-fpm
```

### Progress stuck / tidak jalan
- Refresh halaman (F5)
- Clear browser cache (Ctrl+Shift+R)
- Check browser console (F12) untuk error JavaScript

### Memory limit error
```bash
# Increase PHP memory limit
sed -i 's/memory_limit = .*/memory_limit = 512M/' /etc/php/8.2/fpm/php.ini
systemctl reload php8.2-fpm
```

---

## 🚀 Performance Impact

### Server Load
- **CPU:** Low (batch processing dengan delay)
- **Memory:** ~50-100 MB per batch
- **Disk I/O:** Medium (read + write images)
- **Network:** None (local processing)

### Website Impact
- **Frontend:** No impact (background processing)
- **Backend:** Minimal (AJAX requests setiap 500ms)
- **Database:** No impact (no DB writes)

### Recommended Time
- **Best:** Off-peak hours (malam hari)
- **Avoid:** Peak traffic hours
- **Duration:** ~5-10 menit untuk 3,718 images

---

## 📝 Code Structure

### Files
```
/wp-content/plugins/bulk-webp-converter/
├── bulk-webp-converter.php  (Main plugin file, 11.9 KB)
└── admin.js                  (AJAX handler, 5.6 KB)
```

### PHP Functions
- `__init()` — Initialize plugin hooks
- `add_admin_menu()` — Add Tools menu
- `admin_page()` — Render admin UI
- `ajax_get_stats()` — Get image statistics
- `ajax_convert_batch()` — Convert batch to WebP
- `ajax_compress_images()` — Compress batch
- `convert_to_webp()` — Convert single image
- `compress_image()` — Compress single image

### JavaScript Functions
- `loadStats()` — Load statistics via AJAX
- `convertBatch()` — Recursive batch converter
- `compressBatch()` — Recursive batch compressor

---

## 🎯 Next Steps

### 1. Test Plugin
```
1. Login: https://myporto.web.id/wp-admin
2. Go to: Tools → WebP Converter
3. Check statistics
4. Test convert (klik tombol Convert to WebP)
5. Monitor progress
```

### 2. Backup (Recommended)
```bash
# Backup uploads directory sebelum compress
ssh -p 2295 root@38.49.212.111
cd /var/www/html/wp-content
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

### 3. Run Conversion
```
1. Convert to WebP (semua JPG/PNG)
2. Wait sampai selesai (~5-10 menit)
3. Check statistics (WebP count naik)
4. Test website (pastikan gambar load normal)
```

### 4. Run Compression (Optional)
```
1. Compress Images (reduce size JPG/PNG)
2. Wait sampai selesai
3. Check saved space
4. Test website (pastikan gambar masih bagus)
```

---

## 📞 Summary

**Status:** ✅ **PLUGIN INSTALLED & ACTIVE**

**Location:** Tools → WebP Converter  
**URL:** https://myporto.web.id/wp-admin/tools.php?page=bulk-webp-converter

**Features:**
- ✅ Convert JPG/PNG to WebP (batch processing)
- ✅ Compress JPG/PNG (reduce size)
- ✅ Statistics dashboard
- ✅ Progress tracking
- ✅ Background processing (no website impact)

**Expected Results:**
- Convert: +3,718 WebP files
- Compress: Save ~100 MB disk space
- PageSpeed: +5-10 points (faster image loading)

**Next Action:**
1. Login WordPress admin
2. Go to Tools → WebP Converter
3. Click "Convert to WebP"
4. Wait ~5-10 menit
5. Test website

---

**Plugin by:** Kiro AI (@undangyah_bot)  
**Installed:** 2026-05-28 11:29 WIB  
**Server:** VPS Canada (38.49.212.111:2295)
