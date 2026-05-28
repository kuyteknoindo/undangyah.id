# PRD: Editor Undangan - Section Details

**Version:** 1.0  
**Last Updated:** 2026-05-23  
**Status:** Draft

## Table of Contents

1. [Section: Setting](#section-setting)
2. [Section: Acara](#section-acara)
3. [Section: Mempelai](#section-mempelai)
4. [Section: Love Story](#section-love-story)
5. [Section: Quotes](#section-quotes)
6. [Section: Tema](#section-tema)
7. [Section: Kado Digital](#section-kado-digital)
8. [Section: Musik](#section-musik)
9. [Section: Foto](#section-foto)
10. [Section: Gallery](#section-gallery)
11. [Section: Live Streaming](#section-live-streaming)
12. [Section: Google Calendar](#section-google-calendar)
13. [Gallery Management System](#gallery-management-system)

---

## Section: Setting

### Overview
Section untuk konfigurasi dasar undangan: judul, slug, countdown, fitur activation, dan protection.

**Conditional Logic:** Always visible

### Input Fields

#### 1. Judul Undangan
- **Key:** `_judul_undangan`
- **Type:** text
- **Label:** Judul Undangan
- **Required:** Yes
- **Validation:** Min 3 characters
- **Example:** "Pernikahan Andi & Budi"

#### 2. Custom Link (Slug)
- **Key:** `_slug`
- **Type:** text
- **Label:** Custom Link
- **Required:** Yes
- **Validation:** Alphanumeric + dash only, unique
- **Example:** "andi-budi"

#### 3. Tanggal Countdown
- **Key:** `_tanggal_countdown`
- **Type:** date
- **Label:** Tanggal Countdown
- **Required:** No
- **Format:** YYYY-MM-DD

#### 4. Tanggal Cover
- **Key:** `_tanggal_cover`
- **Type:** text
- **Label:** Tanggal Cover
- **Required:** No
- **Example:** "31 Desember 2026"

#### 5. Nomor WhatsApp
- **Key:** `_no_whatsapp`
- **Type:** text
- **Label:** Nomor WhatsApp
- **Required:** No
- **Validation:** Numeric only
- **Example:** "628123456789"

#### 6. Urutan Pengantin
- **Key:** `_urutan_pengantin`
- **Type:** select
- **Label:** Urutan Pengantin
- **Options:** 
  - "pria-wanita" (Pria - Wanita)
  - "wanita-pria" (Wanita - Pria)
- **Default:** "pria-wanita"

### Feature Activation

#### 7. Kirim Ucapan
- **Key:** `_aktifkan_kirim_ucapan`
- **Type:** toggle
- **Label:** Kirim Ucapan
- **Description:** Tampilkan form ucapan dari tamu
- **Default:** "1" (enabled)

#### 8. Google Calendar
- **Key:** `_aktifkan_google_calendar`
- **Type:** toggle
- **Label:** Google Calendar
- **Description:** Izinkan tamu menyimpan jadwal acara
- **Default:** "0" (disabled)

#### 9. Love Story
- **Key:** `_aktifkan_love_story`
- **Type:** toggle
- **Label:** Love Story
- **Description:** Tampilkan section cerita perjalanan
- **Default:** "0" (disabled)

#### 10. Kado Digital
- **Key:** `_aktifkan_kado_digital`
- **Type:** toggle
- **Label:** Kado Digital
- **Description:** Aktifkan info rekening/e-wallet
- **Default:** "0" (disabled)

#### 11. Live Streaming
- **Key:** `_aktifkan_streaming`
- **Type:** toggle
- **Label:** Live Streaming
- **Description:** Tampilkan link streaming
- **Package Tier:** premium, duluxe
- **Default:** "0" (disabled)

#### 12. Galeri Foto
- **Key:** `_fitur_galleri`
- **Type:** toggle
- **Label:** Galeri Foto
- **Description:** Aktifkan galeri foto
- **Default:** "1" (enabled)

### Protection

#### 13. Aktifkan Protection
- **Key:** `_wds_invitation_protection_enabled`
- **Type:** toggle
- **Label:** Aktifkan Protection
- **Description:** Lindungi undangan dengan password
- **Default:** "0" (disabled)

#### 14. Password Protection
- **Key:** `_wds_invitation_protection_password`
- **Type:** password
- **Label:** Password Protection
- **Required:** No
- **Conditional:** Only visible if `_wds_invitation_protection_enabled` = "1"

### UI/UX Specification

**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│ Setting Undangan              [Simpan]  │
├─────────────────────────────────────────┤
│ [Judul Undangan]                        │
│ [Custom Link]                           │
│ [Tanggal Countdown] [Tanggal Cover]     │
│ [Nomor WhatsApp] [Urutan Pengantin]     │
│                                         │
│ Aktifkan Fitur Undangan                 │
│ ☑ Kirim Ucapan                          │
│ ☐ Google Calendar                       │
│ ☐ Love Story                            │
│ ☐ Kado Digital                          │
│ ☐ Live Streaming (Premium)              │
│ ☑ Galeri Foto                           │
│                                         │
│ Protection Undangan                     │
│ ☐ Aktifkan Protection                   │
│ [Password] (hidden)                     │
└─────────────────────────────────────────┘
```

**Mobile Layout:** Stack vertical, toggle switches, collapsible sections

### Data Structure

**Request Payload:**
```json
{
  "_judul_undangan": "Pernikahan Andi & Budi",
  "_slug": "andi-budi",
  "_tanggal_countdown": "2026-12-31",
  "_tanggal_cover": "31 Desember 2026",
  "_no_whatsapp": "628123456789",
  "_urutan_pengantin": "pria-wanita",
  "_aktifkan_kirim_ucapan": "1",
  "_aktifkan_google_calendar": "0",
  "_aktifkan_love_story": "1",
  "_aktifkan_kado_digital": "1",
  "_aktifkan_streaming": "0",
  "_fitur_galleri": "1",
  "_wds_invitation_protection_enabled": "0",
  "_wds_invitation_protection_password": ""
}
```

---

## Section: Acara

### Overview
Section untuk mengatur detail acara pernikahan (akad, resepsi, dll). Support hingga 3 acara dengan conditional toggle.

**Conditional Logic:** Always visible

### Input Fields

#### Acara 1 (Always Visible)

1. **Nama Acara 1**
   - **Key:** `_nama_acara_1`
   - **Type:** text
   - **Label:** Nama Acara 1
   - **Example:** "Akad Nikah"

2. **Tanggal Acara 1**
   - **Key:** `_tanggal_acara_1`
   - **Type:** text
   - **Label:** Tanggal Acara 1
   - **Example:** "31 Desember 2026"

3. **Waktu Acara 1**
   - **Key:** `_waktu_acara_1`
   - **Type:** text
   - **Label:** Waktu Acara 1
   - **Example:** "08:00 - 10:00 WIB"

4. **Lokasi Acara 1**
   - **Key:** `_lokasi_acara_1`
   - **Type:** text
   - **Label:** Lokasi Acara 1
   - **Example:** "Masjid Agung"

5. **Alamat Acara 1**
   - **Key:** `_alamat_acara_1`
   - **Type:** textarea
   - **Label:** Alamat Acara 1
   - **Example:** "Jl. Raya No. 123, Bandung"

6. **Google Maps 1**
   - **Key:** `_link_maps_1`
   - **Type:** url
   - **Label:** Google Maps 1
   - **Validation:** Valid URL
   - **Example:** "https://maps.google.com/?q=-6.9175,107.6191"

#### Acara 2 (Conditional)

7. **Aktifkan Acara 2**
   - **Key:** `aktifkan_acara2`
   - **Type:** toggle
   - **Label:** Aktifkan Acara 2
   - **Default:** "0" (disabled)

8-13. **Fields Acara 2** (sama dengan Acara 1, suffix `_2`)
   - Conditional: Only visible if `aktifkan_acara2` = "1"

#### Acara 3 (Conditional)

14. **Aktifkan Acara 3**
   - **Key:** `aktifkan_acara3`
   - **Type:** toggle
   - **Label:** Aktifkan Acara 3
   - **Default:** "0" (disabled)

15-20. **Fields Acara 3** (sama dengan Acara 1, suffix `_3`)
   - Conditional: Only visible if `aktifkan_acara3` = "1"

### UI/UX Specification

**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│ Setting Acara                 [Simpan]  │
├─────────────────────────────────────────┤
│ Acara 1                                 │
│ [Nama Acara]                            │
│ [Tanggal] [Waktu]                       │
│ [Lokasi]                                │
│ [Alamat]                                │
│ [Google Maps URL]                       │
│                                         │
│ ☐ Aktifkan Acara 2                      │
│ (fields hidden)                         │
│                                         │
│ ☐ Aktifkan Acara 3                      │
│ (fields hidden)                         │
└─────────────────────────────────────────┘
```

**Mobile Layout:** Accordion per acara, toggle untuk show/hide

---

## Section: Mempelai

### Overview
Section untuk data mempelai pria dan wanita: foto, nama, orang tua, Instagram.

**Conditional Logic:** Always visible

### Input Fields

#### Mempelai Pria

1. **Foto Pria**
   - **Key:** `_photo_pria`
   - **Type:** media (image)
   - **Label:** Foto Pria
   - **Max Size:** 1 MB
   - **Format:** JPG, PNG, WebP

2. **Nama Lengkap Pria**
   - **Key:** `_nama_lengkap_pria`
   - **Type:** text
   - **Label:** Nama Lengkap Pria
   - **Example:** "Andi Pratama, S.Kom"

3. **Nama Panggilan Pria**
   - **Key:** `_nama_panggilan_pria`
   - **Type:** text
   - **Label:** Nama Panggilan Pria
   - **Example:** "Andi"

4. **Nama Ayah Pria**
   - **Key:** `_nama_ayah_pria`
   - **Type:** text
   - **Label:** Nama Ayah Pria

5. **Nama Ibu Pria**
   - **Key:** `_nama_ibu_pria`
   - **Type:** text
   - **Label:** Nama Ibu Pria

6. **Instagram Pria**
   - **Key:** `_instagram_pria`
   - **Type:** text
   - **Label:** Instagram Pria
   - **Validation:** Auto-strip @ and URL
   - **Example:** "andipratama" (stored without @)

#### Mempelai Wanita

7-12. **Fields Wanita** (sama dengan Pria, suffix `_wanita`)

### UI/UX Specification

**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│ Setting Mempelai              [Simpan]  │
├─────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐        │
│ │ Mempelai    │  │ Mempelai    │        │
│ │ Pria        │  │ Wanita      │        │
│ ├─────────────┤  ├─────────────┤        │
│ │ [Foto]      │  │ [Foto]      │        │
│ │ [Nama       │  │ [Nama       │        │
│ │  Lengkap]   │  │  Lengkap]   │        │
│ │ [Panggilan] │  │ [Panggilan] │        │
│ │ [Ayah]      │  │ [Ayah]      │        │
│ │ [Ibu]       │  │ [Ibu]       │        │
│ │ [Instagram] │  │ [Instagram] │        │
│ └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────┘
```

**Mobile Layout:** Stack vertical, foto di atas, form di bawah

---

## Section: Love Story

### Overview
Section untuk cerita perjalanan hubungan. Support hingga 4 story dengan conditional toggle.

**Conditional Logic:** Visible if `_aktifkan_love_story` = "1"

### Input Fields

#### Story 1 (Always Visible)

1. **Foto Story 1**
   - **Key:** `_photo_love_1`
   - **Type:** media (image)
   - **Label:** Foto Story 1

2. **Tanggal Story 1**
   - **Key:** `_tanggal_love_1`
   - **Type:** text
   - **Label:** Tanggal Story 1
   - **Example:** "12 Jan 2020"

3. **Cerita Story 1**
   - **Key:** `_deskripsi_love_1`
   - **Type:** textarea
   - **Label:** Cerita Story 1
   - **Rows:** 4

#### Story 2 (Conditional)

4. **Aktifkan Story 2**
   - **Key:** `_aktifkan_love_story_2`
   - **Type:** toggle
   - **Label:** Aktifkan Story 2

5-7. **Fields Story 2** (sama dengan Story 1, suffix `_2`)
   - Conditional: Only visible if `_aktifkan_love_story_2` = "1"

#### Story 3 & 4 (Conditional)
- Same pattern dengan Story 2

### UI/UX Specification

**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│ Love Story                    [Simpan]  │
├─────────────────────────────────────────┤
│ Story 1                                 │
│ [Foto]                                  │
│ [Tanggal]                               │
│ [Cerita]                                │
│                                         │
│ ☐ Aktifkan Story 2                      │
│ (fields hidden)                         │
└─────────────────────────────────────────┘
```

---

## Section: Foto

### Overview
Section untuk mengelola foto-foto utama undangan menggunakan **PhotoPanel**.

**Conditional Logic:** Always visible

### Input Fields

1. **Cover Undangan**
   - **Key:** `_cover_undangan`
   - **Type:** media (image)
   - **Label:** Cover Undangan

2. **Cover Desktop**
   - **Key:** `_cover_desktop`
   - **Type:** media (image)
   - **Label:** Cover Desktop

3. **Cover Opening**
   - **Key:** `_cover_opening`
   - **Type:** media (image)
   - **Label:** Cover Opening

4. **Opening 1**
   - **Key:** `_opening_1`
   - **Type:** media (image)
   - **Label:** Opening 1

5. **Opening 2**
   - **Key:** `_opening_2`
   - **Type:** media (image)
   - **Label:** Opening 2

6. **Opening 3**
   - **Key:** `_opening_3`
   - **Type:** media (image)
   - **Label:** Opening 3

7. **Cover Penutup**
   - **Key:** `_cover_penutup`
   - **Type:** media (image)
   - **Label:** Cover Penutup

### UI/UX Specification

**Desktop Layout (PhotoPanel):**
```
┌─────────────────────────────────────────┐
│ Foto                          [Simpan]  │
├─────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│ │IMG │ │IMG │ │IMG │ │IMG │            │
│ └────┘ └────┘ └────┘ └────┘            │
│ Cover  Desktop Opening Opening          │
│ [Pilih][Pilih] [Pilih] [Pilih]          │
│ [Hapus][Hapus] [Hapus] [Hapus]          │
│                                         │
│ ┌────┐ ┌────┐ ┌────┐                   │
│ │IMG │ │IMG │ │IMG │                   │
│ └────┘ └────┘ └────┘                   │
│ Opening Opening Penutup                 │
│ [Pilih] [Pilih] [Pilih]                 │
│ [Hapus] [Hapus] [Hapus]                 │
└─────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────┐
│ ┌────┐ ┌────┐       │
│ │IMG │ │IMG │       │
│ └────┘ └────┘       │
│ Cover  Desktop      │
│ [Pilih][Pilih]      │
│                     │
│ ┌────┐ ┌────┐       │
│ │IMG │ │IMG │       │
│ └────┘ └────┘       │
│ Opening Opening     │
└─────────────────────┘
```

**Component:** `PhotoPanel`
- Grid layout dengan preview thumbnail
- Button "Pilih" untuk open ImagePickerModal
- Button "Hapus" untuk clear image
- Max file size: 1 MB
- Lazy loading untuk preview

---

## Section: Gallery

### Overview
Section untuk mengelola gallery foto menggunakan **GalleryPanel**. Support multi-upload dan individual slots.

**Conditional Logic:** Visible if `_fitur_galleri` = "1"

### Input Fields

#### 1. Gallery Multi-Upload
- **Key:** `_gallery_undangan`
- **Type:** media (multi-image)
- **Label:** Gallery Multi-Upload
- **Max:** 10 photos
- **Description:** Pilih sekaligus banyak foto dari library

#### 2. Gallery Slots (Individual)
- **Keys:** `_photo_galleri_1` sampai `_photo_galleri_10`
- **Type:** media (image)
- **Label:** Foto Gallery 1-10
- **Description:** Slot individual untuk foto gallery

#### 3. Video Undangan
- **Key:** `_video_undangan`
- **Type:** url
- **Label:** Video Undangan
- **Validation:** YouTube URL
- **Example:** "https://www.youtube.com/watch?v=..."

### UI/UX Specification

**Desktop Layout (GalleryPanel):**
```
┌─────────────────────────────────────────┐
│ Gallery                       [Simpan]  │
├─────────────────────────────────────────┤
│ Foto Galeri                   3 / 10    │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│ │IMG │ │IMG │ │IMG │ │ +  │ │    │     │
│ └────┘ └────┘ └────┘ └────┘ └────┘     │
│ Foto 1 Foto 2 Foto 3 Foto 4 Foto 5     │
│ [Ganti][Ganti][Ganti][Pilih][Pilih]     │
│ [Hapus][Hapus][Hapus]                   │
│                                         │
│ Gallery Multi-Upload          5 / 10    │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│ │IMG │ │IMG │ │IMG │ │IMG │ │IMG │     │
│ │ ×  │ │ ×  │ │ ×  │ │ ×  │ │ ×  │     │
│ └────┘ └────┘ └────┘ └────┘ └────┘     │
│ [+ Tambah Foto]                         │
│                                         │
│ Link Video                              │
│ [https://youtube.com/watch?v=...]       │
└─────────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────┐
│ Gallery Multi       │
│ 5 / 10 Foto         │
│ ┌───┐┌───┐┌───┐     │
│ │IMG││IMG││IMG│     │
│ │ × ││ × ││ × │     │
│ └───┘└───┘└───┘     │
│ ┌───┐┌───┐          │
│ │IMG││ + │          │
│ │ × ││   │          │
│ └───┘└───┘          │
│ [TAMBAH]            │
│                     │
│ Foto Gallery        │
│ 3 / 10              │
│ ┌───┐┌───┐┌───┐     │
│ │IMG││IMG││ + │     │
│ └───┘└───┘└───┘     │
│                     │
│ Link Video          │
│ [URL]               │
└─────────────────────┘
```

**Component:** `GalleryPanel`
- Multi-upload dengan ImagePickerModal (multi-select mode)
- Individual slots dengan single-select mode
- Drag to reorder (future feature)
- Bulk delete untuk multi-upload
- Video URL input dengan validation

---

## Gallery Management System

### Overview
Sistem untuk mengelola library foto undangan dengan fitur upload, organize, search, dan optimization.

### Features

#### 1. Gallery Library Management

**Upload Multiple Images**
- Drag & drop multiple files
- Browse file picker (multi-select)
- Max 10 images per upload batch
- Progress indicator per file
- Error handling per file

**Organize by Invitation**
- Auto-tag dengan invitation ID
- Folder structure: `/media/{user_id}/{invitation_id}/`
- Metadata: upload date, file size, dimensions

**Search & Filter**
- Search by filename
- Filter by invitation ID
- Filter by upload date
- Sort by: date, size, name

**Bulk Operations**
- Select multiple images
- Bulk delete
- Bulk move to another invitation
- Bulk download (ZIP)

#### 2. Image Optimization

**Auto-resize on Upload**
- Max width: 1920px
- Max height: 1080px
- Maintain aspect ratio
- Quality: 85%

**WebP Conversion**
- Convert JPG/PNG to WebP
- Fallback to original format
- Save ~30% file size

**Thumbnail Generation**
- Small: 150x150px (grid view)
- Medium: 300x300px (preview)
- Large: 600x600px (lightbox)

**CDN Integration**
- Upload to CDN after optimization
- Generate CDN URLs
- Cache invalidation on delete

#### 3. Gallery Picker Modal

**Grid View**
- Lazy loading (infinite scroll)
- Thumbnail preview
- Checkbox for multi-select
- Radio button for single-select

**Upload Inline**
- Upload button di modal
- Progress bar
- Auto-add to selection after upload

**Preview Selected**
- Show selected count
- Preview thumbnails di bottom bar
- Remove from selection

**Drag to Reorder**
- Drag selected images to reorder
- Visual feedback (ghost image)
- Save order to meta field

### API Endpoints

#### GET /undangyah/v1/media/library
Fetch gallery library untuk invitation tertentu.

**Request:**
```http
GET /wp-json/undangyah/v1/media/library?invitation_id=123&page=1&per_page=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": 456,
        "url": "https://cdn.undangyah.id/media/1/123/photo1.webp",
        "thumbnail": "https://cdn.undangyah.id/media/1/123/photo1-thumb.webp",
        "filename": "photo1.jpg",
        "size": 245678,
        "width": 1920,
        "height": 1080,
        "uploaded_at": "2026-05-23T10:00:00Z"
      }
    ],
    "total": 45,
    "page": 1,
    "per_page": 20
  }
}
```

#### POST /undangyah/v1/media/upload
Upload multiple images.

**Request:**
```http
POST /wp-json/undangyah/v1/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

invitation_id=123
files[]=@photo1.jpg
files[]=@photo2.jpg
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploaded": [
      {
        "id": 456,
        "url": "https://cdn.undangyah.id/media/1/123/photo1.webp",
        "thumbnail": "https://cdn.undangyah.id/media/1/123/photo1-thumb.webp"
      }
    ],
    "failed": []
  }
}
```

#### DELETE /undangyah/v1/media/bulk-delete
Bulk delete images.

**Request:**
```http
DELETE /wp-json/undangyah/v1/media/bulk-delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "image_ids": [456, 457, 458]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 images deleted successfully."
}
```

---

## Summary

PRD ini mendokumentasikan 12 section editor undangan dengan detail:
- ✅ 100+ input fields dengan validation rules
- ✅ Conditional logic untuk setiap field
- ✅ UI/UX specification (desktop & mobile)
- ✅ Data structure (payload & response)
- ✅ PhotoPanel & GalleryPanel components
- ✅ Gallery Management System (upload, organize, optimize)

**Next Steps:**
1. Implement Gallery Library Management API
2. Build ImagePickerModal dengan multi-select
3. Add image optimization pipeline
4. Integrate CDN for media delivery
5. Add drag-to-reorder untuk gallery

---

**End of Document**
