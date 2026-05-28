# PRD: Editor Undangan - hi.undangyah.id

**Version:** 1.0  
**Last Updated:** 2026-05-23  
**Status:** Draft

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Section Management](#section-management)
6. [Conditional Rendering](#conditional-rendering)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

Editor undangan adalah halaman utama untuk mengelola konten undangan digital.

**Route:** `/dashboard/edit/:id`  
**Component:** `src/pages/Edit.tsx` (5442 lines)  
**Backend:** WordPress plugin `undangyah-invitation`

---

## Problem Statement

### Masalah Utama
Data yang disimpan di editor **tidak muncul di preview** (go.undangyah.id).

### Kemungkinan Penyebab
1. Data tidak ter-fetch dengan benar dari backend
2. Conditional rendering berdasarkan admin menu/section tidak berfungsi
3. Field rules tidak diterapkan dengan benar (package tier, toggle activation)
4. Cache tidak ter-invalidate setelah save
5. Tema Elementor tidak support field tertentu atau dynamic tag tidak terkonfigurasi

---

## Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + React Router
- **Backend:** WordPress REST API (namespace: `undangyah/v1`)
- **State Management:** Local component state + localStorage cache
- **Preview Engine:** Elementor + JetEngine dynamic tags

---

## API Endpoints

### GET /undangyah/v1/invitations/:id/meta

Fetch semua meta fields untuk invitation tertentu.

**Response:**
```json
{
  "success": true,
  "data": {
    "_judul_undangan": "Pernikahan Andi & Budi",
    "_slug": "andi-budi",
    "_nama_lengkap_pria": "Andi Pratama",
    "_aktifkan_love_story": "1"
  }
}
```

### POST /undangyah/v1/invitations/:id/meta

Save meta fields untuk invitation tertentu.

### GET /undangyah/v1/field-rules

Fetch conditional logic rules untuk semua fields.

**Response:**
```json
{
  "success": true,
  "data": {
    "_aktifkan_streaming": {
      "package_tiers": ["premium", "duluxe"],
      "hidden_if": []
    }
  }
}
```

---

## Section Management

| Section Key | Label | Description |
|------------|-------|-------------|
| `setting` | Setting Undangan | Judul, slug, countdown, fitur activation |
| `acara` | Setting Acara | Acara 1, 2, 3 dengan conditional |
| `mempelai` | Setting Mempelai | Foto, nama, ortu, instagram |
| `lovestory` | Love Story | Repeater dengan conditional |
| `quotes` | Quotes | Pembuka, penutup |
| `tema` | Tema | Tema aktif, slug |
| `kado` | Kado Digital | Penerima, alamat, rekening repeater |
| `musik` | Musik | Mode, youtube, audio, custom |
| `foto` | Foto | Cover, desktop, opening, penutup |
| `gallery` | Gallery | Multi upload, video, foto 1-10 |
| `livestream` | Live Streaming | Link streaming, video |
| `gcalendar` | Google Calendar | Judul, tanggal, lokasi, deskripsi |

---

## Conditional Rendering

### 1. Package Tier Rules

**Tier Hierarchy:**
- `basic` — Fitur dasar
- `premium` — Fitur menengah
- `duluxe` — Fitur lengkap

Field hanya muncul untuk tier tertentu sesuai `package_tiers` di field rules.

### 2. Feature Activation Rules

Jika fitur tidak diaktifkan, hide semua field terkait:

- `_aktifkan_kirim_ucapan` → affects wish form
- `_aktifkan_google_calendar` → affects gcalendar section
- `_aktifkan_love_story` → affects lovestory section
- `_aktifkan_kado_digital` → affects kado section
- `_aktifkan_streaming` → affects livestream section
- `_fitur_galleri` → affects gallery section

### 3. Admin Schema Rules

Schema disimpan di `wp_options` key `udy_metabox_schema`.

Jika section/field tidak ada di schema, akan di-hide dari editor.

---

## Troubleshooting Guide

### Problem: Data tidak muncul di preview

#### Checkpoint 1: Verify Data Saved
```bash
wp post meta get <post_id> _judul_undangan
```

**Expected:** Data harus ada di database

**If empty:** Check save request, backend validation, permission

---

#### Checkpoint 2: Verify Feature Activation

Check if feature is enabled di section Setting:
- `_aktifkan_love_story`
- `_aktifkan_kado_digital`
- `_aktifkan_streaming`
- `_fitur_galleri`

**If disabled:** Enable feature toggle, save setting section

---

#### Checkpoint 3: Verify Field Rules

```typescript
const fieldRules = await getFieldRules();
const rule = fieldRules['_nama_lengkap_pria'];

if (rule.package_tiers && !rule.package_tiers.includes(userTier)) {
  console.log('Field hidden by package tier');
}
```

**If hidden:** Upgrade package tier atau remove field rule (admin only)

---

#### Checkpoint 4: Verify Admin Schema

```typescript
const schema = await getAdminMetaboxSchema();

if (!schema['lovestory']) {
  console.log('Love story section removed by admin');
}
```

**If missing:** Contact admin to restore section/field

---

#### Checkpoint 5: Verify Elementor Template

Check if tema supports field tersebut.

**Dynamic tag format:**
```
[wds_meta key="_judul_undangan"]
[wds_meta key="_nama_lengkap_pria"]
```

**If missing:** Add dynamic tag di tema template (Elementor editor)

---

#### Checkpoint 6: Verify Cache

```bash
# Clear all caches
wp cache flush
wp elementor flush-css

# Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/292d2382c4a0f172d6c8f87f945bdcc9/purge_cache" \
  -H "Authorization: Bearer YOUR_CLOUDFLARE_API_TOKEN" \
  -d '{"purge_everything":true}'
```

**If still cached:** Hard refresh browser (Ctrl+Shift+R)

---

### Problem: Field tidak muncul di editor

#### Solution 1: Check Package Tier
```typescript
const userTier = useAccountTier();
const fieldRules = await getFieldRules();
const rule = fieldRules['_aktifkan_streaming'];

if (rule.package_tiers && !rule.package_tiers.includes(userTier)) {
  console.log('Field requires upgrade to:', rule.package_tiers);
}
```

#### Solution 2: Check Feature Toggle
```typescript
if (meta._aktifkan_kado_digital !== '1') {
  console.log('Kado digital feature disabled');
  console.log('Enable it in Setting section');
}
```

#### Solution 3: Check Admin Schema
```typescript
const schema = await getAdminMetaboxSchema();
console.log('Available sections:', Object.keys(schema));
```

---

### Problem: Save gagal

#### Solution 1: Check Validation
```typescript
const requiredFields = ['_judul_undangan', '_slug'];
for (const field of requiredFields) {
  if (!meta[field]) {
    console.error(`Required field missing: ${field}`);
  }
}
```

#### Solution 2: Check Slug Uniqueness
```bash
wp post list --post_type=undangan --name=<slug>
```

#### Solution 3: Check Permission
```bash
wp post get <post_id> --field=post_author
```

---

### Problem: Preview tidak update

#### Solution 1: Purge Cache
```bash
# Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/292d2382c4a0f172d6c8f87f945bdcc9/purge_cache" \
  -H "Authorization: Bearer YOUR_CLOUDFLARE_API_TOKEN" \
  -d '{"purge_everything":true}'

# Elementor
wp elementor flush-css

# WordPress
wp cache flush
```

#### Solution 2: Check Elementor Template
```bash
wp post get <tema_post_id> --field=post_content | grep wds_meta
```

#### Solution 3: Check Dynamic Tag Syntax
```
# Correct
[wds_meta key="_judul_undangan"]

# Wrong
[wds_meta key="judul_undangan"]  # Missing underscore
```

---

## Best Practices

### 1. Always Validate Before Save
```typescript
const errors = validateInvitationMeta(meta);
if (errors.length > 0) {
  showNotice({ type: 'error', message: errors[0] });
  return;
}
```

### 2. Show Loading States
```typescript
const [saving, setSaving] = useState(false);

const handleSave = async () => {
  setSaving(true);
  try {
    await saveInvitationMeta(id, meta);
    showNotice({ type: 'success', message: 'Data berhasil disimpan.' });
  } finally {
    setSaving(false);
  }
};
```

### 3. Invalidate Cache After Save
```typescript
await saveInvitationMeta(id, meta);
localStorage.removeItem(`invitation_meta_${id}`);
api.invalidateCache(`invitations:${id}:meta`);
```

---

**End of Document**
