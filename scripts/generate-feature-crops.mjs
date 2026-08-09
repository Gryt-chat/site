/**
 * Cuts the feature-card images out of a real screenshot of the client.
 *
 * The cards on the front page show the actual app rather than a redrawn copy of
 * it, so they cannot go stale in the way the landing-page mockup does. The
 * source is the same capture the 1.4.0 release notes use.
 *
 * Panel boundaries were measured off the pixels (columns where the panel
 * background lifts away from the page background), not eyeballed. If the client
 * layout changes, retake the screenshot and re-measure rather than nudging
 * these numbers until it looks right.
 *
 * Run by hand — `yarn generate:crops` — not by `yarn build`. Output is
 * committed, same as the OG images.
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const source = join(publicDir, 'changelog', 'voice-split.webp');
const outDir = join(publicDir, 'features');

/** Panels span y 55–1064 in the source. Heights below are trimmed per card so
 *  each lands on an aspect that reads at card size. */
const crops = [
  { name: 'voice', left: 332, top: 72, width: 600, height: 450 },
  { name: 'chat', left: 940, top: 118, width: 511, height: 620 },
  { name: 'members', left: 1469, top: 55, width: 241, height: 692 },
  { name: 'channels', left: 0, top: 55, width: 318, height: 620 },
];

mkdirSync(outDir, { recursive: true });

for (const { name, ...region } of crops) {
  const file = join(outDir, `${name}.webp`);
  await sharp(source).extract(region).webp({ quality: 90 }).toFile(file);
  console.log(`  public/features/${name}.webp  ${region.width}x${region.height}`);
}

console.log('Done generating feature crops.');
