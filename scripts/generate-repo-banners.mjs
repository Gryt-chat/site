/* A GitHub social preview per Gryt repo, 1280x640. Without one, every repo
   link pastes as the same grey card. Reasoning in the commit and site#132. */
import { mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import * as fontkit from 'fontkit';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const fontsDir = join(publicDir, 'fonts');
/* Gitignored: 700KB a card here vs the site's 200KB, because sharp without
   libimagequant quantises worse. Upload fodder, so regenerate rather than store. */
const outDir = join(publicDir, 'repo-banners');

/* 2:1, which is what GitHub crops to. Twice the nominal 640x320 so it stays
   sharp on a retina timeline. */
const W = 1280;
const H = 640;

const C = {
  field: '#6157d8',
  title: '#fbfaff',
  sub: '#dedaff',
  label: '#eeecff',
  meta: '#e2dfff',
  rule: '#8079e4',
};

/* The big owl behind the type, recoloured below the field — same table as the OG cards. */
const OWL_TONES = {
  '#B5A8E6': '#5850cc',
  '#A495E3': '#4f47c0',
  '#7C6EC3': '#4038a4',
  '#2E2D5F': '#332c86',
};

const PAD_X = 64;
const PAD_TOP = 60;
const PAD_BOTTOM = 60;

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

/* One string as glyph outlines, so the card does not depend on an installed
   font. `y` is the baseline; the inner scale flips Y for font coordinates. */
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

/* A description that stops mid-sentence reads as a bug, so the last kept line
   loses words until an ellipsis fits after it. */
function clamp(lines, max, maxWidth, opts) {
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  const words = kept[max - 1].split(' ');
  while (words.length > 1 && measure(`${words.join(' ')}…`, opts) > maxWidth) words.pop();
  kept[max - 1] = `${words.join(' ').replace(/[,;:]$/, '')}…`;
  return kept;
}

// ------------------------------------------------------------------- the owl

/* Read from public/, never inlined: an inlined copy is how the old bird survived the redraw. */
function readMark(name, ns) {
  const raw = readFileSync(join(publicDir, name), 'utf8');
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  if (!inner.trim()) throw new Error(`${name}: no drawing found`);
  // Both files share a Figma clipPath id; namespace them so two on one card do not collide.
  const ids = [...inner.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  let out = inner;
  for (const id of ids) {
    out = out.split(`id="${id}"`).join(`id="${ns}-${id}"`);
    out = out.split(`url(#${id})`).join(`url(#${ns}-${id})`);
  }
  return out;
}

const OWL_MARK = readMark('logo.svg', 'mark');

/* Recoloured by hex, so a redrawn mark with a new palette stops the run instead of drawing wrong. */
const OWL_GLYPH = (() => {
  let svg = readMark('logo-square.svg', 'glyph');
  const ground = /<rect[^>]*fill="#2E2D5F"[^>]*\/>/i;
  if (!ground.test(svg)) throw new Error('logo-square.svg: no ground rect to drop');
  svg = svg.replace(ground, '');
  for (const [from, to] of Object.entries(OWL_TONES)) {
    if (!new RegExp(`fill="${from}"`, 'i').test(svg)) {
      throw new Error(`logo-square.svg: nothing painted ${from} — retune OWL_TONES`);
    }
    svg = svg.replace(new RegExp(`fill="${from}"`, 'gi'), `fill="${to}"`);
  }
  return svg;
})();

// ---------------------------------------------------------------- the banner

/* The repo name is set in mono. It is an identifier, not a headline, and it is
   the one thing somebody is trying to read off a link in a busy channel. */
function buildBanner({ name, description }) {
  const out = [];

  out.push(`<rect width="${W}" height="${H}" fill="${C.field}"/>`);
  out.push(`<g transform="translate(660, 30) scale(${660 / 1024})">${OWL_GLYPH}</g>`);
  out.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.085"/>`);

  const markSize = 38;
  const labelSize = 19;
  out.push(`<g transform="translate(${PAD_X}, ${PAD_TOP}) scale(${markSize / 1024})">${OWL_MARK}</g>`);
  out.push(glyphs('GRYT', {
    font: fonts.mono, weight: 500, size: labelSize, tracking: 2.8,
    x: PAD_X + markSize + 14,
    y: PAD_TOP + markSize / 2 + labelSize * 0.36,
    fill: C.label,
  }));

  const metaSize = 18;
  const metaBaseline = H - PAD_BOTTOM - 2;
  const ruleY = metaBaseline - metaSize - 20;
  out.push(`<rect x="${PAD_X}" y="${ruleY}" width="${W - PAD_X * 2}" height="1" fill="${C.rule}"/>`);
  out.push(glyphs(`github.com/Gryt-chat/${name}`, {
    font: fonts.mono, weight: 400, size: metaSize, tracking: 0.4,
    x: PAD_X, y: metaBaseline, fill: C.meta,
  }));

  /* Stepped down only for the longest names, so `sfu` and `image-worker` are
     not set at the same size as each other. */
  const nameOpts = (size) => ({ font: fonts.mono, weight: 700, size, tracking: -0.02 * size });
  let nameSize = 92;
  for (const size of [92, 80, 68, 58]) {
    nameSize = size;
    if (measure(name, nameOpts(size)) <= W - PAD_X * 2 - 60) break;
  }
  const nameLineHeight = nameSize * 1.08;

  const subSize = 25;
  const subLineHeight = subSize * 1.42;
  const subOpts = { font: fonts.sans, weight: 400, size: subSize };
  const subLines = description
    ? clamp(wrap(description, 760, subOpts), 3, 760, subOpts)
    : [];

  const gap = subLines.length ? 22 : 0;
  const blockHeight = nameLineHeight + gap + subLines.length * subLineHeight;
  const zoneTop = PAD_TOP + markSize + 30;
  const zoneBottom = ruleY - 30;
  const blockTop = zoneTop + (zoneBottom - zoneTop - blockHeight) / 2;

  out.push(glyphs(name, {
    ...nameOpts(nameSize),
    x: PAD_X,
    y: blockTop + baselineOffset(fonts.mono, nameSize, nameLineHeight),
    fill: C.title,
  }));

  const subTop = blockTop + nameLineHeight + gap;
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

// -------------------------------------------------------------------- output

const REPOS = JSON.parse(readFileSync(join(__dirname, 'repo-banners.json'), 'utf-8'));

await loadFonts();
mkdirSync(outDir, { recursive: true });

for (const repo of REPOS) {
  const svg = buildBanner(repo);
  const file = join(outDir, `${repo.name}.png`);
  await sharp(Buffer.from(svg)).png({ palette: true, colours: 64 }).toFile(file);
  console.log(`  ${repo.name}.png`);
}

console.log(`\n${REPOS.length} banners in public/repo-banners/`);
console.log('Upload each at Settings -> General -> Social preview; GitHub has no API for it.');
