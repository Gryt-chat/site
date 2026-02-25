import sharp from 'sharp';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const blogContentDir = join(__dirname, '..', 'content', 'blog');

const width = 1200;
const height = 630;

const logoInner = `
  <rect width="512" height="512" rx="256" fill="#968FF8"/>
  <ellipse cx="144.56" cy="321.963" rx="74.5603" ry="125.871" fill="#2B303D"/>
  <ellipse cx="368.56" cy="321.963" rx="74.5603" ry="125.871" fill="#2B303D"/>
  <ellipse cx="254.397" cy="368.463" rx="157.138" ry="186.802" fill="#1A1D24"/>
  <path d="M167.009 115.118C140.552 133.557 110.621 186.471 104.474 216.135C104.474 216.135 146.164 282.678 256 282.678C365.836 282.678 409 221.266 409 216.135C409 209.721 393.897 140.773 365.836 121.532C337.776 102.29 311.319 91.8677 259.207 91.066C207.095 90.2643 193.465 96.6781 167.009 115.118Z" fill="#1A1D24"/>
  <path d="M258.736 232.014C258.214 234.003 255.389 234.003 254.867 232.014L247.045 202.207C246.712 200.939 247.669 199.7 248.98 199.7L264.624 199.7C265.935 199.7 266.891 200.939 266.558 202.207L258.736 232.014Z" fill="#CBCBCE"/>
  <path d="M203.08 162C216.959 162 221.986 169.702 222.773 173.951C223.299 177.67 223.246 186.062 218.835 189.887C213.321 194.667 195.473 200.325 190.476 185.106C186.814 173.951 188.375 169.171 188.113 169.171C190.476 163.631 195.256 162 203.08 162Z" fill="#CBCBCE"/>
  <path d="M308.124 160.851C294.151 160.851 289.09 168.637 288.297 172.932C287.768 176.691 287.821 185.174 292.262 189.04C297.814 193.873 315.782 199.592 320.813 184.208C324.5 172.932 322.928 168.1 323.192 168.1C320.813 162.5 316 160.851 308.124 160.851Z" fill="#CBCBCE"/>
`;

function escXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

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

function buildHomepageSvg() {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#13151a"/>
      <stop offset="40%" stop-color="#1A1D24"/>
      <stop offset="100%" stop-color="#2B303D"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#968FF8"/>
      <stop offset="50%" stop-color="#6C63FF"/>
      <stop offset="100%" stop-color="#968FF8"/>
    </linearGradient>
    <clipPath id="logo-clip"><rect width="512" height="512" rx="256"/></clipPath>
    <clipPath id="wm-clip"><rect width="512" height="512" rx="256"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <g transform="translate(80, 195) scale(0.176)"><g clip-path="url(#logo-clip)">${logoInner}</g></g>
  <text x="185" y="262" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" fill="#ffffff" letter-spacing="-2">Gryt</text>
  <text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#a5a5b0">Voice, Text &amp; Video Chat</text>
  <text x="80" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#666666">Self-hosted, open-source voice, text, and video chat</text>
  <rect x="80" y="420" width="110" height="36" rx="18" fill="none" stroke="#968FF8" stroke-width="1.5"/>
  <text x="135" y="443" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#968FF8" text-anchor="middle">WebRTC</text>
  <rect x="205" y="420" width="130" height="36" rx="18" fill="none" stroke="#968FF8" stroke-width="1.5"/>
  <text x="270" y="443" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#968FF8" text-anchor="middle">Self-Hosted</text>
  <rect x="350" y="420" width="145" height="36" rx="18" fill="none" stroke="#968FF8" stroke-width="1.5"/>
  <text x="422" y="443" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#968FF8" text-anchor="middle">Open Source</text>
  <g transform="translate(760, 90) scale(0.88)" opacity="0.06"><g clip-path="url(#wm-clip)">${logoInner}</g></g>
  <rect y="${height - 4}" width="${width}" height="4" fill="url(#accent)"/>
</svg>`;
}

function buildBlogPostSvg(title, description, author, date) {
  const titleLines = wrapText(title, 38);
  const titleY = 200;
  const titleSvg = titleLines.map((line, i) =>
    `<text x="80" y="${titleY + i * 56}" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="800" fill="#ffffff" letter-spacing="-1">${escXml(line)}</text>`
  ).join('\n  ');

  const descY = titleY + titleLines.length * 56 + 24;
  const descLines = description ? wrapText(description, 65).slice(0, 2) : [];
  const descSvg = descLines.map((line, i) =>
    `<text x="80" y="${descY + i * 28}" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#a5a5b0">${escXml(line)}</text>`
  ).join('\n  ');

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#13151a"/>
      <stop offset="40%" stop-color="#1A1D24"/>
      <stop offset="100%" stop-color="#2B303D"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#968FF8"/>
      <stop offset="50%" stop-color="#6C63FF"/>
      <stop offset="100%" stop-color="#968FF8"/>
    </linearGradient>
    <clipPath id="wm-clip"><rect width="512" height="512" rx="256"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <text x="80" y="80" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#968FF8">GRYT BLOG</text>

  ${titleSvg}
  ${descSvg}

  <text x="80" y="${height - 50}" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#a5a5b0">${escXml(author)}</text>
  <text x="80" y="${height - 24}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#666666">${escXml(formattedDate)}</text>

  <g transform="translate(760, 90) scale(0.88)" opacity="0.06"><g clip-path="url(#wm-clip)">${logoInner}</g></g>
  <rect y="${height - 4}" width="${width}" height="4" fill="url(#accent)"/>
</svg>`;
}

// --- Homepage OG image ---
await sharp(Buffer.from(buildHomepageSvg())).png().toFile(join(publicDir, 'og-image.png'));
console.log('  public/og-image.png');

// --- Per-post OG images ---
const mdxFiles = readdirSync(blogContentDir).filter(f => f.endsWith('.mdx'));

for (const file of mdxFiles) {
  const fm = parseFrontmatter(join(blogContentDir, file));
  if (!fm?.title) continue;

  const slug = basename(file, '.mdx');
  const outDir = join(publicDir, 'blog', slug);
  mkdirSync(outDir, { recursive: true });

  const svg = buildBlogPostSvg(fm.title, fm.description, fm.author || 'Gryt', fm.date || '');
  await sharp(Buffer.from(svg)).png().toFile(join(outDir, 'og.png'));
  console.log(`  public/blog/${slug}/og.png`);
}

console.log('Done generating OG images.');
