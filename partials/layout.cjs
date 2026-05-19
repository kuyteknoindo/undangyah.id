/**
 * Shared layout partials for undangyah.id static pages.
 * Reusable navbar, mobile menu, footer, and page wrapper.
 * 
 * Usage in prerender scripts:
 *   const { pageHeader, pageFooter, pageScripts } = require('./partials/layout');
 *   const html = pageHeader({ title, description, canonical, activeNav }) + content + pageFooter() + pageScripts();
 */

const LOGO_URL = 'https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png';
const FAVICON_URL = 'https://app.undangyah.id/wp-content/uploads/2025/04/undangyah-ico.png';
const CSS_PATH = '/assets/index-SVDx_7Tv.css';
const WA_LINK = 'https://wa.me/62859106967901';

const NAV_LINKS = [
  { href: '/#fitur', label: 'Fitur' },
  { href: '/#harga', label: 'Harga' },
  { href: '/#katalog', label: 'Katalog' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/artikel/', label: 'Artikel' },
];

/**
 * Generate page header (doctype through opening content area)
 * @param {Object} opts
 * @param {string} opts.title - Page title
 * @param {string} opts.description - Meta description
 * @param {string} opts.canonical - Canonical URL
 * @param {string} [opts.activeNav] - Active nav label (e.g. 'Artikel')
 * @param {string} [opts.extraHead] - Extra HTML for <head> (structured data, etc.)
 * @param {string} [opts.extraStyles] - Extra <style> block content
 */
function pageHeader({ title, description, canonical, activeNav = '', extraHead = '', extraStyles = '' }) {
  const navLinksHtml = NAV_LINKS.map(link => 
    `<a href="${link.href}"${link.label === activeNav ? ' class="active"' : ''}>${link.label}</a>`
  ).join('\n                    ');

  const mobileNavHtml = NAV_LINKS.map(link =>
    `<a href="${link.href}"${link.label === activeNav ? ' class="active"' : ''}>${link.label}</a>`
  ).join('\n                    ');

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonical}">
    <meta property="og:locale" content="id_ID">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="Undangyah">
    <link rel="icon" type="image/png" href="${FAVICON_URL}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${CSS_PATH}">
${extraHead ? '    ' + extraHead + '\n' : ''}${extraStyles ? '    <style>\n' + extraStyles + '\n    </style>\n' : ''}</head>
<body>
    <div class="bg-grid" aria-hidden="true"></div>
    <main id="main-content">
    <div class="boxed-wrapper">
        <div class="boxed">

            <!-- Navbar -->
            <header class="navbar" id="navbar">
                <a href="/" class="navbar__logo">
                    <img src="${LOGO_URL}" alt="Undangyah" height="24">
                </a>
                <nav class="navbar__links">
                    ${navLinksHtml}
                </nav>
                <div class="navbar__actions">
                    <a href="https://hi.undangyah.id" class="btn-ghost">Login</a>
                    <a href="https://hi.undangyah.id/checkout/nyobian" class="btn-primary btn-glow">Buat Undangan</a>
                    <button class="navbar__hamburger" id="hamburgerBtn" aria-label="Menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                </div>
            </header>

            <!-- Mobile Menu Overlay -->
            <div class="mobile-menu" id="mobileMenu">
                <div class="mobile-menu__header">
                    <a href="/" class="navbar__logo">
                        <img src="${LOGO_URL}" alt="Undangyah" height="24">
                    </a>
                    <button class="mobile-menu__close" id="menuCloseBtn" aria-label="Tutup">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <nav class="mobile-menu__nav">
                    ${mobileNavHtml}
                </nav>
                <div class="mobile-menu__actions">
                    <a href="https://hi.undangyah.id" class="btn-outline" style="width:100%;justify-content:center">Login</a>
                    <a href="https://hi.undangyah.id/checkout/nyobian" class="btn-primary btn-glow" style="width:100%;justify-content:center">Buat Undangan</a>
                </div>
            </div>

`;
}

/**
 * Generate page footer (footer + closing tags)
 */
function pageFooter() {
  const footerLinks = [
    ...NAV_LINKS,
    { href: WA_LINK, label: 'WhatsApp', external: true },
  ];

  const linksHtml = footerLinks.map(link => {
    const attrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${link.href}"${attrs}>${link.label}</a>`;
  }).join('\n                        ');

  return `
            <!-- Footer -->
            <footer class="footer">
                <div class="footer__inner">
                    <div class="footer__brand">
                        <img src="${LOGO_URL}" alt="Undangyah" height="22">
                    </div>
                    <div class="footer__links">
                        ${linksHtml}
                    </div>
                    <p class="footer__copy">© ${new Date().getFullYear()} Undangyah. Hak cipta dilindungi.</p>
                </div>
            </footer>

        </div>
    </div>
    </main>
`;
}

/**
 * Generate page scripts (mobile menu + back to top)
 */
function pageScripts(extraScripts = '') {
  return `    <script>
    document.getElementById('hamburgerBtn').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
    document.getElementById('menuCloseBtn').addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open'));
    </script>
${extraScripts ? extraScripts + '\n' : ''}</body>
</html>`;
}

module.exports = { pageHeader, pageFooter, pageScripts, LOGO_URL, FAVICON_URL, CSS_PATH, WA_LINK, NAV_LINKS };
