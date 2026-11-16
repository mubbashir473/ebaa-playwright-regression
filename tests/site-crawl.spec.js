const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { XMLParser } = (() => { // no XML dependency: XML loc tags handled in discoverSitemap
  return { XMLParser: null };
})();

const ROOT = new URL((process.env.BASE_URL || 'https://ebaa.com').replace(/\/$/, '') + '/');
const MAX_PAGES = Number(process.env.MAX_PAGES || 300);
const MAX_LINKS = Number(process.env.MAX_LINKS || 2000);
const outDir = path.join(process.cwd(), 'test-results');
const pageExt = /\.(pdf|zip|csv|xlsx?|docx?|pptx?|png|jpe?g|gif|webp|svg|mp4|mov|webm|woff2?|ttf|eot)(?:$|\?)/i;
const blockedPaths = /\/(wp-admin|wp-login\.php|logout|cart|checkout)(?:\/|\?|$)/i;
const trimHash = u => { const x = new URL(u); x.hash = ''; return x.toString(); };
const local = u => new URL(u).origin === ROOT.origin;
const issue = (type, url, detail) => ({ type, url, detail });

async function discoverSitemap(request, add) {
  const candidates = new Set([new URL('/wp-sitemap.xml', ROOT).toString(), new URL('/sitemap_index.xml', ROOT).toString(), new URL('/sitemap.xml', ROOT).toString()]);
  try {
    const robots = await request.get(new URL('/robots.txt', ROOT).toString(), { timeout: 15000 });
    if (robots.ok()) for (const m of (await robots.text()).matchAll(/^Sitemap:\s*(\S+)/gim)) candidates.add(m[1]);
  } catch {}
  const seen = new Set();
  async function visit(url, depth = 0) {
    if (seen.has(url) || depth > 3 || seen.size > 80) return;
    seen.add(url);
    try {
      const res = await request.get(url, { timeout: 15000 });
      if (!res.ok()) return;
      const xml = await res.text();
      if (!/<(?:\w+:)?(?:urlset|sitemapindex)\b/i.test(xml)) return;
      for (const m of xml.matchAll(/<(?:\w+:)?loc\b[^>]*>([\s\S]*?)<\/(?:\w+:)?loc>/gi)) {
        const raw = m[1].trim().replace(/&amp;/g, '&');
        try {
          const next = trimHash(new URL(raw, ROOT).toString());
          if (!local(next)) continue;
          if (/\.xml(?:\?|$)/i.test(next)) await visit(next, depth + 1);
          else add(next);
        } catch {}
      }
    } catch {}
  }
  for (const candidate of candidates) await visit(candidate);
}

test('Site-wide crawl: pages, links, images, JavaScript errors', async ({ page, request }, testInfo) => {
  test.setTimeout(15 * 60 * 1000);
  fs.mkdirSync(outDir, { recursive: true });
  const queue = [], queued = new Set(), visited = new Set(), targetLinks = new Set(), issues = [];
  const pages = [], forms = [];
  const add = input => {
    try {
      const u = trimHash(new URL(input, ROOT).toString());
      if (!local(u) || !/^https?:/.test(u) || pageExt.test(u) || blockedPaths.test(new URL(u).pathname)) return;
      if (!queued.has(u) && queued.size < MAX_PAGES * 5) { queued.add(u); queue.push(u); }
    } catch {}
  };
  add(ROOT.toString());
  await discoverSitemap(request, add);
  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    const jsErrors = [];
    const onError = err => jsErrors.push(err.message);
    page.on('pageerror', onError);
    let status = null;
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = response?.status() ?? null;
      await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForTimeout(300);
      const data = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map(x => x.textContent.trim()).filter(Boolean),
        links: [...document.querySelectorAll('a[href]')].map(x => x.href),
        images: [...document.images].filter(x => x.getClientRects().length).map(x => ({ src: x.currentSrc || x.src, complete: x.complete, width: x.naturalWidth, lazy: x.loading === 'lazy' })),
        forms: [...document.querySelectorAll('form')].map(f => ({ action: f.action, fields: [...f.querySelectorAll('input,select,textarea')].filter(x => x.type !== 'hidden').map(x => ({ name: x.name, type: x.type, required: x.required })) }))
      }));
      pages.push({ url, status, title: data.title, h1: data.h1, images: data.images.length, forms: data.forms.length });
      forms.push(...data.forms.map(f => ({ page: url, ...f })));
      if (status >= 400) issues.push(issue('HTTP page', url, `Status ${status}`));
      if (!data.title) issues.push(issue('Missing page title', url, 'Document title empty'));
      for (const img of data.images) {
        // Lazy images are intentionally not loaded until scrolled into view.
        if (!img.lazy && img.complete && img.width === 0) issues.push(issue('Broken visible image', url, img.src));
      }
      for (const link of data.links) {
        try {
          const l = trimHash(link);
          if (!local(l) || !/^https?:/.test(l) || blockedPaths.test(new URL(l).pathname)) continue;
          targetLinks.add(l);
          add(l);
        } catch {}
      }
      for (const msg of jsErrors) issues.push(issue('Uncaught JavaScript error', url, msg));
      console.log(`[${visited.size}/${MAX_PAGES}] ${status} ${url}`);
    } catch (e) {
      issues.push(issue('Navigation failure', url, e.message.split('\n')[0]));
      pages.push({ url, status, error: e.message.split('\n')[0] });
    } finally { page.off('pageerror', onError); }
  }
  const linkResults = [];
  for (const url of [...targetLinks].slice(0, MAX_LINKS)) {
    try {
      // GET is more reliable than HEAD for many WP/CDN routes.
      const res = await request.get(url, { timeout: 15000, maxRedirects: 5 });
      linkResults.push({ url, status: res.status() });
      if (res.status() >= 400) issues.push(issue('Broken internal link', url, `HTTP ${res.status()}`));
    } catch (e) {
      linkResults.push({ url, error: e.message.split('\n')[0] });
      issues.push(issue('Link request failed', url, e.message.split('\n')[0]));
    }
  }
  const report = { baseURL: ROOT.toString(), generatedAt: new Date().toISOString(), limits: { MAX_PAGES, MAX_LINKS }, pagesCrawled: pages.length, linksChecked: linkResults.length, queuedButNotCrawled: queue.length, linksNotChecked: Math.max(0, targetLinks.size - MAX_LINKS), pages, links: linkResults, forms, issues };
  const reportPath = path.join(outDir, 'site-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  await testInfo.attach('site-audit.json', { path: reportPath, contentType: 'application/json' });
  console.log(`AUDIT: ${pages.length} pages | ${linkResults.length} links | ${forms.length} forms | ${issues.length} issues`);
  expect(issues, `See test-results/site-audit.json. First failures:\n${JSON.stringify(issues.slice(0, 12), null, 2)}`).toEqual([]);
  expect(pages.length).toBeGreaterThan(0);
});
