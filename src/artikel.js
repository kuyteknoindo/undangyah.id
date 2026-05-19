// ===== Artikel SPA Router =====
// Handles /artikel/ (list) and /artikel/{slug} (single) routes

const API_BASE = 'https://app.undangyah.id/wp-json/weddingsaas/v1';

export function initArtikelRouter() {
  const path = window.location.pathname;

  if (path === '/artikel' || path === '/artikel/') {
    renderArtikelList();
    return true;
  }

  const match = path.match(/^\/artikel\/([a-zA-Z0-9-]+)\/?$/);
  if (match) {
    renderArtikelSingle(match[1]);
    return true;
  }

  return false;
}

async function renderArtikelList() {
  const boxed = document.querySelector('.boxed');
  if (!boxed) return;

  // Hide homepage sections, keep navbar
  hideHomeSections();
  document.title = 'Artikel - Tips & Inspirasi Pernikahan | Undangyah';
  updateMeta('description', 'Artikel dan tips seputar undangan pernikahan digital, inspirasi dekorasi, dan panduan persiapan pernikahan.');
  updateSEOForList();

  // Remove existing artikel page if any
  const existing = boxed.querySelector('.artikel-page');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.className = 'artikel-page';
  container.innerHTML = `
    <section class="section artikel-section">
      <div class="section-header">
        <span class="section-label">ARTIKEL</span>
        <h1 class="section-title">Tips & Inspirasi Pernikahan</h1>
        <p class="section-subtitle">Panduan lengkap untuk mempersiapkan hari istimewa Anda</p>
      </div>
      <div class="artikel__grid" id="artikelGrid">
        <div class="artikel-skeleton"></div>
        <div class="artikel-skeleton"></div>
        <div class="artikel-skeleton"></div>
        <div class="artikel-skeleton"></div>
        <div class="artikel-skeleton"></div>
        <div class="artikel-skeleton"></div>
      </div>
      <div class="artikel__pagination" id="artikelPagination"></div>
    </section>
  `;

  boxed.querySelector('.navbar').insertAdjacentElement('afterend', container);
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page') || '1');

  try {
    const res = await fetch(`${API_BASE}/landing/articles?page=${page}&per_page=9`);
    const json = await res.json();

    const grid = document.getElementById('artikelGrid');
    if (!grid) return;

    if (!json.data || json.data.length === 0) {
      grid.innerHTML = '<p class="artikel__empty">Belum ada artikel yang tersedia.</p>';
      return;
    }

    grid.innerHTML = json.data.map(article => `
      <a href="/artikel/${article.slug}" class="artikel-card" data-artikel-link>
        <div class="artikel-card__img">
          ${article.featured_image
            ? `<img src="${article.featured_image}" alt="${article.title}" loading="lazy">`
            : `<div class="artikel-card__placeholder"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`
          }
        </div>
        <div class="artikel-card__body">
          <time class="artikel-card__date">${formatDate(article.date)}</time>
          <h2 class="artikel-card__title">${article.title}</h2>
          <p class="artikel-card__excerpt">${article.excerpt}</p>
        </div>
      </a>
    `).join('');

    // Pagination
    if (json.total_pages > 1) {
      const pagination = document.getElementById('artikelPagination');
      if (pagination) {
        let html = '';
        for (let i = 1; i <= json.total_pages; i++) {
          html += `<a href="/artikel/?page=${i}" class="artikel__page-btn ${i === page ? 'active' : ''}">${i}</a>`;
        }
        pagination.innerHTML = html;
      }
    }

    // Intercept article links for SPA navigation
    grid.querySelectorAll('[data-artikel-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        initArtikelRouter();
      });
    });

  } catch (e) {
    const grid = document.getElementById('artikelGrid');
    if (grid) grid.innerHTML = '<p class="artikel__empty">Gagal memuat artikel. Silakan coba lagi.</p>';
  }
}

async function renderArtikelSingle(slug) {
  const boxed = document.querySelector('.boxed');
  if (!boxed) return;

  hideHomeSections();

  // Remove existing artikel page if any
  const existing = boxed.querySelector('.artikel-page');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.className = 'artikel-page artikel-single';
  container.innerHTML = `
    <section class="section artikel-section">
      <div class="artikel-single__loading">Memuat artikel...</div>
    </section>
  `;

  boxed.querySelector('.navbar').insertAdjacentElement('afterend', container);

  try {
    const res = await fetch(`${API_BASE}/landing/articles/${slug}`);
    if (!res.ok) throw new Error('Not found');
    const article = await res.json();

    document.title = `${article.title} - Undangyah`;
    updateMeta('description', article.excerpt);
    updateSEOForArticle(article);

    container.innerHTML = `
      <section class="section artikel-section">
        <article class="artikel-single__content">
          <a href="/artikel/" class="artikel-single__back" data-back-link>← Kembali ke Artikel</a>
          <header class="artikel-single__header">
            <h1 class="artikel-single__title">${article.title}</h1>
            <div class="artikel-single__meta">
              <time>${formatDate(article.date)}</time>
              <span>oleh ${article.author_name}</span>
            </div>
          </header>
          ${article.featured_image ? `<img src="${article.featured_image}" alt="${article.title}" class="artikel-single__featured">` : ''}
          <div class="artikel-single__body">${article.content}</div>
          <footer class="artikel-single__footer">
            <a href="/artikel/" class="btn-outline" data-back-link>← Lihat Artikel Lainnya</a>
          </footer>
        </article>
      </section>
    `;

    // SPA back links
    container.querySelectorAll('[data-back-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/artikel/');
        initArtikelRouter();
      });
    });

  } catch (e) {
    container.innerHTML = `
      <section class="section artikel-section">
        <div class="artikel-single__content">
          <a href="/artikel/" class="artikel-single__back" data-back-link>← Kembali ke Artikel</a>
          <h1 class="section-title">Artikel Tidak Ditemukan</h1>
          <p>Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
        </div>
      </section>
    `;
    container.querySelector('[data-back-link]')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState({}, '', '/artikel/');
      initArtikelRouter();
    });
  }
}

