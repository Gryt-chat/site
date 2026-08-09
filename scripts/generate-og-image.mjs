/**
 * Draws every share card the site serves, at 1200x630.
 *
 * The cards are set in Atkinson Hyperlegible, the same face as the site. That
 * takes some doing: Sharp rasterises SVG through librsvg, which resolves
 * `font-family` against the machine's installed fonts — on macOS via CoreText,
 * which never looks at fontconfig and so never sees the woff2 in public/fonts.
 * A card built with <text> therefore came out in Arial here and in something
 * else again on CI.
 *
 * So there is no <text> in the output. The woff2 is decompressed to TrueType in
 * memory, fontkit instances the variable font at the weight each line wants,
 * and every string is emitted as glyph outlines. The SVG that reaches Sharp
 * carries no font dependency at all, which is why it looks the same everywhere.
 *
 * Run by hand — `yarn generate:og` — not by `yarn build`. The PNGs are
 * committed. Re-run it when a title, a headline or this file changes.
 */
import sharp from 'sharp';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, readdirSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const fontsDir = join(publicDir, 'fonts');
const blogContentDir = join(__dirname, '..', 'content', 'blog');
const changelogContentDir = join(__dirname, '..', 'content', 'changelog');

const W = 1200;
const H = 630;

/**
 * The card is one flat field of the accent, which breaks the usual advice that
 * an accent should stay under a few percent of a surface. That advice is about
 * interfaces. This is a poster whose whole job is to be the one link preview in
 * a timeline of near-black cards that isn't near-black.
 *
 * The purple is stepped down from the brand's #968FF8 so white type clears
 * contrast on it — the token itself is too light to put #fff on.
 */
const C = {
  field: '#6157d8',
  owl: '#4c43b8',
  owlEar: '#554cc6',
  owlEye: '#8f88ea',
  title: '#fbfaff',
  sub: '#dedaff',
  label: '#eeecff',
  meta: '#e2dfff',
  rule: '#8079e4',
};

const PAD_X = 60;
const PAD_TOP = 58;
const PAD_BOTTOM = 58;

// ---------------------------------------------------------------- typography

const fonts = {};

async function loadFonts() {
  const load = async (file) => {
    const ttf = Buffer.from(await wawoff2.decompress(readFileSync(join(fontsDir, file))));
    return fontkit.create(ttf);
  };
  fonts.sans = await load('AtkinsonHyperlegibleNextVF-Variable.woff2');
  fonts.mono = await load('AtkinsonHyperlegibleMonoVF-Variable.woff2');
}

/** Where the baseline sits inside a line box, per the CSS half-leading model. */
function baselineOffset(font, size, lineHeight) {
  const { ascent, descent, unitsPerEm } = font;
  const contentHeight = ((ascent - descent) / unitsPerEm) * size;
  return (lineHeight - contentHeight) / 2 + (ascent / unitsPerEm) * size;
}

function measure(text, { font, weight, size, tracking = 0 }) {
  const run = font.getVariation({ wght: weight }).layout(text);
  const scale = size / font.unitsPerEm;
  return run.advanceWidth * scale + tracking * Math.max(0, run.glyphs.length - 1);
}

/**
 * One string as glyph outlines. `y` is the baseline, not the top of the line.
 * The inner scale flips Y because font outlines are drawn with Y pointing up.
 */
function glyphs(text, { font, weight, size, tracking = 0, x, y, fill, anchor = 'start' }) {
  const run = font.getVariation({ wght: weight }).layout(text);
  const scale = size / font.unitsPerEm;
  const trackUnits = tracking / scale;

  let cursor = 0;
  const parts = [];
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const d = glyph.path.toSVG();
    if (d) {
      const dx = (cursor + (pos.xOffset || 0)).toFixed(1);
      const dy = (pos.yOffset || 0).toFixed(1);
      parts.push(`<path transform="translate(${dx},${dy})" d="${d}"/>`);
    }
    cursor += pos.xAdvance + trackUnits;
  });

  const width = run.advanceWidth * scale + tracking * Math.max(0, run.glyphs.length - 1);
  const left = anchor === 'end' ? x - width : x;
  return `<g transform="translate(${left.toFixed(1)},${y.toFixed(1)}) scale(${scale},${-scale})" fill="${fill}">${parts.join('')}</g>`;
}

