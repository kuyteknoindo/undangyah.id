# Quick Testing Reference — Backend Endpoints

**Base URL:** `https://app.undangyah.id/wp-json/undangyah/v1`  
**Auth:** `Authorization: Bearer <token>`  
**Tanggal:** 24 Mei 2026

---

## 🔐 Get Access Token

```bash
# Login untuk dapat token
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_email@example.com",
    "password": "your_password"
  }'

# Response:
# { "ok": true, "data": { "access_token": "eyJ0eXAi...", ... } }

# Set token ke variable
TOKEN="eyJ0eXAi..."
```

---

## 1️⃣ Two-Factor Authentication

### Enable 2FA
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/users/me/2fa/enable \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { secret, otpauth_url, qr_svg, recovery_codes } }
```

### Verify 2FA (scan QR dengan Google Authenticator dulu)
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/users/me/2fa/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"123456"}'

# Response: { ok: true, data: { enabled: true } }
```

### Check Status
```bash
curl https://app.undangyah.id/wp-json/undangyah/v1/users/me/2fa/status \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { enabled: true, method: "totp" } }
```

### Disable 2FA
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/users/me/2fa/disable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'

# Response: { ok: true, data: { enabled: false } }
```

---

## 2️⃣ Support Tickets

### Create Ticket (dengan attachment)
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/support/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -F "subject=Tidak bisa upload foto" \
  -F "category=technical" \
  -F "priority=normal" \
  -F "message=Saya tidak bisa upload foto di halaman edit undangan. Sudah coba berbagai format tapi tetap error." \
  -F "attachments[]=@screenshot.png"

# Response: { ok: true, data: { id: 712, ticket_number: "TKT-2026-0712", status: "open", created_at: "..." } }
```

### List Tickets
```bash
curl "https://app.undangyah.id/wp-json/undangyah/v1/support/tickets?page=1&per_page=10&status=open" \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { items: [...], total: 5, page: 1, per_page: 10 } }
```

### Get Ticket Detail
```bash
curl https://app.undangyah.id/wp-json/undangyah/v1/support/tickets/712 \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { id, ticket_number, subject, category, priority, status, messages: [...] } }
```

### Reply to Ticket
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/support/tickets/712/reply \
  -H "Authorization: Bearer $TOKEN" \
  -F "message=Terima kasih atas responnya. Masalahnya masih sama setelah clear cache."

# Response: { ok: true, data: { id: 2, created_at: "..." } }
```

### Get FAQ
```bash
curl "https://app.undangyah.id/wp-json/undangyah/v1/support/faq?category=billing" \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: [{ id, category, q, a, order }, ...] }
```

---

## 3️⃣ Affiliate/Reseller

### Get Products
```bash
curl "https://app.undangyah.id/wp-json/undangyah/v1/affiliate/products?active=1" \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: [{ id, name, description, price, commission_type, commission_value, active }, ...] }
```

### Get Settings
```bash
curl https://app.undangyah.id/wp-json/undangyah/v1/affiliate/settings \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { program_name, default_rate, min_payout, payout_day, payout_note, terms } }
```

### Create Withdrawal Request
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/affiliate/withdraw \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150000,
    "method": "bank_transfer",
    "account_name": "Budi Santoso",
    "account_number": "1234567890",
    "bank_code": "BCA",
    "note": "Mohon transfer ke rekening BCA"
  }'

# Response: { ok: true, data: { id: 123, status: "pending", created_at: "..." } }
```

### Get Withdrawal History
```bash
curl "https://app.undangyah.id/wp-json/undangyah/v1/affiliate/withdrawals?page=1&per_page=20&status=pending" \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { items: [...], total: 5, page: 1, per_page: 20 } }
```

### Get Referral History
```bash
curl "https://app.undangyah.id/wp-json/undangyah/v1/affiliate/referrals?page=1&per_page=20" \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { items: [...], total: 12, page: 1, per_page: 20, summary: { total_commission_paid, total_commission_pending, conversion_count } } }
```

---

## 4️⃣ User Preferences

