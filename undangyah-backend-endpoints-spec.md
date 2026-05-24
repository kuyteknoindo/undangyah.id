# Spesifikasi Endpoint Backend yang Dibutuhkan — Undangyah.id

**Base URL:** `https://app.undangyah.id/wp-json`
**Auth:** `Authorization: Bearer <access_token>` (WP JWT), kecuali disebut publik.
**Versi namespace:** `/undangyah/v1` (default) atau `/weddingsaas/v1` (legacy reseller).
**Format response umum:**
```json
{ "ok": true, "data": <payload> }
```
atau pada error:
```json
{ "ok": false, "code": "string_code", "message": "Pesan untuk user" }
```

Dokumen ini ditulis dari hasil audit frontend (React + TanStack Start). Setiap endpoint berisi alasan, request, dan response yang akan dikonsumsi langsung oleh client tanpa transformasi tambahan.

---

## 🔴 P0 — Critical (Harus Ada)

### 1. Affiliate / Reseller Program

#### 1.1 `GET /undangyah/v1/affiliate/products`
**Untuk:** Halaman admin & user reseller, daftar produk yang boleh dijual.
**Auth:** Bearer (admin untuk write, semua reseller untuk read).
**Query:** `?active=1` (opsional, filter aktif saja)
**Response 200:**
```json
{
  "ok": true,
  "data": [
    {
      "id": "prd_basic",
      "name": "Paket Basic",
      "description": "Untuk acara intim",
      "price": 49000,
      "commission_type": "percent",   // "percent" | "fixed"
      "commission_value": 20,         // 20% atau IDR
      "active": true
    }
  ]
}
```

#### 1.2 `POST/PUT/DELETE /undangyah/v1/affiliate/products[/{id}]`
**Auth:** Admin only.
**Body POST/PUT:** sama dengan struktur item di 1.1 (tanpa `id` untuk POST).

#### 1.3 `GET /undangyah/v1/affiliate/settings`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "program_name": "Program Affiliate UndangYah",
    "default_rate": 15,
    "min_payout": 50000,
    "payout_day": 25,
    "payout_note": "Payout via transfer bank tgl 25.",
    "terms": "Markdown panjang T&C…"
  }
}
```

#### 1.4 `PUT /undangyah/v1/affiliate/settings`
**Auth:** Admin only. **Body:** sama dengan `data` di 1.3.

#### 1.5 `POST /undangyah/v1/affiliate/withdraw`
**Untuk:** Tombol "Tarik Saldo" di halaman Affiliate user.
**Body:**
```json
{
  "amount": 150000,
  "method": "bank_transfer",       // bank_transfer | ewallet
  "account_name": "Budi Santoso",
  "account_number": "1234567890",
  "bank_code": "BCA",              // atau nama e-wallet: DANA/OVO/GOPAY
  "note": "Optional catatan user"
}
```
**Response 200:**
```json
{
  "ok": true,
  "data": { "id": 123, "status": "pending", "created_at": "2026-05-24T10:00:00Z" }
}
```
**Error:**
- `400 below_min_payout` — saldo < `min_payout`
- `400 insufficient_balance`

#### 1.6 `GET /undangyah/v1/affiliate/withdrawals`
**Query:** `?page=1&per_page=20&status=pending|paid|rejected`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": 123,
        "amount": 150000,
        "method": "bank_transfer",
        "account_name": "Budi Santoso",
        "account_number": "1234***890",
        "bank_code": "BCA",
        "status": "paid",            // pending | paid | rejected
        "note_admin": "Transfer 25 Mei",
        "created_at": "2026-05-20T10:00:00Z",
        "paid_at": "2026-05-25T08:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "per_page": 20
  }
}
```

