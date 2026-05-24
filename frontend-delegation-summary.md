# Summary Delegasi untuk Programmer Frontend

**Dari:** Backend Team (Kiro AI)  
**Untuk:** Frontend Developer  
**Tanggal:** 24 Mei 2026, 22:40 WIB  
**Topik:** Implementasi 19 Endpoint Baru — Sprint 1 (P0) Selesai

---

## 🎯 Tujuan

Backend sudah menyediakan **19 endpoint baru** sesuai spesifikasi yang diminta tim frontend. Semua endpoint sudah siap digunakan di staging/production.

---

## 📍 Lokasi File Penting

1. **Spesifikasi lengkap:** `/www/wwwroot/undangyah.id/undangyah-backend-endpoints-spec.md`
2. **Prolog (context):** `/www/wwwroot/undangyah.id/undangyah-backend-endpoints-prolog.md`
3. **Implementation summary:** `/www/wwwroot/undangyah.id/backend-endpoints-implementation-summary.md`
4. **Backend code:** `/www/wwwroot/app.undangyah.id/wp-content/plugins/undangyah-invitation/includes/api/`

**Akses file via curl:**
```bash
curl -sI https://undangyah.id/undangyah-backend-endpoints-spec.md
curl -sI https://undangyah.id/undangyah-backend-endpoints-prolog.md
curl -sI https://undangyah.id/backend-endpoints-implementation-summary.md
```

---

## ✅ Endpoint yang Sudah Tersedia

### 1. Two-Factor Authentication (4 endpoint)
- `POST /undangyah/v1/users/me/2fa/enable`
- `POST /undangyah/v1/users/me/2fa/verify`
- `POST /undangyah/v1/users/me/2fa/disable`
- `GET /undangyah/v1/users/me/2fa/status`

### 2. Support Tickets (5 endpoint)
- `POST /undangyah/v1/support/tickets`
- `GET /undangyah/v1/support/tickets`
- `GET /undangyah/v1/support/tickets/{id}`
- `POST /undangyah/v1/support/tickets/{id}/reply`
- `GET /undangyah/v1/support/faq`

### 3. Affiliate User (5 endpoint)
- `GET /undangyah/v1/affiliate/products`
- `GET /undangyah/v1/affiliate/settings`
- `POST /undangyah/v1/affiliate/withdraw`
- `GET /undangyah/v1/affiliate/withdrawals`
- `GET /undangyah/v1/affiliate/referrals`

### 4. Affiliate Admin (4 endpoint)
- `POST /undangyah/v1/affiliate/products`
- `PUT /undangyah/v1/affiliate/products/{id}`
- `DELETE /undangyah/v1/affiliate/products/{id}`
- `PUT /undangyah/v1/affiliate/settings`

### 5. User Preferences (3 endpoint)
- `GET /undangyah/v1/users/me/preferences`
- `PUT /undangyah/v1/users/me/preferences`
- `POST /undangyah/v1/users/me/notification-channels/test`

---

## 🔑 Key Points untuk Frontend

### Response Format
Semua endpoint menggunakan format konsisten:
```typescript
// Success
{ ok: true, data: {...} }

// Error
{ ok: false, code: "error_code", message: "Pesan untuk user" }
```

Frontend `apiFetch` sudah otomatis unwrap `data`, jadi tinggal pakai langsung.

### Pagination
Format standar:
```typescript
{
  ok: true,
  data: {
    items: [...],
    total: 100,
    page: 1,
    per_page: 20
  }
}
```

Query params: `?page=1&per_page=20`

### Tanggal & Uang
- **Tanggal:** ISO 8601 UTC (`2026-05-24T10:00:00Z`)
- **Uang:** Integer IDR (`99000`, bukan `"Rp 99.000"`)
- **Enum:** Lowercase snake_case (`pending`, `paid`, `rejected`)

### Rate Limiting
Beberapa endpoint punya rate limit:
- `POST /support/tickets` — 5 req/jam
- `POST /affiliate/withdraw` — 3 req/hari
- `POST /2fa/verify` — **belum aktif** (TODO backend)