### Get Preferences
```bash
curl https://app.undangyah.id/wp-json/undangyah/v1/users/me/preferences \
  -H "Authorization: Bearer $TOKEN"

# Response: { ok: true, data: { theme, language, compact_mode, sound, notif_push, notif_email, notif_whatsapp, notif_marketing, fav_themes } }
```

### Update Preferences (partial)
```bash
curl -X PUT https://app.undangyah.id/wp-json/undangyah/v1/users/me/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notif_email": false,
    "fav_themes": [12, 34, 56]
  }'

# Response: { ok: true, data: { theme: "dark", language: "id", ... } }
```

### Test Notification
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/users/me/notification-channels/test \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"email"}'

# Response: { ok: true, data: { sent: true, sent_at: "..." } }
```

---

## 5️⃣ Admin Endpoints (Affiliate)

**Note:** Butuh admin token

### Create Product
```bash
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/affiliate/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prd_basic",
    "name": "Paket Basic",
    "description": "Untuk acara intim",
    "price": 49000,
    "commission_type": "percent",
    "commission_value": 20,
    "active": true
  }'

# Response: { ok: true, data: { id: 1, product_id: "prd_basic" } }
```

### Update Product
```bash
curl -X PUT https://app.undangyah.id/wp-json/undangyah/v1/affiliate/products/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paket Basic Updated",
    "price": 55000,
    "commission_value": 25
  }'

# Response: { ok: true, data: { id: 1 } }
```

### Delete Product
```bash
curl -X DELETE https://app.undangyah.id/wp-json/undangyah/v1/affiliate/products/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Response: { ok: true, data: { id: 1 } }
```

### Update Settings
```bash
curl -X PUT https://app.undangyah.id/wp-json/undangyah/v1/affiliate/settings \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "program_name": "Program Affiliate UndangYah",
    "default_rate": 15,
    "min_payout": 50000,
    "payout_day": 25,
    "payout_note": "Payout via transfer bank setiap tanggal 25.",
    "terms": "Syarat dan ketentuan program affiliate..."
  }'

# Response: { ok: true, data: { program_name, default_rate, ... } }
```

---

## 🧪 Testing Scenarios

### Test Rate Limiting
```bash
# Support tickets: 5 per jam
for i in {1..6}; do
  curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/support/tickets \
    -H "Authorization: Bearer $TOKEN" \
    -F "subject=Test $i" \
    -F "category=other" \
    -F "priority=low" \
    -F "message=Test rate limiting"
  echo "\n---\n"
done

# Request ke-6 harus return 429 dengan code: "rate_limit_exceeded"
```

### Test File Upload
```bash
# Max 5 files, 5MB each
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/support/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -F "subject=Test upload" \
  -F "category=technical" \
  -F "priority=normal" \
  -F "message=Testing multiple attachments" \
  -F "attachments[]=@file1.png" \
  -F "attachments[]=@file2.jpg" \
  -F "attachments[]=@file3.pdf" \
  -F "attachments[]=@file4.png" \
  -F "attachments[]=@file5.jpg"
```

### Test Insufficient Balance
```bash
# Withdraw amount > available balance
curl -X POST https://app.undangyah.id/wp-json/undangyah/v1/affiliate/withdraw \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 999999999,
    "method": "bank_transfer",
    "account_name": "Test",
    "account_number": "123",
    "bank_code": "BCA"
  }'

# Expected: { ok: false, code: "insufficient_balance", message: "..." }
```

---

## 📊 Expected Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `rate_limit_exceeded` | 429 | Terlalu banyak request |
| `insufficient_balance` | 400 | Saldo tidak cukup |
| `below_min_payout` | 400 | Di bawah minimum penarikan |
| `invalid_code` | 400 | Kode OTP salah |
| `invalid_password` | 401 | Password salah |
| `ticket_not_found` | 404 | Tiket tidak ditemukan |
| `file_too_large` | 400 | File > 5MB |
| `invalid_file_type` | 400 | Bukan image/pdf |
| `too_many_files` | 400 | Lebih dari 5 file |
| `not_reseller` | 403 | Bukan reseller atau belum approved |

---

**Dibuat:** 24 Mei 2026, 22:42 WIB  
**Status:** All endpoints READY ✅
