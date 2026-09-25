import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_PAGES, ALIAS_PAGES, OG_IMAGE_VERSION } from '../src/lib/pages.mjs';
import { render } from '../dist-ssr/entry-server.js';
import { routeStyles, styleLinks } from './routeStyles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const blogContentDir = join(__dirname, '..', 'content', 'blog');
const changelogContentDir = join(__dirname, '..', 'content', 'changelog');
const siteUrl = 'https://gryt.chat';

function parseFrontmatter(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const siteName = 'Gryt';

/**
 * `<title>` gets the ` | Gryt` suffix and `og:title` stays bare: the card already says Gryt,
 * and Discord truncates. `src/lib/title.ts` carries the same rule — change one, change both.
 */
function docTitle(name) {
  return `${name} | ${siteName}`;
}

/**
 * The page, rendered, as the string inside `<div id="root">`. React's markup goes in whole:
 * the `<!--$-->` markers are how hydration finds its Suspense boundaries.
 */
async function body(route) {
  try {
    return await render(route);
  } catch (err) {
    /* A page that will not render is a page that would ship as a shell, which
       is the state this is meant to end. Fail the build and say which one. */
    throw new Error(`could not prerender ${route}: ${err.message}`, { cause: err });
  }
}

function renderPage(template, { pageTitle, docTitleName, description, url, ogImage, ogType, noindex, html: rendered, styles }) {
  // The responsive hero preload belongs only to the homepage. This template is
  // copied for every static route, where preloading it would waste bandwidth.
  let html = template.replace(/\s*<link[^>]*data-home-preload[^>]*>/, '');
  // Pages that exist so nginx can find them, but that nobody should reach from
  // a search result: the auth callback and the 404 itself.
  if (noindex) {
    html = html.replace(
      /<link rel="canonical"[^>]*>/,
      '<meta name="robots" content="noindex" />',
    );
  }
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(docTitle(docTitleName || pageTitle))}</title>`);
  if (!noindex) {
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  }
  html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escHtml(description)}" />`);
  html = html.replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType || 'website'}" />`);
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escHtml(pageTitle)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escHtml(description)}" />`);
  html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${ogImage}"`);
  html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escHtml(pageTitle)}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}" />`);
  /* The route's own stylesheet, into the head beside the global one (GRYT-959). Without it
     the page paints with its content bare, then restyles when the lazy chunk lands. */
  if (styles && styles.length > 0) {
    html = html.replace('</head>', `${styleLinks(styles)}\n  </head>`);
  }

  if (rendered) {
    html = html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
  }
  return html;
}

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

/* Which stylesheet each route needs, read out of App.tsx and the build manifest. Throws
   rather than carrying on: a silent revert to one stylesheet per page is the bug. */
const globalCss = template.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1] ?? '';
const stylesFor = routeStyles({
  appSource: join(__dirname, '..', 'src', 'App.tsx'),
  manifestPath: join(distDir, '.vite', 'manifest.json'),
  globalCss,
});

/* Every indexable page, added as it is written. check-sitemap.mjs holds the file to the
   pages on disk, so a page written here without an entry fails the build. */
const sitemap = [];

const mdxFiles = readdirSync(blogContentDir).filter(f => f.endsWith('.mdx'));
const changelogFiles = existsSync(changelogContentDir)
  ? readdirSync(changelogContentDir).filter(f => f.endsWith('.mdx'))
  : [];
const lines = await import(join(__dirname, '..', 'content', 'changelog', 'releases.ts'));

/** The latest of some YYYY-MM-DD dates, which sort as strings. */
const newest = (dates) => dates.filter(Boolean).sort().at(-1);

/* An index page changes when something is added to it, so it takes its newest entry's date. */
const indexDates = {
  blog: newest(mdxFiles.map((f) => parseFrontmatter(join(blogContentDir, f))?.date)),
  changelog: newest([
    ...changelogFiles.map((f) => parseFrontmatter(join(changelogContentDir, f))?.date),
    ...[lines.app, lines.server, lines.voice, lines.images].flat().map((r) => r.date),
  ]),
};

// --- Static pages ---