Error response: `429 Too Many Requests` dengan `code: "rate_limit_exceeded"`

---

## 📝 Action Items untuk Frontend

### 1. Update `src/lib/api.ts`

Tambahkan method baru:

```typescript
// 2FA
export const enable2FA = () => apiFetch('/users/me/2fa/enable', { method: 'POST' })
export const verify2FA = (code: string) => apiFetch('/users/me/2fa/verify', { 
  method: 'POST', 
  body: { code } 
})
export const disable2FA = (password: string) => apiFetch('/users/me/2fa/disable', { 
  method: 'POST', 
  body: { password } 
})
export const get2FAStatus = () => apiFetch('/users/me/2fa/status')

// Support Tickets
export const createTicket = (data: FormData) => apiFetch('/support/tickets', { 
  method: 'POST', 
  body: data,
  headers: {} // Let browser set Content-Type for multipart
})
export const getTickets = (params?: { page?: number; per_page?: number; status?: string }) => 
  apiFetch('/support/tickets', { params })
export const getTicketDetail = (id: number) => apiFetch(`/support/tickets/${id}`)
export const replyTicket = (id: number, data: FormData) => 
  apiFetch(`/support/tickets/${id}/reply`, { method: 'POST', body: data })
export const getFAQ = (category?: string) => apiFetch('/support/faq', { params: { category } })

// Affiliate
export const getAffiliateProducts = (activeOnly?: boolean) => 
  apiFetch('/affiliate/products', { params: { active: activeOnly ? '1' : undefined } })
export const getAffiliateSettings = () => apiFetch('/affiliate/settings')
export const createWithdraw = (data: {
  amount: number
  method: 'bank_transfer' | 'ewallet'
  account_name: string
  account_number: string
  bank_code: string
  note?: string
}) => apiFetch('/affiliate/withdraw', { method: 'POST', body: data })
export const getWithdrawals = (params?: { page?: number; per_page?: number; status?: string }) => 
  apiFetch('/affiliate/withdrawals', { params })
export const getReferrals = (params?: { page?: number; per_page?: number }) => 
  apiFetch('/affiliate/referrals', { params })

// Preferences
export const getPreferences = () => apiFetch('/users/me/preferences')
export const updatePreferences = (prefs: Partial<UserPreferences>) => 
  apiFetch('/users/me/preferences', { method: 'PUT', body: prefs })
export const testNotification = (channel: 'email' | 'whatsapp' | 'push') => 
  apiFetch('/users/me/notification-channels/test', { method: 'POST', body: { channel } })
```

### 2. Migrasi localStorage → Server

**One-time sync** saat user login (jalankan sekali, lalu hapus):

```typescript
// Di useEffect setelah login berhasil
const migrateLocalStorageToServer = async () => {
  const migrated = localStorage.getItem('uy.migrated_to_server')
  if (migrated) return // Sudah pernah migrasi

  try {
    // Ambil data dari localStorage
    const favThemes = JSON.parse(localStorage.getItem('uy.fav_themes') || '[]')
    const theme = localStorage.getItem('uy.theme') || 'system'
    const language = localStorage.getItem('uy.language') || 'id'

    // Kirim ke server
    await updatePreferences({
      fav_themes: favThemes,
      theme,
      language,
    })

    // Tandai sudah migrasi
    localStorage.setItem('uy.migrated_to_server', 'true')
    
    // Opsional: hapus data lama
    localStorage.removeItem('uy.fav_themes')
    localStorage.removeItem('uy.theme')
    localStorage.removeItem('uy.language')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}
```

### 3. Update UI Components

#### `dashboard.pengaturan.tsx` (2FA)
```typescript
// Hapus localStorage fake toggle
// Ganti dengan:
const [mfaStatus, setMfaStatus] = useState({ enabled: false })
const [qrCode, setQrCode] = useState<string | null>(null)

useEffect(() => {
  get2FAStatus().then(setMfaStatus)
}, [])

const handleEnable2FA = async () => {
  const result = await enable2FA()
  setQrCode(result.qr_svg)
  // Show modal dengan QR code
}

const handleVerify = async (code: string) => {
  await verify2FA(code)
  setMfaStatus({ enabled: true })
  setQrCode(null)
}

const handleDisable = async (password: string) => {
  await disable2FA(password)
  setMfaStatus({ enabled: false })
}
```