function wrap(text, maxWidth, opts) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, opts) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Cuts a wrapped block to `max` lines. A description that simply stops mid-
 * sentence reads as a bug, so the last kept line loses words until an ellipsis
 * fits after it.
 */
function clamp(lines, max, maxWidth, opts) {
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  const words = kept[max - 1].split(' ');
  while (words.length > 1 && measure(`${words.join(' ')}…`, opts) > maxWidth) words.pop();
  kept[max - 1] = `${words.join(' ').replace(/[,;:]$/, '')}…`;
  return kept;
}

/**
 * Display type is sized to the copy, not the other way round. A long title set
 * at the size a short one wants is the most reliable way to make a card look
 * automated, so the size steps down until the title fits in three lines.
 */
function fitTitle(text, { maxWidth, sizes, font, weight, tracking, maxLines }) {
  for (const size of sizes) {
    const lines = wrap(text, maxWidth, { font, weight, size, tracking: tracking * size });
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: wrap(text, maxWidth, { font, weight, size, tracking: tracking * size }).slice(0, maxLines) };
}

// ------------------------------------------------------------------- the owl

/**
 * The mark without its disc, so it can sit in the field as tone rather than as
 * a second logo. Bleeding off the right edge is deliberate — the version that
 * fitted the whole bird on the card read as clip art.
 */
const OWL_GLYPH = (fill, ear, eye) => `
  <ellipse cx="144.56" cy="321.963" rx="74.5603" ry="125.871" fill="${ear}"/>
  <ellipse cx="368.56" cy="321.963" rx="74.5603" ry="125.871" fill="${ear}"/>
  <ellipse cx="254.397" cy="368.463" rx="157.138" ry="186.802" fill="${fill}"/>
  <path d="M167.009 115.118C140.552 133.557 110.621 186.471 104.474 216.135C104.474 216.135 146.164 282.678 256 282.678C365.836 282.678 409 221.266 409 216.135C409 209.721 393.897 140.773 365.836 121.532C337.776 102.29 311.319 91.8677 259.207 91.066C207.095 90.2643 193.465 96.6781 167.009 115.118Z" fill="${fill}"/>
  <path d="M258.736 232.014C258.214 234.003 255.389 234.003 254.867 232.014L247.045 202.207C246.712 200.939 247.669 199.7 248.98 199.7L264.624 199.7C265.935 199.7 266.891 200.939 266.558 202.207L258.736 232.014Z" fill="${eye}"/>
  <path d="M203.08 162C216.959 162 221.986 169.702 222.773 173.951C223.299 177.67 223.246 186.062 218.835 189.887C213.321 194.667 195.473 200.325 190.476 185.106C186.814 173.951 188.375 169.171 188.113 169.171C190.476 163.631 195.256 162 203.08 162Z" fill="${eye}"/>
  <path d="M308.124 160.851C294.151 160.851 289.09 168.637 288.297 172.932C287.768 176.691 287.821 185.174 292.262 189.04C297.814 193.873 315.782 199.592 320.813 184.208C324.5 172.932 322.928 168.1 323.192 168.1C320.813 162.5 316 160.851 308.124 160.851Z" fill="${eye}"/>`;

const OWL_MARK = `
  <rect width="512" height="512" rx="256" fill="#968FF8"/>
  <ellipse cx="144.56" cy="321.963" rx="74.5603" ry="125.871" fill="#2B303D"/>
  <ellipse cx="368.56" cy="321.963" rx="74.5603" ry="125.871" fill="#2B303D"/>
  <ellipse cx="254.397" cy="368.463" rx="157.138" ry="186.802" fill="#1A1D24"/>
  <path d="M167.009 115.118C140.552 133.557 110.621 186.471 104.474 216.135C104.474 216.135 146.164 282.678 256 282.678C365.836 282.678 409 221.266 409 216.135C409 209.721 393.897 140.773 365.836 121.532C337.776 102.29 311.319 91.8677 259.207 91.066C207.095 90.2643 193.465 96.6781 167.009 115.118Z" fill="#1A1D24"/>
  <path d="M258.736 232.014C258.214 234.003 255.389 234.003 254.867 232.014L247.045 202.207C246.712 200.939 247.669 199.7 248.98 199.7L264.624 199.7C265.935 199.7 266.891 200.939 266.558 202.207L258.736 232.014Z" fill="#CBCBCE"/>
  <path d="M203.08 162C216.959 162 221.986 169.702 222.773 173.951C223.299 177.67 223.246 186.062 218.835 189.887C213.321 194.667 195.473 200.325 190.476 185.106C186.814 173.951 188.375 169.171 188.113 169.171C190.476 163.631 195.256 162 203.08 162Z" fill="#CBCBCE"/>
  <path d="M308.124 160.851C294.151 160.851 289.09 168.637 288.297 172.932C287.768 176.691 287.821 185.174 292.262 189.04C297.814 193.873 315.782 199.592 320.813 184.208C324.5 172.932 322.928 168.1 323.192 168.1C320.813 162.5 316 160.851 308.124 160.851Z" fill="#CBCBCE"/>`;