for (const page of STATIC_PAGES) {
  const outDir = join(distDir, page.path);
  const url = `${siteUrl}/${page.path}`;
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: page.title,
    description: page.description,
    url,
    ogImage: `${siteUrl}/${page.path}/og.png?v=${OG_IMAGE_VERSION}`,
    noindex: page.noindex,
    html: await body(`/${page.path}`),
    styles: stylesFor.get(`/${page.path}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  if (!page.noindex) sitemap.push({ loc: url, lastmod: page.updated ?? indexDates[page.path] });
  console.log(`  dist/${page.path}/index.html`);
}

for (const alias of ALIAS_PAGES) {
  const target = STATIC_PAGES.find((p) => p.path === alias.of);
  if (!target) throw new Error(`alias ${alias.path} points at unknown page ${alias.of}`);
  const outDir = join(distDir, alias.path);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: target.title,
    description: target.description,
    url: `${siteUrl}/${target.path}`,
    ogImage: `${siteUrl}/${target.path}/og.png?v=${OG_IMAGE_VERSION}`,
    /* The alias path, not the target's. The canonical points at the target but the router
       matches the address bar, so the other one is markup the client throws away. */
    html: await body(`/${alias.path}`),
    styles: stylesFor.get(`/${alias.path}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/${alias.path}/index.html -> canonical /${target.path}`);
}

// The auth callback. Nothing links to it, but it has to exist on disk now that unmatched
// paths 404 instead of falling back to the SPA.
{
  const outDir = join(distDir, 'auth', 'callback');
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: 'Signing you in',
    description: 'Completing sign-in and handing you back to the Gryt app.',
    url: `${siteUrl}/auth/callback`,
    ogImage: `${siteUrl}/og-image.png?v=${OG_IMAGE_VERSION}`,
    noindex: true,
    html: await body('/auth/callback'),
    styles: stylesFor.get('/auth/callback'),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log('  dist/auth/callback/index.html');
}

// 404. nginx serves this for anything that does not resolve, with a 404 status; the SPA
// boots from it and the catch-all route renders NotFound.
{
  const html = renderPage(template, {
    pageTitle: 'Page not found',
    description: 'There is nothing at this address.',
    url: `${siteUrl}/404`,
    ogImage: `${siteUrl}/og-image.png?v=${OG_IMAGE_VERSION}`,
    noindex: true,
    /* Any path that does not match, which is what nginx serves this for. */
    html: await body('/this-path-does-not-exist'),
    styles: stylesFor.get('*'),
  });
  writeFileSync(join(distDir, '404.html'), html);
  console.log('  dist/404.html');
}

// --- Blog posts ---
for (const file of mdxFiles) {
  const fm = parseFrontmatter(join(blogContentDir, file));
  if (!fm?.title) continue;

  const slug = basename(file, '.mdx');
  const outDir = join(distDir, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: fm.title,
    description: fm.description || fm.title,
    url: `${siteUrl}/blog/${slug}`,
    ogImage: `${siteUrl}/blog/${slug}/og.png?v=${OG_IMAGE_VERSION}`,
    ogType: 'article',
    html: await body(`/blog/${slug}`),
    styles: stylesFor.get('/blog/:slug'),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  sitemap.push({ loc: `${siteUrl}/blog/${slug}`, lastmod: fm.date });
  console.log(`  dist/blog/${slug}/index.html`);
}

// Changelog entries, which get shared into chat far more than blog posts. The headline is
// written to be exactly this preview, so use it as the description.
for (const file of changelogFiles) {
  const fm = parseFrontmatter(join(changelogContentDir, file));
  if (!fm?.version) continue;

  const slug = basename(file, '.mdx');
  const outDir = join(distDir, 'changelog', slug);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: `Gryt ${fm.version}`,
    docTitleName: `${fm.version} | Changelog`,
    description: fm.headline || `What changed in Gryt ${fm.version}.`,
    url: `${siteUrl}/changelog/${slug}`,
    ogImage: `${siteUrl}/changelog/${slug}/og.png?v=${OG_IMAGE_VERSION}`,
    ogType: 'article',
    html: await body(`/changelog/${slug}`),
    styles: stylesFor.get('/changelog/:version'),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  sitemap.push({ loc: `${siteUrl}/changelog/${slug}`, lastmod: fm.date });
  console.log(`  dist/changelog/${slug}/index.html`);
}

/* Every app release with no note. nginx answers `try_files $uri $uri/index.html =404`,
   and the app's modal links here for every release it shows. GRYT-1091. */
const noted = new Set(changelogFiles.map((f) => basename(f, '.mdx')));

for (const release of lines.app) {
  if (noted.has(release.version)) continue;

  const outDir = join(distDir, 'changelog', release.version);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: `Gryt ${release.version}`,
    docTitleName: `${release.version} | Changelog`,
    description: release.line,
    url: `${siteUrl}/changelog/${release.version}`,
    /* The changelog's own card. A page of one-line changes is not worth a card
       each, and would mean a committed PNG per release forever. */
    ogImage: `${siteUrl}/changelog/og.png?v=${OG_IMAGE_VERSION}`,
    ogType: 'article',
    html: await body(`/changelog/${release.version}`),
    styles: stylesFor.get('/changelog/:version'),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  sitemap.push({ loc: `${siteUrl}/changelog/${release.version}`, lastmod: release.date });
  console.log(`  dist/changelog/${release.version}/index.html`);
}

// The home page, last, and into the file every page above was copied from. `template` was
// read into memory at the top, so writing it now cannot reach them.
{
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${await body('/')}</div>`,
  );
  writeFileSync(join(distDir, 'index.html'), html);
  sitemap.unshift({ loc: siteUrl });
  console.log('  dist/index.html');
}

/* The sitemaps.org format. No changefreq or priority: Google ignores both, and lastmod
   is only set where the content carries its own date. */
{
  const urls = sitemap.map(({ loc, lastmod }) =>
    [
      '  <url>',
      `    <loc>${escHtml(loc)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n'),
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  writeFileSync(join(distDir, 'sitemap.xml'), xml);
  console.log(`  dist/sitemap.xml (${sitemap.length} pages)`);
}

console.log('Done prerendering.');
