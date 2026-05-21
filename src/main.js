const API_BASE = 'https://app.undangyah.id/wp-json/undangyah/v1';

import { initArtikelRouter } from './artikel.js';

// Init artikel SPA router
const isArtikelPage = initArtikelRouter();

// ===== Hamburger Menu =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuCloseBtn = document.getElementById('menuCloseBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  const promoBanner = document.getElementById('promoBanner');
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    if (promoBanner) promoBanner.style.display = 'none';
  });
  menuCloseBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    if (promoBanner) promoBanner.style.display = '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      if (promoBanner) promoBanner.style.display = '';
    });
  });

  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('open');
      if (promoBanner) promoBanner.style.display = '';
    }
  });
}

// ===== Reveal Animations (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const customDelay = el.dataset.delay;
      let delay;

      if (customDelay !== undefined) {
        delay = parseInt(customDelay);
      } else {
        const parent = el.parentElement;
        const siblings = [...parent.querySelectorAll('.reveal')];
        const index = siblings.indexOf(el);
        delay = index * 80;
      }

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Observe all reveal elements, make hero content visible immediately
document.querySelectorAll('.reveal').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    const delay = parseInt(el.dataset.delay || '0');
    setTimeout(() => el.classList.add('visible'), delay);
  } else {
    revealObserver.observe(el);
  }
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
if (navbar) {
  let lastScroll = 0;
  const scrollThreshold = 20;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > scrollThreshold) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// ===== Count-Up Animation =====
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current >= 1000 ? current.toLocaleString('id-ID') + '+' : current + (target >= 100 ? '+' : '');
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number').forEach(el => countObserver.observe(el));