#### 1.7 `GET /undangyah/v1/affiliate/referrals`
**Untuk:** Tabel "Riwayat Referral" di halaman Affiliate user.
**Query:** `?page=1&per_page=20`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": 999,
        "buyer_name": "Andi P.",
        "buyer_email_masked": "a***@gmail.com",
        "product_id": "prd_premium",
        "product_name": "Paket Premium",
        "order_id": 4521,
        "amount": 99000,
        "commission": 19800,
        "status": "paid",          // pending | paid | refunded
        "created_at": "2026-05-15T12:00:00Z"
      }
    ],
    "total": 12,
    "page": 1,
    "per_page": 20,
    "summary": {
      "total_commission_paid": 450000,
      "total_commission_pending": 80000,
      "conversion_count": 12
    }
  }
}
```

---

### 2. Two-Factor Authentication

#### 2.1 `POST /undangyah/v1/users/me/2fa/enable`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "otpauth_url": "otpauth://totp/Undangyah:user@mail.com?secret=...&issuer=Undangyah",
    "qr_svg": "<svg>…</svg>",
    "recovery_codes": ["ABCD-1234","EFGH-5678", "..."]
  }
}
```

#### 2.2 `POST /undangyah/v1/users/me/2fa/verify`
**Body:** `{ "code": "123456" }`
**Response 200:** `{ "ok": true, "data": { "enabled": true } }`
**Error 400:** `invalid_code`

#### 2.3 `POST /undangyah/v1/users/me/2fa/disable`
**Body:** `{ "password": "current_password" }`
**Response 200:** `{ "ok": true, "data": { "enabled": false } }`

#### 2.4 `GET /undangyah/v1/users/me/2fa/status`
**Response 200:** `{ "ok": true, "data": { "enabled": true, "method": "totp" } }`

---

### 3. Support Tickets

#### 3.1 `POST /undangyah/v1/support/tickets`
**Body (multipart/form-data supaya bisa attach screenshot):**
```
subject:        string (3..120)
category:       "billing" | "technical" | "feature" | "other"
priority:       "low" | "normal" | "high"
message:        string (10..4000)
invitation_id:  number?      // opsional, link ke undangan
attachments[]:  file (max 5, masing-masing <= 5MB, image/* atau pdf)
```
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "id": 712,
    "ticket_number": "TKT-2026-0712",
    "status": "open",
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

#### 3.2 `GET /undangyah/v1/support/tickets`
**Query:** `?page=1&per_page=10&status=open|answered|closed`
**Response 200:** `{ "ok": true, "data": { "items": [...], "total": n } }` dengan tiap item:
```json
{
  "id": 712, "ticket_number": "TKT-2026-0712",
  "subject": "Tidak bisa upload foto", "category": "technical",
  "status": "answered", "unread": 1,
  "last_message_at": "2026-05-25T08:00:00Z",
  "created_at": "2026-05-24T10:00:00Z"
}
```

#### 3.3 `GET /undangyah/v1/support/tickets/{id}`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "id": 712, "ticket_number": "TKT-2026-0712",
    "subject": "...", "category": "technical", "priority": "normal",
    "status": "answered",
    "messages": [
      {
        "id": 1, "author": "user", "name": "Budi",
        "body": "Halo, foto saya...",
        "attachments": [{ "url": "...", "name": "ss.png", "size": 12345 }],
        "created_at": "2026-05-24T10:00:00Z"
      },
      { "id": 2, "author": "admin", "name": "CS Undangyah", "body": "Sudah diperbaiki…", "created_at": "..." }
    ]
  }
}
```

#### 3.4 `POST /undangyah/v1/support/tickets/{id}/reply`
**Body:** sama dengan 3.1 tapi hanya `message` + `attachments[]`.

#### 3.5 `GET /undangyah/v1/support/faq`
**Query:** `?category=billing` (opsional)
**Response 200:**
```json
{
  "ok": true,
  "data": [
    { "id": 1, "category": "billing", "q": "Bagaimana cara upgrade paket?", "a": "Markdown jawaban…", "order": 1 }
  ]
}
```

---

## 🟡 P1 — Important

### 4. Invoice & Billing

#### 4.1 `GET /undangyah/v1/orders/{id}/invoice.pdf`
**Response:** `Content-Type: application/pdf` — file invoice resmi (header logo, nomor seri, NPWP/PPN bila ada). Frontend tinggal `window.open(url)`.

#### 4.2 `GET /undangyah/v1/users/me/billing-history`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "current_plan": "premium",
    "current_period_end": "2026-12-31T23:59:59Z",
    "auto_renew": false,
    "lifetime_spend": 745000,
    "items": [
      {
        "id": 4521, "date": "2026-05-01", "kind": "subscription",
        "plan": "premium", "amount": 99000, "status": "paid",
        "invoice_url": "https://app.undangyah.id/wp-json/undangyah/v1/orders/4521/invoice.pdf"
      }
    ]
  }
}
```

