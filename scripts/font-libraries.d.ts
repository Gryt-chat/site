// The parts of fontkit and wawoff2 that glyphs.ts uses. Neither package ships types.
declare module 'fontkit' {
  export interface Glyph {
    path: { toSVG(): string };
  }
  export interface GlyphRun {
    glyphs: Glyph[];
    positions: { xAdvance: number; xOffset: number; yOffset: number }[];
    advanceWidth: number;
  }
  export interface Font {
    unitsPerEm: number;
    ascent: number;
    descent: number;
    getVariation(settings: Record<string, number>): Font;
    layout(text: string): GlyphRun;
  }
  export function create(buffer: Buffer): Font;
}

declare module 'wawoff2' {
  const wawoff2: { decompress(input: Uint8Array): Promise<Uint8Array> };
  export default wawoff2;
}
