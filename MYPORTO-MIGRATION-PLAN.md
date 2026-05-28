# 📋 Rencana Migrasi myporto.web.id

**Tanggal:** 28 Mei 2026, 14:04 WIB  
**Status:** ⏳ **MENUNGGU AKSES SSH VPS BARU**

---

## 🎯 Tujuan Migrasi

**From:** VPS Canada (38.49.212.111:2295)  
**To:** VPS Baru (43.157.240.32:49306)

**Website:** myporto.web.id  
**Stack:** WordPress + Nginx + PHP 8.2 + MariaDB

---

## ❌ Issue Saat Ini

**Problem:** SSH Connection Refused

```bash
# Test koneksi
ping 43.157.240.32
✅ PING OK (15.5ms latency)

# Test SSH
ssh -p 49306 root@43.157.240.32
❌ Connection refused

ssh -p 22 root@43.157.240.32
❌ Connection refused
```

**Kemungkinan Penyebab:**
1. Firewall memblokir SSH (port 22 & 49306)
2. SSH service belum running
3. Port SSH berbeda dari 49306
4. VPS belum selesai provisioning

**Action Required:**
- Cek firewall VPS baru (allow port SSH)
- Pastikan SSH service running: `systemctl status sshd`
- Konfirmasi port SSH yang benar
- Atau berikan akses via console/panel provider

---

## ✅ Backup Sudah Siap

**File:** `/tmp/myporto-backup-20260528.tar.gz`  
**Size:** 569 MB  
**Location:** VPS Canada (38.49.212.111)

**Contents:**
- WordPress files (wp-content, themes, plugins)
- Database (akan di-export terpisah)
- Nginx config
- SSL certificates (jika ada)

---

## 📝 Rencana Migrasi (Setelah SSH Accessible)

### Phase 1: Setup VPS Baru (30 menit)

#### 1.1 Install Stack
```bash
# Update system
apt update && apt upgrade -y

# Install Nginx, PHP 8.2, MariaDB
apt install -y nginx php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd \
  php8.2-mbstring php8.2-xml php8.2-zip php8.2-imagick \
  mariadb-server mariadb-client

# Install tools
apt install -y curl wget git unzip certbot python3-certbot-nginx
```

#### 1.2 Secure MariaDB
```bash
mysql_secure_installation
# Set root password
# Remove anonymous users
# Disallow root login remotely
# Remove test database
```

#### 1.3 Create Database
```bash
mysql -u root -p
CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Phase 2: Transfer Files (20 menit)

#### 2.1 Export Database (VPS Canada)
```bash
# SSH ke VPS Canada
ssh -p 2295 root@38.49.212.111

# Export database
mysqldump -u wpuser -p'WpPass123!' wordpress > /tmp/myporto-db-20260528.sql
gzip /tmp/myporto-db-20260528.sql

# Check size
ls -lh /tmp/myporto-db-20260528.sql.gz
```

#### 2.2 Transfer ke VPS Baru
```bash
# Method 1: Direct SCP (jika SSH sudah OK)
scp -P 49306 /tmp/myporto-backup-20260528.tar.gz root@43.157.240.32:/tmp/
scp -P 49306 /tmp/myporto-db-20260528.sql.gz root@43.157.240.32:/tmp/

# Method 2: Via intermediate server (jika perlu)
# Upload ke VPS Bandung dulu, lalu download dari VPS baru
```

#### 2.3 Extract Files (VPS Baru)
```bash
# SSH ke VPS Baru
ssh -p 49306 root@43.157.240.32

# Create directory
mkdir -p /var/www/html

# Extract
cd /var/www/html
tar -xzf /tmp/myporto-backup-20260528.tar.gz

# Set permissions
chown -R www-data:www-data /var/www/html
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
```

#### 2.4 Import Database
```bash
# Extract SQL
gunzip /tmp/myporto-db-20260528.sql.gz

# Import
mysql -u wpuser -p wordpress < /tmp/myporto-db-20260528.sql

# Verify
mysql -u wpuser -p wordpress -e "SHOW TABLES;"
```

---

### Phase 3: Configure Nginx (15 menit)

#### 3.1 Create Nginx Config
```bash
cat > /etc/nginx/sites-available/myporto << 'EOF'
server {
    listen 80;
    server_name myporto.web.id www.myporto.web.id;
    
    root /var/www/html;
    index index.php index.html;
    
    client_max_body_size 100M;

    # WebP Converter for Media - Rewrite Rules
    location ~ /wp-content/(?<path>.+)\.(?<ext>jpe?g|png|gif)$ {
        if ($http_accept ~* "image/webp") {
            rewrite ^(.*)$ $1.webp last;
        }
        try_files $uri $uri/ =404;
    }
    
    location ~ /wp-content/(?<path>.+)\.(?<ext>jpe?g|png|gif)\.webp$ {
        if (!-f $request_filename) {
            rewrite ^/wp-content/(.+)\.webp$ /wp-content/$1 last;
        }
        add_header Vary Accept;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_index index.php;
    }

    location = /favicon.ico { log_not_found off; access_log off; }
    location = /robots.txt { log_not_found off; access_log off; }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot|mp4|webm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        log_not_found off;
    }

    location ~ /\. { deny all; }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/myporto /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload
systemctl reload nginx
```

#### 3.2 Update wp-config.php
```bash
cd /var/www/html