#### 4.3 `POST /undangyah/v1/orders/{id}/cancel`
**Untuk:** Batalkan pesanan pending. **Response:** `{ ok, data: { id, status: "cancelled" } }`.

---

### 5. User Preferences (server-side, lintas device)

#### 5.1 `GET /undangyah/v1/users/me/preferences`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "theme": "system",         // "light" | "dark" | "system"
    "language": "id",          // "id" | "en"
    "compact_mode": false,
    "sound": true,
    "notif_push": true,
    "notif_email": true,
    "notif_whatsapp": false,
    "notif_marketing": false,
    "fav_themes": [12, 34, 56] // ID tema favorit
  }
}
```

#### 5.2 `PUT /undangyah/v1/users/me/preferences`
**Body:** partial dari struktur 5.1 (PATCH-like). **Response:** preferences setelah merge.

#### 5.3 `POST /undangyah/v1/users/me/notification-channels/test`
**Body:** `{ "channel": "email" | "whatsapp" | "push" }`
**Response 200:** `{ ok, data: { sent: true, sent_at: "..." } }`

---

### 6. Analytics Lanjutan

#### 6.1 `GET /undangyah/v1/invitations/{id}/analytics/devices`
**Query:** `?range=7|30|90`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "by_device": [
      { "label": "Mobile",  "count": 1240 },
      { "label": "Desktop", "count": 230  },
      { "label": "Tablet",  "count": 18   }
    ],
    "by_browser": [
      { "label": "Chrome",  "count": 980 },
      { "label": "Safari",  "count": 420 },
      { "label": "Others",  "count": 88  }
    ],
    "by_os": [
      { "label": "Android", "count": 900 },
      { "label": "iOS",     "count": 560 }
    ]
  }
}
```

#### 6.2 `GET /undangyah/v1/invitations/{id}/analytics/referrers`
**Response 200:**
```json
{
  "ok": true,
  "data": [
    { "source": "WhatsApp",  "count": 820 },
    { "source": "Instagram", "count": 210 },
    { "source": "Direct",    "count": 150 },
    { "source": "Facebook",  "count": 30  }
  ]
}
```

