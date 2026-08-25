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
import { STATIC_PAGES } from '../src/lib/pages.mjs';

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
  title: '#fbfaff',
  sub: '#dedaff',
  label: '#eeecff',
  meta: '#e2dfff',
  rule: '#8079e4',
};

/**
 * The big owl behind the type is the mark's own drawing, recoloured to sit in
 * the field as tone rather than as a second logo.
 *
 * Every value here is below the field, so the glyph can only add contrast under
 * the white type, never take it away. That is the property to keep if these are
 * ever retuned: the card's whole contrast budget is white-on-#6157d8, and a
 * tone lighter than the field spends it.
 *
 * The order is the mark's own — face lightest, then body, then the wings, with
 * the eyes and beak darkest. In the mark those three are painted the ground
 * colour, so they are holes rather than shapes; there is no ground here, so
 * they get a value of their own and keep their place at the dark end.
 */
const OWL_TONES = {
  '#B5A8E6': '#5850cc', // face
  '#A495E3': '#4f47c0', // body
  '#7C6EC3': '#4038a4', // wings
  '#2E2D5F': '#332c86', // eyes and beak
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
 * Both owls on the card are read out of public/, not copied into this file.
 *
 * They used to be inlined here — the glyph once and the whole mark again — and
 * when the mark was redrawn in GRYT-600 the three files in public/ were swapped
 * and these two were not. Nothing failed. Every share card for all 32 pages
 * went on showing the old bird beside a site, a client and a docs build that
 * had all moved on, and the only way to notice was to look at one.
 *
 * `logo.svg` is the mark, under a circular clip, and `logo-square.svg` the same
 * drawing on its full artboard. The label row takes the mark, matching the
 * favicon; the big background glyph takes the square one with its ground
 * dropped, because it crops the bird itself and a circular clip would cut the
 * bleed the composition is built on.
 */

function readMark(name, ns) {
  const raw = readFileSync(join(publicDir, name), 'utf8');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  if (!inner.trim()) throw new Error(`${name}: no drawing found`);

  /*
   * Both files came out of the same Figma frame, so both carry the same
   * clipPath id. Two of them on one card is a duplicate id, the first
   * definition wins, and the round mark quietly got the square one's clip —
   * a square logo in the label row, no warning, and the run exits 0.
   */
  const ids = [...inner.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  if (!ids.length) return inner;
  let out = inner;
  for (const id of ids) {
    out = out.split(`id="${id}"`).join(`id="${ns}-${id}"`);
    out = out.split(`url(#${id})`).join(`url(#${ns}-${id})`);
  }
  return out;
}

/** The mark at label size, in its own colours, under its circular clip. */
const OWL_MARK = readMark('logo.svg', 'mark');

/**
 * The mark without its ground, recoloured into the field.
 *
 * Substituting on the hex values means a redrawn mark that keeps the palette
 * needs no edit here, and one that changes it stops the run rather than
 * quietly drawing something else — which is the failure this whole comment is
 * about. The match is case-insensitive because a hex is a string and Figma and
 * a human do not agree on which case to write it in.
 */
const OWL_GLYPH = (() => {
  let svg = readMark('logo-square.svg', 'glyph');

  // The ground. It is the card's field that shows through instead.
  const ground = /<rect[^>]*fill="#2E2D5F"[^>]*\/>/i;
  if (!ground.test(svg)) throw new Error('logo-square.svg: no ground rect to drop');
  svg = svg.replace(ground, '');

  for (const [from, to] of Object.entries(OWL_TONES)) {
    // A fresh regex per pass. `test` on a /g regex advances lastIndex, so
    // reusing one across the check and the replace is the kind of thing that
    // works until it doesn't.
    if (!new RegExp(`fill="${from}"`, 'i').test(svg)) {
      throw new Error(`logo-square.svg: nothing painted ${from} — the mark's palette moved, retune OWL_TONES`);
    }
    svg = svg.replace(new RegExp(`fill="${from}"`, 'gi'), `fill="${to}"`);
  }
  return svg;
})();

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
  /*
   * 635px across, hung off the right edge and the bottom.
   *
   * Placed on the beak rather than on the artboard. The new drawing fills far
   * more of its 1024 box than the old one filled its 512, so keeping the old
   * 880px width cropped the head to a wall of tone and dropped the beak right
   * on the meta line — legible, because every owl tone is darker than the
   * field, but the URL sat in the middle of a face.
   *
   * These two numbers put the beak just above the rule and the crown just
   * below the title, which is where the old card had them. Retuning them is a
   * matter of looking at a card, not of arithmetic on the artboard.
   */
  out.push(`<g transform="translate(620, 30) scale(${635 / 1024})">${OWL_GLYPH}</g>`);
  out.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.085"/>`);

  // Label row — the mark at 38px, the label set beside it on the same centre.
  const markSize = 38;
  const labelSize = 19;
  const labelTracking = 2.8;
  out.push(`<g transform="translate(${PAD_X}, ${PAD_TOP}) scale(${markSize / 1024})">${OWL_MARK}</g>`);
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
for (const page of STATIC_PAGES) {
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