# Update database credentials
sed -i "s/define( 'DB_NAME', '.*' );/define( 'DB_NAME', 'wordpress' );/" wp-config.php
sed -i "s/define( 'DB_USER', '.*' );/define( 'DB_USER', 'wpuser' );/" wp-config.php
sed -i "s/define( 'DB_PASSWORD', '.*' );/define( 'DB_PASSWORD', 'NEW_PASSWORD' );/" wp-config.php
sed -i "s/define( 'DB_HOST', '.*' );/define( 'DB_HOST', 'localhost' );/" wp-config.php
```

---

### Phase 4: Setup Cloudflare Tunnel (20 menit)

#### 4.1 Install Cloudflared
```bash
# Download
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
dpkg -i cloudflared-linux-amd64.deb

# Verify
cloudflared --version
```

#### 4.2 Authenticate Cloudflare
```bash
# Login (akan buka browser untuk auth)
cloudflared tunnel login

# Atau gunakan token existing jika ada
```

#### 4.3 Create Tunnel
```bash
# Create tunnel
cloudflared tunnel create myporto-tunnel

# Note the Tunnel ID dan Token
```

#### 4.4 Configure Tunnel
```bash
# Create config
mkdir -p /etc/cloudflared

cat > /etc/cloudflared/config.yml << 'EOF'
tunnel: TUNNEL_ID_HERE
credentials-file: /root/.cloudflared/TUNNEL_ID_HERE.json

ingress:
  - hostname: myporto.web.id
    service: http://localhost:80
  - hostname: www.myporto.web.id
    service: http://localhost:80
  - service: http_status:404
EOF
```

#### 4.5 Route DNS
```bash
# Route domain to tunnel
cloudflared tunnel route dns myporto-tunnel myporto.web.id
cloudflared tunnel route dns myporto-tunnel www.myporto.web.id
```

#### 4.6 Install as Service
```bash
# Install service
cloudflared service install

# Start service
systemctl start cloudflared
systemctl enable cloudflared

# Check status
systemctl status cloudflared
```

---

### Phase 5: Testing & Verification (15 menit)

#### 5.1 Test Website
```bash
# Test dari VPS baru
curl -I http://localhost

# Test dari internet
curl -I https://myporto.web.id
```

#### 5.2 Verify WordPress
```bash
# Check wp-admin
curl -I https://myporto.web.id/wp-admin

# Check database connection
cd /var/www/html
wp db check --allow-root
```

#### 5.3 Test Performance
```bash
# Load time
curl -w "\nTime: %{time_total}s\n" -o /dev/null https://myporto.web.id

# PageSpeed Insights
# https://pagespeed.web.dev/
```

#### 5.4 Verify Plugins
```bash
cd /var/www/html
wp plugin list --allow-root

# Activate if needed
wp plugin activate litespeed-cache webp-converter-for-media --allow-root
```

---

### Phase 6: Cleanup & Finalize (10 menit)

#### 6.1 Update Cloudflare DNS (jika perlu)
```
Dashboard → DNS → myporto.web.id
Type: CNAME
Name: myporto.web.id
Target: TUNNEL_ID.cfargotunnel.com
Proxied: ON (orange cloud)
```

#### 6.2 SSL Certificate
```bash
# Cloudflare Tunnel sudah include SSL otomatis
# Atau install Let's Encrypt jika perlu:
certbot --nginx -d myporto.web.id -d www.myporto.web.id
```

#### 6.3 Cleanup VPS Canada (SETELAH VERIFY OK)
```bash
# JANGAN HAPUS DULU! Tunggu 1-2 hari untuk verify
# Backup tetap ada di /tmp/myporto-backup-20260528.tar.gz
```

---

## 📊 Estimasi Waktu

| Phase | Task | Duration |
|---|---|---|
| 1 | Setup VPS Baru | 30 menit |
| 2 | Transfer Files | 20 menit |
| 3 | Configure Nginx | 15 menit |
| 4 | Setup Cloudflare Tunnel | 20 menit |
| 5 | Testing & Verification | 15 menit |
| 6 | Cleanup & Finalize | 10 menit |
| **Total** | | **~2 jam** |

---

## ⚠️ Checklist Sebelum Migrasi

- [ ] Backup database VPS Canada
- [ ] Backup files VPS Canada (✅ DONE: 569 MB)
- [ ] SSH access ke VPS baru (❌ PENDING)
- [ ] Cloudflare API token ready
- [ ] DNS records documented
- [ ] Maintenance mode ON (optional)

---

## 🔧 Troubleshooting

### SSH Connection Refused
```bash
# Check firewall
ufw status
ufw allow 49306/tcp

# Check SSH service
systemctl status sshd
systemctl start sshd

# Check SSH config
cat /etc/ssh/sshd_config | grep Port
```

### Database Import Error
```bash
# Check MySQL max_allowed_packet
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_allowed_packet';"

# Increase if needed
mysql -u root -p -e "SET GLOBAL max_allowed_packet=1073741824;"
```

### Nginx 502 Bad Gateway
```bash
# Check PHP-FPM
systemctl status php8.2-fpm
systemctl restart php8.2-fpm

# Check socket
ls -la /run/php/php8.2-fpm.sock
```

### Cloudflare Tunnel Not Working
```bash
# Check service
systemctl status cloudflared

# Check logs
journalctl -u cloudflared -f

# Test tunnel
cloudflared tunnel info myporto-tunnel
```

---

## 📞 Status Saat Ini

**Backup:** ✅ READY (569 MB)  
**VPS Baru:** ❌ SSH NOT ACCESSIBLE  
**Migrasi:** ⏳ PENDING

**Next Action:**
1. Fix SSH access ke VPS baru (43.157.240.32:49306)
2. Verify firewall & SSH service
3. Konfirmasi port SSH yang benar
4. Mulai migrasi setelah SSH OK

---

**Dokumentasi by:** Kiro AI (@undangyah_bot)  
**Created:** 2026-05-28 14:04 WIB  
**VPS Canada:** 38.49.212.111:2295 (source)  
**VPS Baru:** 43.157.240.32:49306 (destination)
