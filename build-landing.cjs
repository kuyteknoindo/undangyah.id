/**
 * build-landing.cjs
 * 
 * SSG script: Fetch landing page sections from API → inject into index.html
 * Replaces: Hero, Fitur, FAQ, Footer sections with dynamic data from API
 * 
 * Usage: node build-landing.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://app.undangyah.id/wp-json/undangyah/v1/landing';
const INDEX_PATH = path.join(__dirname, 'index.html');
const TEMPLATE_PATH = path.join(__dirname, 'index.template.html');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'UndangyahSSG/1.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Section Generators ────────────────────────────────────────────────────────

function generateHeroSection(heroItems) {
  const hero = heroItems[0];
  if (!hero) return '';

  const extra = hero.extra_data || {};

  return `            <section class="section hero" id="hero">
                <span class="corner corner--tl"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <span class="corner corner--tr"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>

                <div class="hero__content">
                    <div class="hero__badge reveal" data-delay="0">
                        <span class="badge">✨ Telah digunakan 500+ pasangan di Indonesia</span>
                    </div>
                    <h1 class="hero__title reveal" data-delay="100">${escapeHtml(hero.title)}</h1>
                    <p class="hero__subtitle reveal" data-delay="200">${escapeHtml(hero.subtitle)}</p>
                    <div class="hero__cta reveal" data-delay="300">
                        <a href="${hero.cta_link}" class="btn-primary btn-glow btn--lg">
                            ${escapeHtml(hero.cta_text)}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                        </a>
                        ${extra.cta2_text ? `<a href="${extra.cta2_link || '#katalog'}" class="btn-outline btn--lg">${escapeHtml(extra.cta2_text)}</a>` : ''}
                    </div>
                </div>
            </section>`;
}

function generateFiturSection(fiturItems) {
  if (!fiturItems.length) return '';

  const cards = fiturItems.map(item => `                    <div class="feature-card reveal">
                        <div class="feature-card__icon">
                            ${item.icon}
                        </div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.content)}</p>
                    </div>`).join('\n');

  return `            <section class="section features" id="fitur">
                <span class="corner corner--tl"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <span class="corner corner--tr"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <div class="section-header reveal">
                    <span class="section-label">FITUR</span>
                    <h2 class="section-title">Fitur Lengkap dalam Satu Undangan</h2>
                    <p class="section-subtitle">Semua kebutuhan undangan pernikahan digital tersedia di sini</p>
                </div>
                <div class="features__grid">
${cards}
                </div>
            </section>`;
}

function generateFaqSection(faqItems) {
  if (!faqItems.length) return '';

  const items = faqItems.map((item, i) => `                    <div class="faq-item reveal">
                        <button class="faq-item__q" aria-expanded="false" aria-controls="faq-${i+1}"><span>${escapeHtml(item.title)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button>
                        <div class="faq-item__a" id="faq-${i+1}"><p>${item.content}</p></div>
                    </div>`).join('\n');

  return `            <section class="section faq" id="faq">
                <span class="corner corner--tl"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <span class="corner corner--tr"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <div class="section-header reveal">
                    <span class="section-label">FAQ</span>
                    <h2 class="section-title">Pertanyaan Umum</h2>
                </div>
                <div class="faq__list">
${items}
                </div>
            </section>`;
}

function generateFooterSection(footerItems) {
  const links = footerItems.map(group => {
    const groupLinks = (group.extra_data && group.extra_data.links) || [];
    const linkHtml = groupLinks.map(l => `<a href="${l.url}">${escapeHtml(l.text)}</a>`).join('\n                        ');
    return linkHtml;
  }).join('\n                        ');

  return `            <footer class="footer">
                <div class="footer__inner">
                    <div class="footer__brand">
                        <img src="https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png" alt="Undangyah" width="110" height="22">
                    </div>
                    <div class="footer__links">
                        ${links}
                    </div>
                    <p class="footer__copy">© ${new Date().getFullYear()} Undangyah. Hak cipta dilindungi.</p>
                </div>
            </footer>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Use template if exists, otherwise use current index.html
  let templatePath = TEMPLATE_PATH;
  if (!fs.existsSync(templatePath)) {
    // First run: save current index.html as template
    console.log('📋 Saving current index.html as template...');
    fs.copyFileSync(INDEX_PATH, TEMPLATE_PATH);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  // Fetch all sections
  console.log('🔄 Fetching sections from API...');
  
  const [heroRaw, fiturRaw, faqRaw, footerRaw] = await Promise.all([
    fetch(`${API_BASE}/sections/hero`),
    fetch(`${API_BASE}/sections/fitur`),
    fetch(`${API_BASE}/sections/faq`),
    fetch(`${API_BASE}/sections/footer`),
  ]);

  const hero = JSON.parse(heroRaw);
  const fitur = JSON.parse(fiturRaw);
  const faq = JSON.parse(faqRaw);
  const footer = JSON.parse(footerRaw);

  console.log(`  Hero: ${hero.length} items`);
  console.log(`  Fitur: ${fitur.length} items`);
  console.log(`  FAQ: ${faq.length} items`);
  console.log(`  Footer: ${footer.length} items`);

  // Replace Hero section
  html = html.replace(
    /<section class="section hero" id="hero">[\s\S]*?<\/section>\s*(?=\s*<!--|\s*<section)/,
    generateHeroSection(hero) + '\n\n'
  );

  // Replace Fitur section
  html = html.replace(
    /<section class="section features" id="fitur">[\s\S]*?<\/section>\s*(?=\s*<!--|\s*<section)/,
    generateFiturSection(fitur) + '\n\n'
  );

  // Replace FAQ section
  html = html.replace(
    /<section class="section faq" id="faq">[\s\S]*?<\/section>\s*(?=\s*<!--|\s*<section)/,
    generateFaqSection(faq) + '\n\n'
  );

  // Footer is now dynamic via footer.js — no static replacement needed

  // Write output
  fs.writeFileSync(INDEX_PATH, html, 'utf-8');
  console.log('\n✅ Landing page updated from API!');
  console.log(`📁 Output: ${INDEX_PATH}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
