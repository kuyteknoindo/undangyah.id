/**
 * prerender-articles.cjs
 * 
 * Fetch artikel dari WP REST API → generate static HTML:
 * - /artikel/index.html (listing page dengan client-side pagination)
 * - /artikel/{slug}/index.html (individual article pages)
 * 
 * Usage: node prerender-articles.cjs
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://app.undangyah.id/wp-json/undangyah/v1/landing';
const ARTIKEL_DIR = path.join(__dirname, 'artikel');
const TEMPLATE_PATH = path.join(ARTIKEL_DIR, '_template.html');
const PER_PAGE = 100; // fetch all at once for static generation

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'UndangyahSSG/1.0' } }, (res) => {
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

async function fetchAllArticles() {
  let all = [];
  let page = 1;
  while (true) {
    const url = `${API_BASE}/articles?per_page=${PER_PAGE}&page=${page}`;
    console.log(`  Fetching ${url}`);
    const raw = await fetch(url);
    const json = JSON.parse(raw);
    all = all.concat(json.data);
    if (page >= json.total_pages) break;
    page++;
  }
  return all;
}

async function fetchArticleContent(slug) {
  const url = `${API_BASE}/articles/${slug}`;
  const raw = await fetch(url);
  return JSON.parse(raw);
}

function formatDate(dateStr) {
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Generate Listing Page ─────────────────────────────────────────────────────

function generateListingPage(articles) {
  const hero = articles[0];
  const heroSidebar = articles.slice(1, 6);
  
  // All articles except hero for the list
  const listArticles = articles.slice(1);
  
  // Popular = first 6 (by date, newest first — API already sorted)
  const popular = articles.slice(0, 6);

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tips & Inspirasi Pernikahan - Undangyah</title>
    <meta name="description" content="Kumpulan artikel tips pernikahan, undangan digital, dekorasi, catering, dan inspirasi untuk hari istimewa Anda.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://undangyah.id/artikel/">
    <link rel="icon" type="image/png" href="https://app.undangyah.id/wp-content/uploads/2025/04/undangyah-ico.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/index-SVDx_7Tv.css">
    <style>
      .artikel-page{padding:48px 48px 64px}
      .blog-header{margin-bottom:32px}
      .blog-header h1{font-size:1.8rem;font-weight:700;margin-bottom:4px}
      .blog-header p{color:#64748b;font-size:.95rem}
      .hero-section{display:grid;grid-template-columns:60% 1fr;gap:20px;margin-bottom:48px}
      .hero-main{position:relative;border-radius:14px;overflow:hidden;background:#fff;border:1px solid #e2e8f0}
      .hero-main a{text-decoration:none;color:#1e293b;display:block}
      .hero-main img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
      .hero-main .hero-content{padding:20px 24px}
      .hero-main .hero-content h2{font-size:1.3rem;font-weight:700;line-height:1.3;margin-bottom:8px}
      .hero-main .hero-content .date{font-size:.75rem;color:#64748b;margin-bottom:8px}
      .hero-main .hero-content .excerpt{font-size:.85rem;color:#64748b;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .hero-sidebar{display:flex;flex-direction:column;gap:10px}
      .hero-sidebar-item{display:flex;gap:10px;align-items:center;text-decoration:none;color:#1e293b;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px;transition:transform .2s}
      .hero-sidebar-item:hover{transform:translateY(-2px)}
      .hero-sidebar-item img{width:80px;min-width:80px;height:54px;object-fit:cover;border-radius:6px}
      .hero-sidebar-item div{display:flex;flex-direction:column;gap:2px}
      .hero-sidebar-item h3{font-size:.8rem;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .article-list-wrap{display:grid;grid-template-columns:65% 35%;gap:32px;align-items:start}
      .article-list{display:flex;flex-direction:column;gap:20px}
      .article-item{display:flex;gap:16px;align-items:flex-start;text-decoration:none;color:#1e293b;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;transition:transform .2s}
      .article-item:hover{transform:translateY(-2px)}
      .article-item img{width:150px;min-width:150px;height:100px;object-fit:cover;border-radius:10px}
      .article-item .item-content{display:flex;flex-direction:column;gap:6px;flex:1}
      .article-item .item-content h3{font-size:.95rem;font-weight:600;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .article-item .item-content .excerpt{font-size:.82rem;color:#64748b;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .article-item .item-content .date{font-size:.72rem;color:#94a3b8}
      .sidebar{position:sticky;top:80px}
      .sidebar-box{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px}
      .sidebar-box h4{font-size:.95rem;font-weight:700;margin-bottom:16px;color:#0f172a}
      .popular-list{list-style:none;display:flex;flex-direction:column;gap:14px;padding:0;margin:0}
      .popular-list li{display:flex;gap:12px;align-items:flex-start}
      .popular-list li .num{font-size:1.1rem;font-weight:700;color:#1668f2;min-width:20px}
      .popular-list li a{text-decoration:none;color:#1e293b;font-size:.85rem;font-weight:500;line-height:1.4;transition:color .2s}
      .popular-list li a:hover{color:#1668f2}
      .pagination-wrap{text-align:left;margin-top:32px;display:flex;flex-wrap:wrap;gap:4px}
      .page-btn{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;padding:0 10px;border-radius:8px;text-decoration:none;font-size:.85rem;font-weight:600;color:#64748b;background:#fff;border:1px solid #e2e8f0;transition:all .2s;cursor:pointer}
      .page-btn:hover{color:#1668f2;border-color:#1668f2}
      .page-btn.active{background:#1668f2;color:#fff;border-color:#1668f2}
      .page-ellipsis{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;color:#64748b;font-size:.85rem}
      @media(max-width:768px){.artikel-page{padding:32px 20px 48px}.hero-section{grid-template-columns:1fr;gap:16px}.hero-main img{aspect-ratio:2/1;max-height:200px}.hero-sidebar{flex-direction:column}.article-list-wrap{grid-template-columns:1fr;gap:24px}.article-item img{width:110px;min-width:110px;height:74px}.sidebar{position:static}.pagination-wrap{justify-content:center}}
      @media(max-width:480px){.hero-main .hero-content h2{font-size:1.1rem}.article-item{flex-direction:column}.article-item img{width:100%;min-width:unset;height:auto;aspect-ratio:3/2}}
    </style>
</head>
<body>
    <div class="bg-grid"></div>
    <main id="main-content">
    <div class="boxed-wrapper">
        <div class="boxed">
            <header class="navbar" id="navbar">
                <a href="/" class="navbar__logo"><img src="https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png" alt="Undangyah" height="24"></a>
                <nav class="navbar__links">
                    <a href="/#fitur">Fitur</a><a href="/#harga">Harga</a><a href="/#katalog">Katalog</a><a href="/#faq">FAQ</a><a href="/artikel/" class="active">Artikel</a>
                </nav>
                <div class="navbar__actions">
                    <a href="https://hi.undangyah.id" class="btn-ghost">Login</a>
                    <a href="https://hi.undangyah.id/checkout/nyobian" class="btn-primary btn-glow">Buat Undangan</a>
                    <button class="navbar__hamburger" id="hamburgerBtn" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
                </div>
            </header>
            <div class="mobile-menu" id="mobileMenu">
                <div class="mobile-menu__header">
                    <a href="/" class="navbar__logo"><img src="https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png" alt="Undangyah" height="24"></a>
                    <button class="mobile-menu__close" id="menuCloseBtn" aria-label="Tutup"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <nav class="mobile-menu__nav">
                    <a href="/#fitur">Fitur</a><a href="/#harga">Harga</a><a href="/#katalog">Katalog</a><a href="/#faq">FAQ</a><a href="/artikel/" class="active">Artikel</a>
                </nav>
                <div class="mobile-menu__actions">
                    <a href="https://hi.undangyah.id" class="btn-outline" style="width:100%;justify-content:center">Login</a>
                    <a href="https://hi.undangyah.id/checkout/nyobian" class="btn-primary btn-glow" style="width:100%;justify-content:center">Buat Undangan</a>
                </div>
            </div>
            <section class="section artikel-page">
                <span class="corner corner--tl"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <span class="corner corner--tr"><svg width="14" height="20" viewBox="0 0 14 20" fill="none"><path d="M1 0V20M1 10H14" stroke="#000" stroke-width="2"/></svg></span>
                <div class="blog-header">
                    <h1>Tips & Inspirasi Pernikahan</h1>
                    <p>Panduan lengkap untuk mempersiapkan hari istimewa Anda</p>
                </div>
                <section class="hero-section">
                    <div class="hero-main">
                        <a href="/artikel/${hero.slug}">
                            <img src="${hero.featured_image}" alt="${escapeHtml(hero.title)}" width="768" height="403" loading="eager">
                            <div class="hero-content">
                                <h2>${escapeHtml(hero.title)}</h2>
                                <span class="date">${formatDate(hero.date)}</span>
                                <p class="excerpt">${escapeHtml(hero.excerpt)}</p>
                            </div>
                        </a>
                    </div>
                    <div class="hero-sidebar">
${heroSidebar.map(a => `                        <a href="/artikel/${a.slug}" class="hero-sidebar-item">
                            <img src="${a.featured_image}" alt="${escapeHtml(a.title)}" width="80" height="54" loading="lazy">
                            <div><h3>${escapeHtml(a.title)}</h3></div>
                        </a>`).join('\n')}
                    </div>
                </section>
                <section class="article-list-wrap">
                    <div class="article-list">
${listArticles.map(a => `                        <a href="/artikel/${a.slug}" class="article-item">
                            <img src="${a.featured_image}" alt="${escapeHtml(a.title)}" width="150" height="100" loading="lazy">
                            <div class="item-content">
                                <h3>${escapeHtml(a.title)}</h3>
                                <p class="excerpt">${escapeHtml(a.excerpt)}</p>
                                <span class="date">${formatDate(a.date)}</span>
                            </div>
                        </a>`).join('\n')}
                        <div class="pagination-wrap" id="pagination"></div>
                    </div>
                    <aside class="sidebar">
                        <div class="sidebar-box">
                            <h4>Artikel Populer</h4>
                            <ol class="popular-list">
${popular.map((a, i) => `                                <li><span class="num">${i+1}</span><a href="/artikel/${a.slug}">${escapeHtml(a.title)}</a></li>`).join('\n')}
                            </ol>
                        </div>
                    </aside>
                </section>
            </section>

            <!-- Footer (dynamic via footer.js) -->
            <footer class="footer"></footer>
            <script src="/footer.js?v=20260519"></script>

        </div>
    </div>
    </main>
    <script>
    // Mobile menu
    document.getElementById('hamburgerBtn').addEventListener('click',()=>document.getElementById('mobileMenu').classList.add('open'));
    document.getElementById('menuCloseBtn').addEventListener('click',()=>document.getElementById('mobileMenu').classList.remove('open'));
    // Client-side pagination
    (function(){
      var PER_PAGE=5;
      var items=Array.from(document.querySelectorAll('.article-list > .article-item'));
      var pages=Math.ceil(items.length/PER_PAGE)||1;
      function getPage(){var p=parseInt(new URLSearchParams(window.location.search).get('page')||'1',10);return isNaN(p)||p<1?1:Math.min(p,pages)}
      function renderPage(page){
        var start=(page-1)*PER_PAGE,end=start+PER_PAGE;
        items.forEach(function(item,i){item.style.display=(i>=start&&i<end)?'':'none'});
        var wrap=document.getElementById('pagination');
        if(pages<=1){wrap.innerHTML='';return}
        var html='';
        if(page>1)html+='<a class="page-btn" href="?page='+(page-1)+'">&laquo;</a>';
        for(var i=1;i<=pages;i++){
          if(i===1||i===pages||Math.abs(i-page)<=1){
            html+='<a class="page-btn'+(i===page?' active':'')+'" href="?page='+i+'">'+i+'</a>';
          }else if(i===2&&page>3){html+='<span class="page-ellipsis">…</span>'}
          else if(i===pages-1&&page<pages-2){html+='<span class="page-ellipsis">…</span>'}
        }
        if(page<pages)html+='<a class="page-btn" href="?page='+(page+1)+'">&raquo;</a>';
        wrap.innerHTML=html;
        wrap.querySelectorAll('.page-btn').forEach(function(btn){
          btn.addEventListener('click',function(e){e.preventDefault();var p=parseInt(this.href.split('page=')[1]);history.pushState(null,'','?page='+p);renderPage(p);window.scrollTo({top:document.querySelector('.article-list-wrap').offsetTop-80,behavior:'smooth'})});
        });
      }
      renderPage(getPage());
      window.addEventListener('popstate',function(){renderPage(getPage())});
    })();
    </script>
</body>
</html>`;
}

function calculateReadingTime(content) {
  const text = (content || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  return Math.max(1, Math.round(words / 200));
}

function getRelatedArticles(currentSlug, allArticles, count = 4) {
  // Simple keyword-based matching: pick articles with similar words in title
  const currentTitle = (allArticles.find(a => a.slug === currentSlug) || {}).title || '';
  const currentWords = currentTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  const scored = allArticles
    .filter(a => a.slug !== currentSlug)
    .map(a => {
      const titleWords = a.title.toLowerCase().split(/\s+/);
      const score = currentWords.filter(w => titleWords.some(tw => tw.includes(w) || w.includes(tw))).length;
      return { ...a, score };
    })
    .sort((a, b) => b.score - a.score);
  
  // Take top matches, fallback to random if no matches
  const related = scored.slice(0, count);
  if (related.length < count) {
    const remaining = allArticles.filter(a => a.slug !== currentSlug && !related.find(r => r.slug === a.slug));
    related.push(...remaining.slice(0, count - related.length));
  }
  return related.slice(0, count);
}

function generateArticlePage(article, template, allArticles) {
  let html = template;
  html = html.replace(/\{\{TITLE\}\}/g, escapeHtml(article.title));
  html = html.replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(article.excerpt));
  html = html.replace(/\{\{CANONICAL_URL\}\}/g, `https://undangyah.id/artikel/${article.slug}/`);
  html = html.replace(/\{\{OG_IMAGE\}\}/g, article.featured_image);
  html = html.replace(/\{\{DATE_PUBLISHED\}\}/g, article.date);
  html = html.replace(/\{\{DATE_MODIFIED\}\}/g, article.date);
  html = html.replace(/\{\{FEATURED_IMAGE\}\}/g, article.featured_image);
  html = html.replace(/\{\{CONTENT\}\}/g, article.content || '');
  
  // Reading time
  const readingTime = calculateReadingTime(article.content);
  html = html.replace(/\{\{READING_TIME\}\}/g, String(readingTime));
  
  // Related articles
  const related = getRelatedArticles(article.slug, allArticles || []);
  const relatedHtml = related.map(r => 
    `                                <li><a href="/artikel/${r.slug}/">${escapeHtml(r.title)}</a></li>`
  ).join('\n');
  html = html.replace(/\{\{RELATED_ARTICLES\}\}/g, relatedHtml);
  
  return html;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Fetching articles from API...');
  const articles = await fetchAllArticles();
  console.log(`✅ Fetched ${articles.length} articles\n`);

  // Read template
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('❌ Template not found:', TEMPLATE_PATH);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Generate listing page
  console.log('📝 Generating listing page...');
  const listingHtml = generateListingPage(articles);
  fs.writeFileSync(path.join(ARTIKEL_DIR, 'index.html'), listingHtml, 'utf-8');
  console.log('  → artikel/index.html');

  // Generate individual article pages
  console.log('\n📝 Generating individual article pages...');
  let generated = 0;
  let failed = 0;

  for (const article of articles) {
    try {
      // Fetch full content for each article
      const full = await fetchArticleContent(article.slug);
      
      const articleDir = path.join(ARTIKEL_DIR, article.slug);
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }

      const articleHtml = generateArticlePage(full, template, articles);
      fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml, 'utf-8');
      generated++;
      process.stdout.write(`  ✓ ${article.slug}\n`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${article.slug}: ${err.message}`);
    }
  }

  console.log(`\n✅ Done! Generated: ${generated}, Failed: ${failed}`);
  console.log(`📁 Output: ${ARTIKEL_DIR}/`);

  // Regenerate sitemap
  console.log('\n🗺️  Regenerating sitemap...');
  const { execSync } = require('child_process');
  try {
    const out = execSync('bash /root/.hermes/profiles/server-monitor/scripts/generate-sitemap.sh', { encoding: 'utf-8' });
    console.log('  ' + out.trim());
  } catch (e) {
    console.error('  ⚠️ Sitemap generation failed:', e.message);
  }

  // Regenerate RSS feed
  console.log('\n📡 Regenerating feed.xml...');
  try {
    const feedArticles = articles.slice(0, 20); // Latest 20
    const feedItems = feedArticles.map(a => {
      const title = (a.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const desc = (a.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 200);
      const pubDate = a.date ? `${a.date}T08:00:00+07:00` : new Date().toISOString();
      const img = a.featured_image || '';
      return `    <item>
      <title>${title}</title>
      <link>https://undangyah.id/artikel/${a.slug}/</link>
      <guid isPermaLink="true">https://undangyah.id/artikel/${a.slug}/</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      ${img ? `<enclosure url="${img}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('\n');

    const lastBuild = articles[0] ? `${articles[0].date}T08:00:00+07:00` : new Date().toISOString();
    const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Undangyah - Artikel Pernikahan &amp; Undangan Digital</title>
    <link>https://undangyah.id/artikel/</link>
    <description>Tips pernikahan, panduan undangan digital, dan inspirasi wedding planning dari Undangyah.</description>
    <language>id</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="https://undangyah.id/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://app.undangyah.id/wp-content/uploads/2026/01/undangyah.png</url>
      <title>Undangyah</title>
      <link>https://undangyah.id</link>
    </image>
${feedItems}
  </channel>
</rss>`;

    fs.writeFileSync(path.join(__dirname, 'feed.xml'), feedXml);
    console.log(`  ✅ feed.xml updated (${feedArticles.length} items)`);
  } catch (e) {
    console.error('  ⚠️ Feed generation failed:', e.message);
  }

  // Auto-submit new URLs to Google Indexing API
  console.log('\n🔍 Submitting to Google Indexing API...');
  try {
    const out = execSync('cd /root/.hermes && python3 scripts/google-indexing.py 2>&1', { encoding: 'utf-8', timeout: 60000 });
    console.log('  ' + out.trim().split('\n').slice(0, 3).join('\n  '));
  } catch (e) {
    console.error('  ⚠️ Indexing API submission failed:', e.message.split('\n')[0]);
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
