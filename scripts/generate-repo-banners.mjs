/**
 * Draws a GitHub social preview for every Gryt repository, at 1280x640.
 *
 * GitHub shows this image wherever a repo link is pasted — Discord, Slack, a
 * timeline. Without one it generates a grey card from the avatar and the
 * description, so twenty-two Gryt repos all looked like the same grey card.
 * These carry the repo's own name, which is the thing you are trying to tell
 * apart in a channel full of links.
 *
 * The six repos that do have a custom banner are the archived 2023-24 ones, and
 * that banner is the owl on a purple field with no text at all — handsome, and
 * indistinguishable from every sibling.
 *
 * ## Why this duplicates generate-og-image.mjs
 *
 * The glyph plumbing below is copied from it rather than shared. Extracting a
 * common module means editing that file, and this machine's sharp is built
 * without libimagequant, so re-running it rewrites all thirty-five committed
 * cards with different bytes — leaving no way to show the extraction changed
 * nothing. Copying is the honest trade until the two diverge or someone runs it
 * somewhere the output is reproducible.
 *
 * Run by hand: `yarn generate:banners`. Upload is manual — GitHub has no API
 * for the social preview, only Settings -> General -> Social preview.
 */
import { mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import * as fontkit from 'fontkit';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const fontsDir = join(publicDir, 'fonts');
/* Not committed — see .gitignore. A card here weighs 700KB against the 200KB
   the site's own cards weigh, because sharp built without libimagequant falls
   back to a worse quantiser, and that is a property of the machine rather than
   of the card. They are upload fodder, so regenerating beats storing. */
const outDir = join(publicDir, 'repo-banners');

/* 2:1, which is what GitHub crops to. Twice the nominal 640x320 so it stays
   sharp on a retina timeline. */
const W = 1280;
const H = 640;

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

// ---------------------------------------------------------------- the banner

/* The repo name is set in mono. It is an identifier, not a headline, and it is
   the one thing somebody is trying to read off a link in a busy channel. */
function buildBanner({ name, description }) {
  const out = [];

  out.push(`<rect width="${W}" height="${H}" fill="${C.field}"/>`);
  out.push(`<g transform="translate(560, 60) scale(${900 / 512})">${OWL_GLYPH(C.owl, C.owlEar, C.owlEye)}</g>`);
  out.push(`<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.085"/>`);

  const markSize = 38;
  const labelSize = 19;
  out.push(`<g transform="translate(${PAD_X}, ${PAD_TOP}) scale(${markSize / 512})">${OWL_MARK}</g>`);
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
