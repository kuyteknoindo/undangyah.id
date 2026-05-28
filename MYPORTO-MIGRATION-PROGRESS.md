# ✅ Migrasi myporto.web.id — Progress Report

**Tanggal:** 28 Mei 2026, 16:02 WIB  
**Status:** 🟡 **80% SELESAI — TINGGAL CLOUDFLARE TUNNEL**

---

## ✅ Yang Sudah Selesai

### 1. Backup & Transfer ✅
- ✅ Backup files: 569 MB
- ✅ Backup database: 3.7 MB
- ✅ Transfer ke VPS baru: DONE
- ✅ Extract files: DONE

### 2. Database Setup ✅
- ✅ MariaDB installed & running
- ✅ Database `wordpress` created
- ✅ User `wpuser` created
- ✅ Database imported: 70 tables
- ✅ wp-config.php: credentials OK

### 3. Web Server Setup ✅
- ✅ Nginx installed & running (custom: /www/server/nginx/)
- ✅ PHP 8.2-FPM installed & running
- ✅ Nginx vhost configured: `/www/server/panel/vhost/nginx/myporto.web.id.conf`
- ✅ WebP rewrite rules: configured
- ✅ Website responding: `curl http://localhost` → 200 OK

### 4. Cloudflared ✅
- ✅ Cloudflared installed: v2026.5.2
- ✅ Config template created: `/etc/cloudflared/config.yml`

---

## ⏳ Yang Perlu Diselesaikan

### 5. Cloudflare Tunnel Setup (15 menit)

**Option A: Copy Tunnel dari VPS Canada (Recommended)**

Jika myporto.web.id sudah punya tunnel di VPS Canada, copy credentials:

```bash
# 1. Get tunnel info dari VPS Canada
ssh -p 2295 root@38.49.212.111
cat /etc/cloudflared/config.yml
# Note: tunnel ID dan credentials file

# 2. Copy credentials ke VPS baru
scp -P 2295 root@38.49.212.111:/root/.cloudflared/TUNNEL_ID.json \
    /tmp/

scp -P 49306 /tmp/TUNNEL_ID.json \
    root@43.157.240.32:/root/.cloudflared/

# 3. Update config di VPS baru
ssh -p 49306 root@43.157.240.32
nano /etc/cloudflared/config.yml
# Update tunnel ID

# 4. Install service
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared
systemctl status cloudflared
```

**Option B: Create New Tunnel**

```bash
# 1. Login Cloudflare
cloudflared tunnel login
# Akan buka browser untuk auth

# 2. Create tunnel
cloudflared tunnel create myporto-new

# 3. Route DNS
cloudflared tunnel route dns myporto-new myporto.web.id
cloudflared tunnel route dns myporto-new www.myporto.web.id

# 4. Update config
nano /etc/cloudflared/config.yml
# Update tunnel ID dan credentials path

# 5. Install service
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared
```

---

## 📊 VPS Comparison

| Item | VPS Canada (Old) | VPS Baru |
|---|---|---|
| **IP** | 38.49.212.111 | 43.157.240.32 |
| **SSH Port** | 2295 | 49306 |
| **OS** | Debian 12 | Debian 12 |
| **RAM** | ? | 1.8 GB |
| **Disk** | 40 GB | 40 GB (14 GB free) |
| **Nginx** | /usr/sbin/nginx | /www/server/nginx/ |
| **PHP** | 8.2-FPM | 8.2-FPM |
| **Database** | MariaDB | MariaDB |
| **Website** | /var/www/html | /var/www/html |

---

## 🔧 Files Location (VPS Baru)

```
Website:
  /var/www/html/                    # WordPress files
  /var/www/html/wp-config.php       # Database config

Nginx:
  /www/server/nginx/                # Nginx root
  /www/server/nginx/conf/nginx.conf # Main config
  /www/server/panel/vhost/nginx/    # Vhost configs
  /www/server/panel/vhost/nginx/myporto.web.id.conf

PHP:
  /etc/php/8.2/fpm/                 # PHP-FPM config
  /run/php/php8.2-fpm.sock          # PHP socket

Cloudflared:
  /etc/cloudflared/config.yml       # Tunnel config
  /root/.cloudflared/               # Credentials

Database:
  Database: wordpress
  User: wpuser
  Password: WpPass123!
```

---

## 🧪 Testing Checklist

### After Tunnel Setup:

```bash
# 1. Test tunnel
systemctl status cloudflared
journalctl -u cloudflared -f

# 2. Test website dari internet
curl -I https://myporto.web.id

# 3. Test WordPress admin
curl -I https://myporto.web.id/wp-admin

# 4. Test database connection
cd /var/www/html
php -r "
\$conn = new mysqli('localhost', 'wpuser', 'WpPass123!', 'wordpress');
if (\$conn->connect_error) {
    die('Connection failed: ' . \$conn->connect_error);
}
echo 'Database connected successfully';
"

# 5. Test performance
curl -w "\nTime: %{time_total}s\n" -o /dev/null https://myporto.web.id

# 6. PageSpeed Insights
# https://pagespeed.web.dev/
```

---

## 📝 Next Steps

1. **Get Cloudflare Tunnel Info** dari VPS Canada
2. **Copy credentials** atau create new tunnel
3. **Start cloudflared service** di VPS baru
4. **Test website** dari internet
5. **Verify performance** (PageSpeed Insights)
6. **Monitor** selama 24-48 jam
7. **Cleanup VPS Canada** (setelah verify OK)

---

## ⚠️ Important Notes

**JANGAN HAPUS VPS CANADA DULU!**
- Tunggu 24-48 jam untuk verify
- Pastikan website stable di VPS baru
- Backup masih ada di `/tmp/` VPS Canada

**Cloudflare DNS:**
- Jika pakai tunnel baru, DNS akan auto-update
- Jika copy tunnel lama, DNS tetap sama (no downtime)

**Performance:**
- VPS baru sudah optimized (Nginx + PHP 8.2)
- WebP rewrite rules sudah configured
- LiteSpeed Cache plugin masih active
- Expected load time: < 1 detik

---

## 📞 Status Summary

**Progress:** 80% ✅  
**Remaining:** Cloudflare Tunnel setup (15 menit)

**VPS Baru Ready:**
- ✅ Website files
- ✅ Database
- ✅ Nginx configured
- ✅ PHP-FPM running
- ✅ Cloudflared installed
- ⏳ Tunnel not configured yet

**Next Action:**
1. Get tunnel info dari VPS Canada
2. Setup tunnel di VPS baru
3. Test & verify

---

**Dokumentasi by:** Kiro AI (@undangyah_bot)  
**VPS Canada:** 38.49.212.111:2295  
**VPS Baru:** 43.157.240.32:49306  
**Website:** myporto.web.id
