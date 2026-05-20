#!/usr/bin/env node
/**
 * Generate sitemap.xml for undangyah.id
 * Fetches articles from API and generates complete sitemap
 * Run: node generate-sitemap.js
 */

const API_BASE = 'https://app.undangyah.id/wp-json/undangyah/v1';
const SITE_URL = 'https://undangyah.id';

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly', lastmod: today },
    { loc: `${SITE_URL}/artikel/`, priority: '0.8', changefreq: 'daily', lastmod: today },
  ];

  // Fetch all articles
  try {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(`${API_BASE}/landing/articles?page=${page}&per_page=50&_nocache=${Date.now()}`);
      const json = await res.json();

      if (json.data && json.data.length > 0) {
        for (const article of json.data) {
          urls.push({
            loc: `${SITE_URL}/artikel/${article.slug}`,
            priority: '0.6',
            changefreq: 'monthly',
            lastmod: article.date,
          });
        }
        hasMore = page < json.total_pages;
        page++;
      } else {
        hasMore = false;
      }
    }
  } catch (e) {
    console.error('Error fetching articles:', e.message);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to file
  const fs = await import('fs');
  fs.writeFileSync('/www/wwwroot/undangyah.id/sitemap.xml', xml);
  console.log(`Sitemap generated: ${urls.length} URLs`);
}

generateSitemap();