// ------------------------------------------------------------------ the card

function escXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * @param {object} card
 * @param {string} card.label      small line beside the mark, already uppercased
 * @param {string} card.title      the one thing someone reads
 * @param {string} [card.sub]      a sentence under it, two lines at most
 * @param {string} [card.metaLeft]
 * @param {string} [card.metaRight]
 * @param {boolean} [card.stat]    set the title as a figure (a version number)
 */
function buildCard({ label, title, sub, metaLeft, metaRight, stat = false }) {
  const out = [];

  // The field, the mark bleeding off the right, and a film of grain over both.
  out.push(`<rect width="${W}" height="${H}" fill="${C.field}"/>`);
  // 880px across, hung 180px off the right edge and 300px below the bottom.
  out.push(`<g transform="translate(500, 50) scale(${880 / 512})">${OWL_GLYPH(C.owl, C.owlEar, C.owlEye)}</g>`);
  out.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.085"/>`);

  // Label row — the mark at 38px, the label set beside it on the same centre.
  const markSize = 38;
  const labelSize = 19;
  const labelTracking = 2.8;
  out.push(`<g transform="translate(${PAD_X}, ${PAD_TOP}) scale(${markSize / 512})">${OWL_MARK}</g>`);
  out.push(glyphs(label, {
    font: fonts.mono, weight: 500, size: labelSize, tracking: labelTracking,
    x: PAD_X + markSize + 14,
    y: PAD_TOP + markSize / 2 + labelSize * 0.36,
    fill: C.label,
  }));

  // Metadata sits on a rule along the bottom.
  const metaSize = 18;
  const metaBaseline = H - PAD_BOTTOM - 2;
  const ruleY = metaBaseline - metaSize - 20;
  out.push(`<rect x="${PAD_X}" y="${ruleY}" width="${W - PAD_X * 2}" height="1" fill="${C.rule}"/>`);
  if (metaLeft) {
    out.push(glyphs(metaLeft, {
      font: fonts.mono, weight: 400, size: metaSize, tracking: 0.4,
      x: PAD_X, y: metaBaseline, fill: C.meta,
    }));
  }
  if (metaRight) {
    out.push(glyphs(metaRight, {
      font: fonts.mono, weight: 400, size: metaSize, tracking: 0.4,
      x: W - PAD_X, y: metaBaseline, fill: C.meta, anchor: 'end',
    }));
  }

  // The title block, centred in what is left between the label and the rule.
  const titleWidth = stat ? 900 : 800;
  const titleTracking = stat ? -0.04 : -0.032;
  const { size: titleSize, lines: titleLines } = stat
    ? { size: 112, lines: [title] }
    : fitTitle(title, {
        maxWidth: titleWidth, sizes: [68, 60, 53, 47], font: fonts.sans,
        weight: 800, tracking: titleTracking, maxLines: 3,
      });
  const titleLineHeight = titleSize * 1.06;

  const subSize = 25;
  const subLineHeight = subSize * 1.42;
  const subOpts = { font: fonts.sans, weight: 400, size: subSize };
  const subLines = sub ? clamp(wrap(sub, 700, subOpts), 2, 700, subOpts) : [];

  const gap = subLines.length ? 20 : 0;
  const blockHeight = titleLines.length * titleLineHeight + gap + subLines.length * subLineHeight;
  const zoneTop = PAD_TOP + markSize + 30;
  const zoneBottom = ruleY - 30;
  const blockTop = zoneTop + (zoneBottom - zoneTop - blockHeight) / 2;

  titleLines.forEach((line, i) => {
    out.push(glyphs(line, {
      font: fonts.sans, weight: 800, size: titleSize, tracking: titleTracking * titleSize,
      x: PAD_X,
      y: blockTop + i * titleLineHeight + baselineOffset(fonts.sans, titleSize, titleLineHeight),
      fill: C.title,
    }));
  });

  const subTop = blockTop + titleLines.length * titleLineHeight + gap;
  subLines.forEach((line, i) => {
    out.push(glyphs(line, {
      font: fonts.sans, weight: 400, size: subSize,
      x: PAD_X,
      y: subTop + i * subLineHeight + baselineOffset(fonts.sans, subSize, subLineHeight),
      fill: C.sub,
    }));
  });

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>
    </filter>
    <clipPath id="card"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <g clip-path="url(#card)">
    ${out.join('\n    ')}
  </g>
</svg>`;
}

// -------------------------------------------------------------------- content

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

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

const staticPages = [
  { path: 'why-gryt', title: 'Why Gryt?', description: 'Why we built an open-source, self-hosted voice chat platform.' },
  { path: 'blog', title: 'Blog', description: 'Stories, updates, and technical deep-dives from the Gryt team.' },
  { path: 'privacy', title: 'Privacy Policy', description: 'How Gryt handles your data. We collect as little as we can get away with.' },
  { path: 'community-guidelines', title: 'Community Guidelines', description: 'Rules and expectations for the Gryt community.' },
  { path: 'invite', title: 'Invite', description: 'Join a Gryt server with an invite link.' },
];

/**
 * Quantised to 64 colours. The grain defeats PNG's row filters, so a truecolour
 * card lands at a megabyte — thirteen times the old ones — for a texture nobody
 * looks at directly. The card is a flat field, a two-tone bird and four shades
 * of near-white, so 64 entries covers it, and the grain doubles as dithering.
 */
async function write(svg, file) {
  await sharp(Buffer.from(svg)).png({ palette: true, colours: 64 }).toFile(file);
  console.log(`  ${file.slice(publicDir.length - 6)}`);
}

await loadFonts();

// Homepage
await write(buildCard({
  label: 'GRYT',
  title: 'Voice, text and video chat you host yourself',
  sub: 'Open source, and yours to run.',
  metaLeft: 'gryt.chat',
  metaRight: 'WebRTC · self-hosted',
}), join(publicDir, 'og-image.png'));

// Standing pages
for (const page of staticPages) {
  const outDir = join(publicDir, page.path);
  mkdirSync(outDir, { recursive: true });
  await write(buildCard({
    label: 'GRYT',
    title: page.title,
    sub: page.description,
    metaLeft: 'gryt.chat',
    metaRight: `gryt.chat/${page.path}`,
  }), join(outDir, 'og.png'));
}

// Blog posts
for (const file of readdirSync(blogContentDir).filter((f) => f.endsWith('.mdx'))) {
  const fm = parseFrontmatter(join(blogContentDir, file));
  if (!fm?.title) continue;
  const slug = basename(file, '.mdx');
  const outDir = join(publicDir, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  await write(buildCard({
    label: 'GRYT · BLOG',
    title: fm.title,
    sub: fm.description,
    metaLeft: [fm.author || 'Gryt', formatDate(fm.date)].filter(Boolean).join(' · '),
    metaRight: 'gryt.chat/blog',
  }), join(outDir, 'og.png'));
}

// Releases
const changelogFiles = existsSync(changelogContentDir)
  ? readdirSync(changelogContentDir).filter((f) => f.endsWith('.mdx'))
  : [];

for (const file of changelogFiles) {
  const fm = parseFrontmatter(join(changelogContentDir, file));
  if (!fm?.version) continue;
  const slug = basename(file, '.mdx');
  const outDir = join(publicDir, 'changelog', slug);
  mkdirSync(outDir, { recursive: true });
  await write(buildCard({
    label: ['GRYT', 'CHANGELOG', fm.channel === 'beta' ? 'BETA' : null].filter(Boolean).join(' · '),
    title: fm.version,
    sub: fm.headline,
    metaLeft: formatDate(fm.date),
    metaRight: 'gryt.chat/changelog',
    stat: true,
  }), join(outDir, 'og.png'));
}

console.log('Done generating OG images.');
