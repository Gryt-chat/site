import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_PAGES, ALIAS_PAGES } from '../src/lib/pages.mjs';
import { render } from '../dist-ssr/entry-server.js';

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
 * The tab and the search result read `<name> | Gryt`. The share card does not:
 * a title under an image that already says Gryt does not need to say it again,
 * and Discord truncates the line. So `<title>` gets the suffix and `og:title`
 * stays bare.
 *
 * `src/lib/title.ts` carries the same rule for the client-side router, which is
 * what you get on an in-app navigation. Change one, change the other.
 */
function docTitle(name) {
  return `${name} | ${siteName}`;
}

/**
 * The page, rendered, as the string that goes inside `<div id="root">`.
 *
 * Everything above this only ever rewrote meta tags, so every page shipped as a
 * 2 kB shell with the words in a JavaScript chunk. A crawler saw a title and a
 * description; a link preview saw the same; somebody on a slow connection saw
 * nothing until the bundle arrived. Sixteen blog posts and six release notes,
 * none of their prose in the HTML.
 *
 * React's markup goes in whole, comments and inline scripts included. The
 * `<!--$-->` markers are how hydration finds its Suspense boundaries and the
 * scripts are what close them; tidying either away breaks the thing this exists
 * to enable.
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

function renderPage(template, { pageTitle, docTitleName, description, url, ogImage, ogType, noindex, html: rendered }) {
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
  if (rendered) {
    html = html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
  }
  return html;
}

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// --- Static pages ---



for (const page of STATIC_PAGES) {
  const outDir = join(distDir, page.path);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: page.title,
    description: page.description,
    url: `${siteUrl}/${page.path}`,
    ogImage: `${siteUrl}/${page.path}/og.png`,
    html: await body(`/${page.path}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
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
    ogImage: `${siteUrl}/${target.path}/og.png`,
    /* The alias path, not the target's. The canonical points at the target but
       the router matches what is in the address bar, and rendering the other
       one here would be markup the client immediately throws away. */
    html: await body(`/${alias.path}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/${alias.path}/index.html -> canonical /${target.path}`);
}

// --- The auth callback ---
// Nothing links to it and nobody should land on it from a search, but it has to
// exist on disk now that unmatched paths 404 instead of falling back to the SPA.
{
  const outDir = join(distDir, 'auth', 'callback');
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: 'Signing you in',
    description: 'Completing sign-in and handing you back to the Gryt app.',
    url: `${siteUrl}/auth/callback`,
    ogImage: `${siteUrl}/og-image.png`,
    noindex: true,
    html: await body('/auth/callback'),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log('  dist/auth/callback/index.html');
}

// --- 404 ---
// nginx serves this for anything that does not resolve, with a 404 status. The
// SPA boots from it exactly as it does from any other entry point and the
// catch-all route renders NotFound.
{
  const html = renderPage(template, {
    pageTitle: 'Page not found',
    description: 'There is nothing at this address.',
    url: `${siteUrl}/404`,
    ogImage: `${siteUrl}/og-image.png`,
    noindex: true,
    /* Any path that does not match, which is what nginx serves this for. */
    html: await body('/this-path-does-not-exist'),
  });
  writeFileSync(join(distDir, '404.html'), html);
  console.log('  dist/404.html');
}

// --- Blog posts ---
const mdxFiles = readdirSync(blogContentDir).filter(f => f.endsWith('.mdx'));

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
    ogImage: `${siteUrl}/blog/${slug}/og.png`,
    ogType: 'article',
    html: await body(`/blog/${slug}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/blog/${slug}/index.html`);
}

// --- Changelog entries ---
// These get shared into chat far more than blog posts do — a release goes out,
// the link is posted, and a link with no card looks like nothing happened. The
// headline is written to be exactly this preview, so use it as the description.
const changelogFiles = existsSync(changelogContentDir)
  ? readdirSync(changelogContentDir).filter(f => f.endsWith('.mdx'))
  : [];

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
    ogImage: `${siteUrl}/changelog/${slug}/og.png`,
    ogType: 'article',
    html: await body(`/changelog/${slug}`),
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/changelog/${slug}/index.html`);
}

// --- The home page ---
// Last, and into the file every page above was copied from. `template` was read
// into memory at the top, so writing it now cannot reach them.
{
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${await body('/')}</div>`,
  );
  writeFileSync(join(distDir, 'index.html'), html);
  console.log('  dist/index.html');
}

console.log('Done prerendering.');