// ===== Promo Banner =====
async function loadPromo() {
  try {
    const res = await fetch(`${API_BASE}/landing/promo`);
    if (!res.ok) return;
    const promos = await res.json();
    if (!Array.isArray(promos) || !promos.length) return;

    const banner = document.getElementById('promoBanner');
    if (!banner) return;

    let currentIndex = 0;
    let countdownInterval = null;

    // Template backgrounds (preset)
    const TEMPLATE_STYLES = {
      gradient: { bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)', color: '#ffffff' },
      minimal: { bg: '#f5f5f5', color: '#0a0a0a' },
      highlight: { bg: '#2563eb', color: '#ffffff' },
      floating: { bg: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', color: '#ffffff' },
      pill: { bg: '#0a0a0a', color: '#ffffff' },
    };

    function startCountdown(endDate) {
      if (countdownInterval) clearInterval(countdownInterval);
      const cdEl = banner.querySelector('.promo-banner__countdown');
      if (!cdEl || !endDate) { if (cdEl) cdEl.style.display = 'none'; return; }

      const target = new Date(endDate).getTime();
      function tick() {
        const now = Date.now();
        if (now >= target) { cdEl.style.display = 'none'; clearInterval(countdownInterval); return; }
        const diff = target - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        cdEl.textContent = `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        cdEl.style.display = '';
      }
      tick();
      countdownInterval = setInterval(tick, 1000);
    }

    function showPromo(promo) {
      const tmpl = promo.template || 'custom';
      const preset = TEMPLATE_STYLES[tmpl];

      // Apply style based on template
      if (preset && tmpl !== 'custom') {
        banner.style.background = preset.bg;
        banner.style.color = preset.color;
      } else {
        banner.style.background = promo.bg_color || '#0f0f11';
        banner.style.color = promo.text_color || '#ffffff';
      }

      // Apply template class
      banner.className = 'promo-banner promo-banner--' + tmpl;

      banner.querySelector('.promo-banner__title').textContent = promo.title || '';
      banner.querySelector('.promo-banner__desc').textContent = promo.description || '';

      // Countdown
      startCountdown(promo.end_date);

      const cta = banner.querySelector('.promo-banner__cta');
      if (promo.type === 'voucher' && promo.voucher_code) {
        cta.textContent = promo.voucher_code;
        cta.href = '#';
        cta.onclick = (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(promo.voucher_code).then(() => {
            cta.textContent = 'Tersalin!';
            setTimeout(() => { cta.textContent = promo.voucher_code; }, 2000);
          }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = promo.voucher_code;
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            cta.textContent = 'Tersalin!';
            setTimeout(() => { cta.textContent = promo.voucher_code; }, 2000);
          });
        };
      } else {
        cta.textContent = promo.cta_text || 'Buat Sekarang';
        cta.href = promo.cta_link || '#';
        cta.onclick = null;
      }
    }

    showPromo(promos[0]);
    banner.style.display = '';

    if (promos.length > 1) {
      setInterval(() => {
        banner.style.opacity = '0';
        banner.style.transition = 'opacity .3s';
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % promos.length;
          showPromo(promos[currentIndex]);
          banner.style.opacity = '1';
        }, 300);
      }, 5000);
    }
  } catch (e) { /* silent */ }
}
loadPromo();

// ===== Pricing =====
function getPricingIcon(slug) {
  const icons = {
    nyobian: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    basic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12l-2-4z"/></svg>',
    premium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
    duluxe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12H2z"/><circle cx="9" cy="20" r="2"/><circle cx="15" cy="20" r="2"/><path d="M5 8l2 4M12 4v8M19 8l-2 4"/></svg>'
  };
  return icons[slug] || icons.basic;
}

async function loadPricing() {
  try {
    await loadPricingFeatures();
    const res = await fetch(`${API_BASE}/landing/pricing`);
    const products = await res.json();
    const grid = document.getElementById('pricingGrid');
    if (!grid || !products.length) return;

    const filtered = products.filter(p => {
      const slug = p.slug?.toLowerCase();
      return slug !== 'reseller' && slug !== 'kontributor';
    });

    grid.innerHTML = filtered.map((p) => {
      const isPopular = p.slug === 'premium';
      const isFree = p.price === 0;
      const duration = p.membership_type === 'trial'
        ? `${p.membership_duration} hari`
        : `${p.membership_duration} bulan edit · aktif ${p.invitation_duration} bulan`;

      const features = getFeatures(p.slug);
      const discount = p.slug === 'duluxe' ? '20% off' : p.slug === 'premium' ? '10% off' : '';

      return `
        <div class="pricing-card${isPopular ? ' pricing-card--popular' : ''} reveal">
          ${isPopular ? '<div class="pricing-card__badge">POPULER</div>' : ''}
          <div class="pricing-card__icon">${getPricingIcon(p.slug)}</div>
          <div class="pricing-card__header">
            <h3>${p.title}</h3>
            <div class="pricing-card__price">
              ${isFree ? '' : '<span class="price-currency">Rp</span>'}
              <span class="price-amount">${isFree ? 'Gratis' : p.price.toLocaleString('id-ID')}</span>
              ${discount ? `<span class="pricing-card__discount">${discount}</span>` : ''}
            </div>
            <p class="pricing-card__duration">${duration}</p>
          </div>
          <a href="${p.checkout_url}" class="pricing-card__cta${isPopular ? '' : ' pricing-card__cta--outline'}">
            ${isFree ? 'Coba Gratis' : `Pilih Paket ${p.title}`}
          </a>
          <p class="pricing-card__features-label">Fitur yang tersedia:</p>
          <ul class="pricing-card__features">
            ${features.map(f => `<li class="${f.on ? '' : 'disabled'}">${f.label}</li>`).join('')}
          </ul>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Scroll dots indicator (mobile)
    initPricingDots(grid);
  } catch (e) { /* silent */ }
}

function initPricingDots(grid) {
  const dotsContainer = document.getElementById('pricingDots');
  const hintText = document.querySelector('.pricing__scroll-hint-text');
  if (!dotsContainer) return;

  const cards = grid.querySelectorAll('.pricing-card');
  dotsContainer.innerHTML = Array.from(cards).map((_, i) =>
    `<span class="pricing__dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
  ).join('');

  // Click handler — scroll to card
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.pricing__dot');
    if (!dot) return;
    const index = parseInt(dot.dataset.index, 10);
    const cardWidth = cards[0].offsetWidth + 16;
    grid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  });

  let scrollTimeout;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = grid.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 16; // gap
      const activeIndex = Math.round(scrollLeft / cardWidth);
      dotsContainer.querySelectorAll('.pricing__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
      // Hide hint text after first scroll
      if (hintText && scrollLeft > 20) {
        hintText.style.display = 'none';
      }
    }, 50);
  }, { passive: true });
}

let pricingFeaturesData = [];

async function loadPricingFeatures() {
  try {
    const res = await fetch(`${API_BASE}/landing/pricing-features`);
    pricingFeaturesData = await res.json();
  } catch (e) { /* silent - will use empty */ }
}

function getFeatures(slug) {
  if (!pricingFeaturesData.length) {
    // Fallback hardcoded jika API gagal
    return [
      { label: '1 Undangan', on: true },
      { label: 'RSVP & Buku Tamu', on: true },
      { label: 'Galeri Foto', on: true },
      { label: 'Musik Latar', on: slug !== 'nyobian' },
      { label: 'Kado Digital', on: slug === 'premium' || slug === 'duluxe' },
      { label: 'Tanpa Watermark', on: slug !== 'nyobian' },
      { label: 'Semua Tema', on: slug === 'duluxe' },
    ];
  }
  return pricingFeaturesData.map(f => ({
    label: f.label,
    on: f.slugs.includes(slug),
  }));
}
loadPricing();

// ===== Catalog =====
const CATALOG_INITIAL = window.innerWidth >= 768 ? 12 : 6;
let catalogItems = [];
let catalogCategory = 'all';
let catalogShowAll = false;

async function loadCatalog() {
  try {
    const res = await fetch(`${API_BASE}/landing/catalog`);
    catalogItems = await res.json();
    const grid = document.getElementById('catalogGrid');
    if (!grid || !catalogItems.length) return;

    renderCatalog();
    initCatalogTabs();
  } catch (e) { /* silent */ }
}

function getFilteredItems() {
  if (catalogCategory === 'all') return catalogItems;
  return catalogItems.filter(t => t.category === catalogCategory);
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const loadMoreBtn = document.getElementById('catalogLoadMore');
  const filtered = getFilteredItems();
  const visible = catalogShowAll ? filtered : filtered.slice(0, CATALOG_INITIAL);

  grid.innerHTML = visible.map((tema) => {
    const thumb = tema.thumbnail_url
      ? `<img src="${tema.thumbnail_url}" alt="${tema.title}" loading="lazy">`
      : `<div style="width:100%;height:100%;background:var(--card-bg)"></div>`;

    return `
      <a href="${tema.demo_url}" target="_blank" class="catalog-card reveal">
        <div class="catalog-card__preview">${thumb}</div>
        <div class="catalog-card__info">
          <span class="catalog-card__title">${tema.title.replace('Tema undangan ', '')}</span>
          <span class="catalog-card__badge">${tema.category || 'Duluxe'}</span>
        </div>
      </a>
    `;
  }).join('');

  // Show/hide load more button
  if (filtered.length > CATALOG_INITIAL && !catalogShowAll) {
    loadMoreBtn.style.display = '';
    loadMoreBtn.textContent = `Tampilkan Semua`;
  } else {
    loadMoreBtn.style.display = 'none';
  }

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function initCatalogTabs() {
  const tabs = document.querySelectorAll('.catalog__tab');
  const loadMoreBtn = document.getElementById('catalogLoadMore');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      catalogCategory = tab.dataset.category;
      catalogShowAll = false;
      renderCatalog();
    });
  });

  loadMoreBtn.addEventListener('click', () => {
    catalogShowAll = true;
    renderCatalog();
  });
}
loadCatalog();

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== Testimonial carousel (auto-rotate 1 card at a time on mobile) =====
const testimonialTrack = document.querySelector('.testimonials__track');
if (testimonialTrack && window.innerWidth <= 768) {
  const cards = testimonialTrack.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  cards[0].classList.add('active');

  setInterval(() => {
    const prevCard = cards[currentIndex];
    prevCard.classList.remove('active');
    prevCard.classList.add('prev');
    currentIndex = (currentIndex + 1) % cards.length;
    const nextCard = cards[currentIndex];
    nextCard.classList.remove('prev');
    nextCard.classList.add('active');
    setTimeout(() => prevCard.classList.remove('prev'), 500);
  }, 3500);
}

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 10
    ? 'rgba(255,255,255,0.95)'
    : 'rgba(255,255,255,0.92)';
}, { passive: true });

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Back to Top =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
