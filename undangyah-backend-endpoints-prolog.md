# Prolog untuk Tim Backend — Spesifikasi Endpoint Undangyah

**Dari:** Tim Frontend (Dashboard React + TanStack Start)
**Untuk:** Tim Backend (WordPress REST API)
**Tanggal:** 24 Mei 2026
**Lampiran:** `undangyah-backend-endpoints-spec.md` (spesifikasi teknis lengkap)

---

## TL;DR

Setelah audit menyeluruh terhadap dashboard `undangyah.id`, kami menemukan **11 grup endpoint** yang dibutuhkan frontend tapi belum tersedia di backend. Beberapa fitur user-facing saat ini bekerja dengan *workaround* (localStorage, redirect ke WhatsApp, atau hitung di client) yang **tidak production-grade** dan berisiko menimbulkan masalah kepercayaan user, terutama pada fitur **2FA, Tarik Saldo Affiliate, dan Support Ticket**.

Dokumen ini meminta tim backend untuk menyediakan endpoint baru sesuai prioritas:

- **🔴 P0 (3 grup, ~13 endpoint)** — wajib, ada risiko keamanan/kepercayaan
- **🟡 P1 (3 grup, ~10 endpoint)** — meningkatkan kualitas produk
- **🟢 P2 (5 grup, ~14 endpoint)** — penyempurnaan & cross-device sync

Estimasi total: **±37 endpoint**, namun banyak yang merupakan CRUD sederhana berbasis tabel baru atau perluasan tabel `wp_usermeta`.

---

## Mengapa Ini Penting Sekarang

| Masalah saat ini | Dampak ke user | Risiko bisnis |
|---|---|---|
| Toggle **2FA** hanya simpan ke `localStorage` | User mengira akunnya aman, padahal tidak | **Reputasi & compliance** — bisa dianggap *security theater* |
| **Tarik Saldo Affiliate** redirect ke WhatsApp admin | Tidak ada record permintaan, rawan miss & dispute | **Trust reseller** — affiliate berhenti bila tidak terbayar |
| **Kirim Tiket Support** tidak ada — semua ke WA | CS overload, history hilang saat ganti device | **SLA & skalabilitas CS** |
| **Konfigurasi produk affiliate** di localStorage admin | Admin lain tidak lihat konfigurasi yang sama | **Inconsistent data** antar admin |
| **Favorit tema, draft pesan WA, Drive links** hanya di device | Hilang saat ganti HP / browser | **Friction & churn** |
| **Analytics device/referrer/geo** tidak ada | Page Analytics tampak kosong fitur | **Nilai jual paket Premium berkurang** |
| Tidak ada **Invoice PDF resmi** | Print via browser HTML, tidak ada nomor seri | **Tidak bisa dipakai laporan pajak/akuntansi user** |

---

## Cara Membaca Dokumen Spesifikasi

File `undangyah-backend-endpoints-spec.md` berisi:

1. **Konvensi global** — base URL, format response `{ ok, data }`, format error standar.
2. **Per endpoint** — method + path, auth requirement, request body/query, contoh response sukses, dan kemungkinan error.
3. **Catatan implementasi** — capabilities, rate-limit, format tanggal/uang/enum.
4. **Tabel mapping** — frontend file → endpoint baru, supaya tim backend tahu siapa konsumennya.

Yang **wajib diperhatikan tim backend**:

- Semua response sukses **harus** memakai shape `{ ok: true, data: ... }` — frontend `apiFetch` sudah otomatis unwrap `data`.
- **Pagination** standar: `?page=&per_page=` dan return `{ items, total, page, per_page }`. Hindari format campur (`rows`/`results`/`data`) seperti pada beberapa endpoint lama.
- **Tanggal** ISO 8601 UTC. **Uang** integer IDR. **Enum** lowercase snake_case.
- **Rate-limit** wajib pada: `POST /support/tickets`, `POST /affiliate/withdraw`, `POST /2fa/verify`, `POST /auth/forgot-password` (detail di catatan #7).

---

## Rekomendasi Urutan Pengerjaan (Sprint Plan)

### Sprint 1 — Trust & Safety (P0, ±1 minggu)
1. **2FA** (2.1–2.4) — TOTP standard, library WordPress sudah ada.
2. **Support Tickets** (3.1–3.5) — buat tabel `wp_uy_tickets` + `wp_uy_ticket_messages`.
3. **Affiliate withdraw + history** (1.5, 1.6, 1.7) — paling mendesak karena terkait pembayaran.

### Sprint 2 — Backend Affiliate Lengkap + Billing (P0 sisa + P1, ±1 minggu)
4. **Affiliate products & settings** (1.1–1.4) — pindahkan dari localStorage admin ke `wp_options` / tabel baru.
5. **Invoice PDF generator** (4.1, 4.2) — gunakan library seperti `mpdf` atau `dompdf`.

### Sprint 3 — Preferences & Analytics Lanjutan (P1, ±1 minggu)
6. **User preferences** (5.1–5.3) — simpan di `wp_usermeta` key `uy_prefs`.
7. **Analytics device/referrer/geo** (6.1–6.4) — perlu logger di endpoint view tracking + agregat harian.

### Sprint 4 — Polish (P2, opsional / ongoing)
8. Theme favorites, gdrive links, WA templates, account management, social auth.

---

## Yang Akan Kami Lakukan di Frontend

Setelah endpoint tersedia di staging, kami akan:
1. Tambahkan method baru di `src/lib/api.ts` mengikuti spesifikasi.
2. Migrasi data dari localStorage → server (one-time sync di balik layar) untuk: prefs, fav themes, gdrive links, draft WA.
3. Hapus semua workaround `localStorage` + redirect WA yang tidak perlu lagi.
4. Tambahkan loading state, error handling, dan optimistic update di setiap halaman terkait.

Tidak ada perubahan UI besar — semua endpoint baru ini *plug-in* ke UI yang sudah ada.

---

## Permintaan Konfirmasi dari Backend

Mohon konfirmasi sebelum mulai coding:

1. ✅ / ❌ — Setuju dengan shape response `{ ok, data }` untuk semua endpoint baru?
2. ✅ / ❌ — Setuju dengan namespace `/undangyah/v1/*` (atau lebih prefer `/uy/v2`)?
3. ✅ / ❌ — Apakah ada library 2FA TOTP yang sudah dipakai di backend (misal `aaemnnosttv/wp-cli-2fa`, `miniorange-2-factor`)?
4. ✅ / ❌ — Apakah ada payment gateway yang sudah meng-update status order via webhook? (untuk invoice 4.1 perlu trigger saat `paid`).
5. **Pertanyaan terbuka:** ada endpoint di list ini yang sebenarnya sudah ada dengan path berbeda? Kalau ada, kasih tahu path-nya — kami yang akan sesuaikan di frontend, backend tidak perlu rename.

---

## Kontak

Untuk diskusi spesifikasi atau klarifikasi shape data, hubungi tim Frontend Undangyah. Spesifikasi teknis lengkap ada di lampiran `undangyah-backend-endpoints-spec.md`.

Terima kasih sudah membaca! 🙏