#### `dashboard.affiliate.tsx` (Withdraw)
```typescript
// Hapus redirect ke WhatsApp
// Ganti dengan:
const handleWithdraw = async (data: WithdrawForm) => {
  try {
    await createWithdraw(data)
    toast.success('Permintaan penarikan berhasil dikirim')
    refetchWithdrawals()
  } catch (error) {
    if (error.code === 'insufficient_balance') {
      toast.error('Saldo tidak cukup')
    } else if (error.code === 'below_min_payout') {
      toast.error(error.message)
    }
  }
}
```

#### `dashboard.bantuan.tsx` (Support)
```typescript
// Hapus link WA only
// Tambahkan form create ticket:
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  const formData = new FormData()
  formData.append('subject', subject)
  formData.append('category', category)
  formData.append('priority', priority)
  formData.append('message', message)
  
  attachments.forEach(file => {
    formData.append('attachments[]', file)
  })

  await createTicket(formData)
  toast.success('Tiket berhasil dibuat')
  router.push('/dashboard/bantuan/tickets')
}
```

### 4. Error Handling

Tambahkan handler untuk error code baru:

```typescript
const errorMessages: Record<string, string> = {
  rate_limit_exceeded: 'Terlalu banyak permintaan. Coba lagi nanti.',
  insufficient_balance: 'Saldo tidak cukup.',
  below_min_payout: 'Jumlah penarikan di bawah minimum.',
  invalid_code: 'Kode OTP salah.',
  ticket_not_found: 'Tiket tidak ditemukan.',
  file_too_large: 'File terlalu besar (max 5MB).',
  invalid_file_type: 'Tipe file tidak diizinkan.',
}
```

---

## 🧪 Testing Checklist

- [ ] Test 2FA flow: enable → scan QR → verify → disable
- [ ] Test create ticket dengan attachment (5 file, berbagai format)
- [ ] Test affiliate withdraw dengan saldo cukup & tidak cukup
- [ ] Test pagination di tickets & withdrawals
- [ ] Test preferences sync: update di device A, cek di device B
- [ ] Test rate limiting: buat 6 tiket dalam 1 jam (harus reject)
- [ ] Test error handling untuk semua error code

---

## ⚠️ Known Issues (Backend TODO)

1. **Rate limiting belum aktif** di `POST /2fa/verify` — CRITICAL untuk security
2. **Admin panel** untuk support tickets belum ada (CS tidak bisa reply)
3. **Email notification** saat ada reply dari admin belum aktif
4. **FAQ storage** masih hardcoded (belum bisa CRUD dari admin)

**Workaround sementara:**
- 2FA verify: frontend bisa tambahkan client-side throttling (max 5 attempt per menit)
- Support tickets: admin bisa reply via database langsung (temporary)
- FAQ: hardcoded di backend, frontend tinggal consume

---

## 📞 Next Steps

1. **Baca 3 file dokumentasi** (link di atas)
2. **Update `src/lib/api.ts`** dengan method baru
3. **Migrasi localStorage** → server (one-time)
4. **Update UI components** sesuai contoh di atas
5. **Test di staging** sebelum deploy production
6. **Report bug/issue** ke backend team jika ada masalah

---

## 🔗 Quick Links

- **Spec lengkap:** https://undangyah.id/undangyah-backend-endpoints-spec.md
- **Implementation summary:** https://undangyah.id/backend-endpoints-implementation-summary.md
- **Base URL:** `https://app.undangyah.id/wp-json/undangyah/v1`
- **Auth:** `Authorization: Bearer <access_token>`

---

**Kontak:** Backend Team  
**Dibuat:** 24 Mei 2026, 22:40 WIB  
**Status:** Sprint 1 (P0) — 19/19 endpoints READY ✅