function hideHomeSections() {
  // Hide all homepage sections except header/nav
  document.querySelectorAll('.boxed-wrapper > .boxed > .section').forEach(el => {
    el.style.display = 'none';
  });
  // Keep header visible
  const header = document.querySelector('.header');
  if (header) header.style.display = '';
  // Hide footer
  const footer = document.querySelector('.footer');
  if (footer) footer.style.display = 'none';
  // Hide promo banner
  const promo = document.getElementById('promoBanner');
  if (promo) promo.style.display = 'none';
}

function showHomeSections() {
  document.querySelectorAll('.boxed-wrapper > .boxed > .section').forEach(el => {
    el.style.display = '';
  });
  const promo = document.getElementById('promoBanner');
  if (promo) promo.style.display = '';
  // Show footer
  const footer = document.querySelector('.footer');
  if (footer) footer.style.display = '';
  // Remove artikel page
  const artikelPage = document.querySelector('.artikel-page');
  if (artikelPage) artikelPage.remove();
  // Reset SEO to homepage
  resetSEOForHome();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function updateMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  }
}

function updateOG(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  }
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (link) link.setAttribute('href', url);
}

function injectArticleSchema(article) {
  // Remove existing article schema
  const existing = document.getElementById('article-jsonld');
  if (existing) existing.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featured_image || "https://undangyah.id/og-image.png",
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {"@type": "Organization", "name": article.author_name || "Undangyah"},
    "publisher": {
      "@type": "Organization",
      "name": "Undangyah",
      "url": "https://undangyah.id",
      "logo": {"@type": "ImageObject", "url": "https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png"}
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://undangyah.id/artikel/${article.slug}`
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'article-jsonld';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeArticleSchema() {
  const existing = document.getElementById('article-jsonld');
  if (existing) existing.remove();
}

function updateSEOForList() {
  const url = 'https://undangyah.id/artikel/';
  updateCanonical(url);
  updateOG('og:url', url);
  updateOG('og:title', 'Artikel - Tips & Inspirasi Pernikahan | Undangyah');
  updateOG('og:description', 'Artikel dan tips seputar undangan pernikahan digital, inspirasi dekorasi, dan panduan persiapan pernikahan.');
  updateOG('og:type', 'website');
  updateOG('og:image', 'https://undangyah.id/og-image.png');
  updateMeta('twitter:title', 'Artikel - Tips & Inspirasi Pernikahan | Undangyah');
  updateMeta('twitter:description', 'Artikel dan tips seputar undangan pernikahan digital, inspirasi dekorasi, dan panduan persiapan pernikahan.');
  updateMeta('twitter:image', 'https://undangyah.id/og-image.png');
  removeArticleSchema();
}

function updateSEOForArticle(article) {
  const url = `https://undangyah.id/artikel/${article.slug}`;
  updateCanonical(url);
  updateOG('og:url', url);
  updateOG('og:title', `${article.title} - Undangyah`);
  updateOG('og:description', article.excerpt);
  updateOG('og:type', 'article');
  updateOG('og:image', article.featured_image || 'https://undangyah.id/og-image.png');
  updateMeta('twitter:title', `${article.title} - Undangyah`);
  updateMeta('twitter:description', article.excerpt);
  updateMeta('twitter:image', article.featured_image || 'https://undangyah.id/og-image.png');
  injectArticleSchema(article);
}

function resetSEOForHome() {
  updateCanonical('https://undangyah.id/');
  updateOG('og:url', 'https://undangyah.id/');
  updateOG('og:title', 'Undangyah - Undangan Digital Pernikahan Premium');
  updateOG('og:description', 'Buat undangan digital pernikahan dalam 5 menit. Desain premium, RSVP, buku tamu, kado digital, kirim melalui WhatsApp. Mulai gratis.');
  updateOG('og:type', 'website');
  updateOG('og:image', 'https://undangyah.id/og-image.png');
  updateMeta('twitter:title', 'Undangyah - Undangan Digital Pernikahan Premium');
  updateMeta('twitter:description', 'Buat undangan digital pernikahan dalam 5 menit. Desain premium, RSVP, buku tamu, kado digital, kirim melalui WhatsApp. Mulai gratis.');
  updateMeta('twitter:image', 'https://undangyah.id/og-image.png');
  removeArticleSchema();
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  if (path.startsWith('/artikel')) {
    initArtikelRouter();
  } else {
    showHomeSections();
    document.title = 'Undangyah - Undangan Digital Pernikahan Premium | Buat Undangan Online';
  }
});

// Intercept navbar anchor links when on artikel page
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  // Only intercept if we're on artikel page
  const artikelPage = document.querySelector('.artikel-page');
  if (!artikelPage) return;

  e.preventDefault();
  const hash = link.getAttribute('href');
  showHomeSections();
  window.history.pushState({}, '', '/' + hash);
  document.title = 'Undangyah - Undangan Digital Pernikahan Premium | Buat Undangan Online';

  // Scroll to section after showing
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, 50);
});

// Intercept logo click to go home
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href="/"]');
  if (!link) return;

  const artikelPage = document.querySelector('.artikel-page');
  if (!artikelPage) return;

  e.preventDefault();
  showHomeSections();
  window.history.pushState({}, '', '/');
  document.title = 'Undangyah - Undangan Digital Pernikahan Premium | Buat Undangan Online';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
