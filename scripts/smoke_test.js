#!/usr/bin/env node
/*
 * Browser smoke test for the built site.
 *
 *   bundle exec jekyll build && node scripts/smoke_test.js _site
 *
 * Opens every page of the built site in headless Chromium and fails if any
 * page, in any section, is broken:
 *
 *   - a script throws
 *   - the Content Security Policy blocks something the page itself ships
 *   - a file from this site (JS, CSS, image) is missing
 *   - a section has lost the thing that makes it work (see EXPECT below)
 *
 * Third-party hosts are blocked, so the test never pings analytics or comment
 * services and every page is also checked for coping when they are down.
 * Run by .github/workflows/site-check.yml. Needs the `playwright` package.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const SITE = path.resolve(process.argv[2] || '_site');

// CDNs that pages need in order to work at all.
const ALLOWED_EXTERNAL = ['cdn.jsdelivr.net'];

// What each section must contain once its scripts have run. Add a line here
// when you add a section or an interactive page. `min` defaults to 1.
const EXPECT = {
  '/': [{ sel: '#site-nav-select option', min: 5 }, { sel: 'article h2 a' }],
  '/projects/': [{ sel: '.project-group', min: 3 }, { sel: '.project-card a', min: 8 }],
  '/projects/frog-piano/': [{ sel: '#frog-piano-container canvas', painted: true }],
  '/projects/three-body-simulation/': [{ sel: '#three-body-sim canvas', painted: true }],
  '/projects/tetris/': [{ sel: 'canvas#tetris', painted: true }],
  '/projects/heading-optimisation/': [{ sel: '#run' }, { sel: '#tLim' }],
  '/projects/kotatsu/': [{ sel: '.project-checklist li', min: 2 }],
  '/poetry/': [{ sel: '#main-content a' }],
  '/essays/': [{ sel: '#main-content a' }],
  '/gallery/': [{ sel: '#main-content img', min: 3 }],
  '/quotes/': [{ sel: '#main-content' }],
  '/journal/': [{ sel: '#journal-data' }],
  '/diary/': [{ sel: '#diary-data' }],
  '/timeline/': [{ sel: '#timeline-data' }],
  '/listening/': [{ sel: '#main-content' }],
  '/comments/': [{ sel: '#main-content' }],
  '/patrons/': [{ sel: '#main-content' }],
  '/secret/': [{ sel: '#unlock' }],
};

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.txt': 'text/plain',
};

function serve() {
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(req.url.split('?')[0]); } catch (e) { rel = '/'; }
    let file = path.join(SITE, path.normalize(rel));
    if (!file.startsWith(SITE)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function listPages(dir, out) {
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) listPages(full, out);
    else if (name.endsWith('.html')) {
      let url = '/' + path.relative(SITE, full).split(path.sep).join('/');
      url = url.replace(/index\.html$/, '');
      out.push(url);
    }
  }
  return out;
}

// Pages built without a layout (raw uploads in legacy/) are not part of the
// themed site; they are only checked for loading at all.
function isThemed(url) {
  const file = path.join(SITE, url.endsWith('/') ? url + 'index.html' : url);
  return fs.readFileSync(file, 'utf8').includes('id="main-content"');
}

async function checkPage(browser, origin, url) {
  const problems = [];
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    if (host === '127.0.0.1' || ALLOWED_EXTERNAL.includes(host)) return route.continue();
    return route.abort();
  });
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__csp.push((e.violatedDirective || '') + ' blocked ' + (e.blockedURI || 'inline code') +
        (e.sourceFile ? ' from ' + e.sourceFile.replace(location.origin, '') : '') +
        (e.lineNumber ? ' line ' + e.lineNumber : ''));
    });
  });
  page.on('pageerror', (e) => problems.push('script error: ' + String(e.message || e).split('\n')[0]));
  page.on('response', (r) => {
    if (r.url().startsWith(origin) && r.status() >= 400) {
      problems.push('missing file: ' + r.url().slice(origin.length) + ' (' + r.status() + ')');
    }
  });

  try {
    await page.goto(origin + url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(700);
  } catch (e) {
    problems.push('page did not load: ' + String(e.message).split('\n')[0]);
    await context.close();
    return problems;
  }

  if (isThemed(url)) {
    const csp = await page.evaluate(() => window.__csp || []);
    for (const v of new Set(csp)) problems.push('Content Security Policy: ' + v);

    const visible = await page.evaluate(() => getComputedStyle(document.body).visibility !== 'hidden');
    if (!visible) problems.push('page body is still hidden after load');
    if ((await page.locator('#site-nav-select').count()) === 0) problems.push('site navigation is missing');

    for (const want of EXPECT[url] || []) {
      const count = await page.locator(want.sel).count();
      if (count < (want.min || 1)) {
        problems.push(`expected at least ${want.min || 1} × "${want.sel}", found ${count}`);
      } else if (want.painted) {
        const painted = await page.locator(want.sel).first().evaluate((c) => {
          if (!c.width || !c.height) return false;
          const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return true;
          return false;
        });
        if (!painted) problems.push(`"${want.sel}" exists but nothing was drawn on it`);
      }
    }
  }
  await context.close();
  return problems;
}

(async () => {
  if (!fs.existsSync(path.join(SITE, 'index.html'))) {
    console.error(`smoke_test: no built site at ${SITE}. Build it first (jekyll build).`);
    process.exit(2);
  }
  const pages = listPages(SITE, []);
  const missing = Object.keys(EXPECT).filter((u) => !pages.includes(u));

  const server = await serve();
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();

  let failed = 0;
  for (const url of missing) {
    failed++;
    console.log(`FAIL ${url}\n       page was not built at all`);
  }
  for (const url of pages) {
    const problems = await checkPage(browser, origin, url);
    if (problems.length) {
      failed++;
      console.log(`FAIL ${url}`);
      for (const p of [...new Set(problems)]) console.log('       ' + p);
    } else {
      console.log(`ok   ${url}`);
    }
  }
  await browser.close();
  server.close();

  console.log(failed
    ? `\nsmoke_test: ${failed} of ${pages.length + missing.length} pages have problems`
    : `\nsmoke_test: all ${pages.length} pages OK`);
  process.exit(failed ? 1 : 0);
})();
