import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const blogContentDir = join(__dirname, '..', 'content', 'blog');
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

function renderPage(template, { pageTitle, description, url, ogImage, ogType }) {
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(pageTitle)}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
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
  { path: 'why-gryt', title: 'Why Gryt? | Gryt', description: 'Why we built an open-source, self-hosted voice chat platform.' },
  { path: 'blog', title: 'Blog | Gryt', description: 'Stories, updates, and technical deep-dives from the Gryt team.' },
  { path: 'privacy', title: 'Privacy Policy | Gryt', description: 'How Gryt handles your data — spoiler: we collect as little as possible.' },
  { path: 'community-guidelines', title: 'Community Guidelines | Gryt', description: 'Rules and expectations for the Gryt community.' },
  { path: 'invite', title: 'Invite | Gryt', description: 'Join a Gryt server with an invite link.' },
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

// --- Blog posts ---
const mdxFiles = readdirSync(blogContentDir).filter(f => f.endsWith('.mdx'));

for (const file of mdxFiles) {
  const fm = parseFrontmatter(join(blogContentDir, file));
  if (!fm?.title) continue;

  const slug = basename(file, '.mdx');
  const outDir = join(distDir, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  const html = renderPage(template, {
    pageTitle: `${fm.title} | Gryt Blog`,
    description: fm.description || fm.title,
    url: `${siteUrl}/blog/${slug}`,
    ogImage: `${siteUrl}/blog/${slug}/og.png`,
    ogType: 'article',
  });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`  dist/blog/${slug}/index.html`);
}

console.log('Done prerendering meta tags.');