#### 6.3 `GET /undangyah/v1/invitations/{id}/analytics/geo`
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "by_province": [{ "label": "DKI Jakarta", "count": 320 }, { "label": "Jawa Barat", "count": 210 }],
    "by_city":     [{ "label": "Jakarta Selatan", "count": 120 }]
  }
}
```

#### 6.4 `GET /undangyah/v1/users/me/analytics/summary?range=7|30|90`
**Untuk:** Halaman dashboard utama & Analytics agregat — saat ini di-compute di client, berat bila >100 undangan.
**Response 200:**
```json
{
  "ok": true,
  "data": {
    "range_days": 7,
    "totals": {
      "views": 12400, "guests": 540, "rsvp_hadir": 320,
      "rsvp_tidak_hadir": 40, "rsvp_belum": 180, "rsvp_rate": 0.66
    },
    "views_daily":  { "2026-05-18": 1500, "2026-05-19": 1620, "...": 0 },
    "rsvp_daily":   { "2026-05-18": 60,   "2026-05-19": 45,   "...": 0 }
  }
}
```

---

## 🟢 P2 — Nice to Have

### 7. Theme Favorites (jika tidak digabung ke preferences)
- `GET    /undangyah/v1/themes/favorites` → `{ ok, data: [12, 34] }`
- `POST   /undangyah/v1/themes/{id}/favorite`
- `DELETE /undangyah/v1/themes/{id}/favorite`
- `GET    /undangyah/v1/themes/most-loved` → tema terpopuler berdasar agregat favorit semua user.

### 8. Google Drive Links (broadcast/media)
- `GET    /undangyah/v1/users/me/gdrive-links`
- `POST   /undangyah/v1/users/me/gdrive-links` — body: `{ name, url }`
- `DELETE /undangyah/v1/users/me/gdrive-links/{id}`

### 9. WA Templates
- `GET /undangyah/v1/wa/templates?category=invite|reminder|thanks`
  → `{ ok, data: [{ id, category, name, body, vars: ["nama","tanggal"] }] }`

### 10. Account Management
- `POST   /undangyah/v1/users/me/avatar` — multipart `file` (image, ≤2MB) → `{ ok, data: { avatar_url } }`
- `GET    /undangyah/v1/users/me/sessions` → daftar device aktif (ua, ip, last_seen, current)
- `DELETE /undangyah/v1/users/me/sessions/{id}` — revoke session
- `DELETE /undangyah/v1/users/me` — body: `{ password, reason? }` → soft-delete akun.

### 11. Auth Tambahan
- `POST /undangyah/v1/auth/forgot-password` — body: `{ email }`
- `POST /undangyah/v1/auth/reset-password` — body: `{ token, new_password }`
- `POST /undangyah/v1/auth/google` — body: `{ id_token }` → response sama dengan login normal.
- `POST /undangyah/v1/auth/apple` — body: `{ identity_token, code }`.

---

## Catatan Implementasi untuk Tim Backend

1. **Konsistensi shape**: gunakan `{ ok, data }` pada semua response sukses. Frontend `apiFetch` sudah otomatis unwrap `data` bila ada.
2. **Pagination**: gunakan `?page=`, `?per_page=` dan kembalikan `{ items, total, page, per_page }`. Hindari format `{ rows, data, results }` campur-campur — beberapa endpoint lama tidak konsisten (cek `lib/api.ts` normalisasi RSVP).
3. **Tanggal**: ISO 8601 UTC (`2026-05-24T10:00:00Z`). Hindari timestamp Unix campur dengan string.
4. **Uang**: integer IDR (`99000`), bukan float (`99.0`) atau string (`"Rp 99.000"`).
5. **Status enum**: lowercase snake_case (`pending`, `paid`, `rejected`).
6. **Capabilities**: endpoint admin (1.2, 1.4, settings) wajib cek `user_can('manage_options')` atau capability custom `manage_undangyah`.
7. **Rate-limit** untuk endpoint berikut sangat disarankan:
   - `POST /support/tickets` — 5 req/jam per user
   - `POST /affiliate/withdraw` — 3 req/hari per user
   - `POST /2fa/verify` — 10 req/menit per user (anti brute force)
   - `POST /auth/forgot-password` — 5 req/jam per email
8. **Webhook payment**: pastikan webhook payment gateway (Tripay/Duitku/Xendit) memperbarui `orders.status` → `paid`, lalu generate invoice PDF (4.1) on-demand atau pre-render saat status berubah.
9. **Versioning**: tambah header `X-Api-Version: 1` di response — frontend bisa cek bila perlu fallback.

---

## Mapping Cepat (Frontend → Endpoint Baru)

| Halaman / File frontend | Saat ini | Endpoint baru yang dibutuhkan |
|---|---|---|
| `dashboard.affiliate.tsx` | localStorage + WA | 1.1–1.7 |
| `dashboard.pengaturan.tsx` (2FA) | localStorage fake | 2.1–2.4 |
| `dashboard.bantuan.tsx` | Link WA only | 3.1–3.5 |
| `dashboard.tagihan.tsx` (cetak) | `window.print()` HTML | 4.1, 4.2 |
| `dashboard.pengaturan.tsx` (prefs) | `updateMe({meta})` | 5.1–5.3 |
| `dashboard.analytics.tsx` | Compute di client | 6.1–6.4 |
| `dashboard.themes.tsx` | localStorage `uy.fav_themes` | 7 (atau 5.1 `fav_themes`) |
| `components/media-picker.tsx` | localStorage `gdrive_links` | 8 |
| `dashboard.edit.$id.share.tsx` | localStorage draft pesan | 9 |
| `lib/affiliate-config.ts` (admin) | localStorage | 1.2, 1.4 |

---

_Dokumen ini dihasilkan otomatis dari audit kode frontend `undangyah.id` per 24 Mei 2026. Bila ada endpoint yang sudah ada tapi nama path-nya berbeda, cukup kirim alias path-nya — frontend akan menyesuaikan di `src/lib/api.ts`._
