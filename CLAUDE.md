# Landing Page undangyah.id

## Project Info
- Pure static landing page (HTML + CSS + JS)
- Build tool: Vite (vanilla/vanilla-ts)
- Deploy: build output ke /www/wwwroot/undangyah.id/ (Nginx serves static files)
- Domain: undangyah.id

## Design System
- Warna utama: #1668f2 (biru flat)
- Warna sekunder: #0f172a (dark slate), #f8fafc (light bg)
- Aksen CTA: #f59e0b (amber) untuk highlight
- Font: Plus Jakarta Sans (Google Fonts)
- Border-radius: 16-22px
- TANPA gradasi — flat colors only
- Elegan, modern, minimalis, whitespace generous
- Mobile-first responsive

## Sections yang harus ada
1. Header (nav sticky: logo, menu, CTA login)
2. Hero (headline, sub-headline, 2 CTA buttons, ilustrasi/mockup)
3. Fitur (grid 3 kolom, icon SVG + judul + desc)
4. Pricing (4 kartu: Trial gratis, Basic Rp1.000, Premium Rp80.000, Duluxe Rp125.000)
5. Katalog Tema (grid thumbnail, badge kategori, link demo)
6. FAQ (accordion, 6-8 pertanyaan)
7. Footer (navigasi, social, copyright)

## Pricing Data
- Trial: Rp0 (gratis), 1 hari, 1 undangan → hi.undangyah.id/checkout/nyobian
- Basic: Rp1.000, 1 bulan edit, undangan aktif 3 bulan → hi.undangyah.id/checkout/basic
- Premium: Rp80.000, 1 bulan edit, undangan aktif 6 bulan → hi.undangyah.id/checkout/premium
- Duluxe: Rp125.000, 2 bulan edit, undangan aktif 6 bulan → hi.undangyah.id/checkout/duluxe

## Demo Tema (untuk katalog section)
- Duluxe Art 1: app.undangyah.id/dlx-art1
- Duluxe Art 2: app.undangyah.id/dlx-art2
- Duluxe Art 3: app.undangyah.id/dlx-art3
- Duluxe Art 4: app.undangyah.id/dlx-art4
- Duluxe Art 5: app.undangyah.id/dlx-art5
- Duluxe Xtra 1: app.undangyah.id/dlx-x1
- Duluxe Xtra 2: app.undangyah.id/dlx-x2
- Duluxe Xtra 3: app.undangyah.id/dlx-x3

## SEO
- Title: "Undangyah - Undangan Digital Premium | Buat Undangan Online"
- Description: "Buat undangan digital pernikahan, khitan, ulang tahun dalam hitungan menit. Desain premium, RSVP, buku tamu, kado digital. Mulai gratis!"
- OG Image: buat placeholder atau gunakan screenshot tema

## Post-Build
- Output Vite harus di-deploy ke root /www/wwwroot/undangyah.id/
- Jangan hapus file 404.html yang sudah ada
- Pastikan index.html ada di root setelah build

## Commands
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
