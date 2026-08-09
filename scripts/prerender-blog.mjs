import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

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

function renderPage(template, { pageTitle, docTitleName, description, url, ogImage, ogType, noindex }) {
  let html = template;
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
  return html;
}

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// --- Static pages ---
const staticPages = [
  { path: 'why-gryt', title: 'Why Gryt?', description: 'Why we built an open-source, self-hosted voice chat platform.' },
  { path: 'blog', title: 'Blog', description: 'Stories, updates, and technical deep-dives from the Gryt team.' },
  { path: 'changelog', title: 'Changelog', description: 'What changed in each release of Gryt.' },
  { path: 'terms', title: 'Terms of Use', description: 'The terms covering the services we operate. Community servers set their own on top of these.' },
  { path: 'privacy', title: 'Privacy Policy', description: 'How Gryt handles your data. We collect as little as we can get away with.' },
  { path: 'community-guidelines', title: 'Community Guidelines', description: 'Rules and expectations for the Gryt community.' },
  { path: 'invite', title: 'Invite', description: 'Join a Gryt server with an invite link.' },
];

/**
 * Routes that render an existing page under a second URL. They get a directory
 * of their own so nginx can serve them without an SPA catch-all, but their
 * canonical points at the primary — the point of dropping the catch-all is to
 * stop shipping duplicates of the front page, and shipping duplicates of the
 * privacy page instead would be no better.
 */
const aliasPages = [
  { path: 'privacy-policy', of: 'privacy' },
  { path: 'terms-of-use', of: 'terms' },
  { path: 'guidelines', of: 'community-guidelines' },
];

for (const page of staticPages) {
  const outDir = join(distDir, page.path);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: page.title,
    description: page.description,
    url: `${siteUrl}/${page.path}`,
    ogImage: `${siteUrl}/${page.path}/og.png`,
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/${page.path}/index.html`);
}

for (const alias of aliasPages) {
  const target = staticPages.find((p) => p.path === alias.of);
  if (!target) throw new Error(`alias ${alias.path} points at unknown page ${alias.of}`);
  const outDir = join(distDir, alias.path);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: target.title,
    description: target.description,
    url: `${siteUrl}/${target.path}`,
    ogImage: `${siteUrl}/${target.path}/og.png`,
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
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/changelog/${slug}/index.html`);
}

console.log('Done prerendering meta tags.');
