/**
 * Text as glyph outlines, for the share cards and the repo banners. librsvg resolves
 * `font-family` against installed fonts, so neither image may contain a <text>.
 */
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const fontsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fonts');

export interface TextStyle {
  font: fontkit.Font;
  weight: number;
  size: number;
  tracking?: number;
}

export async function loadFonts() {
  const load = async (file: string) => {
    const ttf = Buffer.from(await wawoff2.decompress(readFileSync(join(fontsDir, file))));
    return fontkit.create(ttf);
  };
  const sans = await load('AtkinsonHyperlegibleNextVF-Variable.woff2');
  const mono = await load('AtkinsonHyperlegibleMonoVF-Variable.woff2');
  return { sans, mono };
}

/** Where the baseline sits inside a line box, per the CSS half-leading model. */
export function baselineOffset(font: fontkit.Font, size: number, lineHeight: number) {
  const { ascent, descent, unitsPerEm } = font;
  const contentHeight = ((ascent - descent) / unitsPerEm) * size;
  return (lineHeight - contentHeight) / 2 + (ascent / unitsPerEm) * size;
}

export function measure(text: string, { font, weight, size, tracking = 0 }: TextStyle) {
  const run = font.getVariation({ wght: weight }).layout(text);
  const scale = size / font.unitsPerEm;
  return run.advanceWidth * scale + tracking * Math.max(0, run.glyphs.length - 1);
}

/**
 * One string as glyph outlines. `y` is the baseline, not the top of the line.
 * The inner scale flips Y because font outlines are drawn with Y pointing up.
 */
export function glyphs(
  text: string,
  { font, weight, size, tracking = 0, x, y, fill, anchor = 'start' }: TextStyle & { x: number; y: number; fill: string; anchor?: 'start' | 'end' },
) {
  const run = font.getVariation({ wght: weight }).layout(text);
  const scale = size / font.unitsPerEm;
  const trackUnits = tracking / scale;

  let cursor = 0;
  const parts: string[] = [];
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

export function wrap(text: string, maxWidth: number, opts: TextStyle) {
  const words = text.split(' ');
  const lines: string[] = [];
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
 * Cuts a wrapped block to `max` lines. A description that stops mid-sentence reads as a bug,
 * so the last kept line loses words until an ellipsis fits after it.
 */
export function clamp(lines: string[], max: number, maxWidth: number, opts: TextStyle) {
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  const words = kept[max - 1].split(' ');
  while (words.length > 1 && measure(`${words.join(' ')}…`, opts) > maxWidth) words.pop();
  kept[max - 1] = `${words.join(' ').replace(/[,;:]$/, '')}…`;
  return kept;
}
