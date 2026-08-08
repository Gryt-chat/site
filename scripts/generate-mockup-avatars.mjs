/**
 * Renders the avatars the landing-page mockup shows, at build time.
 *
 * The mockup is a hand-built copy of the app, so it has to be updated by hand
 * when the app changes — and the app now draws a face for anyone without an
 * avatar and a planet for a server without an icon. A mockup still showing
 * letter tiles is advertising a version that no longer exists.
 *
 * Rendered here rather than in the browser because DiceBear is a build-time
 * cost worth paying once, and a runtime cost paid by every visitor to a page
 * whose whole job is loading fast. The output is a handful of small files.
 *
 * Kept in step with the client by hand: same styles, same palette, same seed
 * rule (the nickname, lowercased). If those change in
 * packages/client/src/packages/common/src/utils/generatedAvatar.ts, they change
 * here too. There is no import that would catch the drift — the client is a
 * different package with a different build.
 */
import { Avatar, Style } from '@dicebear/core';
import moods from '@dicebear/styles/moods.json' with { type: 'json' };
import planets from '@dicebear/styles/planets.json' with { type: 'json' };
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'mockup');

// The client's tile hues, and the pastel derived from each. Copied rather than
// imported, for the reason in the header comment.
const TILE_HUES = [280, 24, 170, 330, 210, 140, 350, 45, 260, 195];

function pastel(hue) {
  const c = 0.24;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = 0.68;
  const t =
    hue < 60 ? [c, x, 0]
    : hue < 120 ? [x, c, 0]
    : hue < 180 ? [0, c, x]
    : hue < 240 ? [0, x, c]
    : hue < 300 ? [x, 0, c]
    : [c, 0, x];
  return t.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

const AVATAR_COLOURS = TILE_HUES.map(pastel);
const TRANSPARENT = '00000000';

const moodsStyle = new Style(moods);
const planetsStyle = new Style(planets);

/**
 * Everyone and every server the mockup shows, read out of data.ts rather than
 * listed here — a name added to the mockup and forgotten here would silently
 * fall back to a letter tile, which is the exact thing this removes.
 */
const mockData = readFileSync(join(__dirname, '..', 'src', 'components', 'app-mockup', 'data.ts'), 'utf8');

const PEOPLE = [...new Set(
  [...mockData.matchAll(/(?:sender|nickname):\s*"([^"]+)"/g)].map((m) => m[1]),
)];

const SERVERS = [...new Set(
  [...mockData.matchAll(/\{\s*name:\s*"([^"]+)",\s*fallback:/g)].map((m) => m[1]),
)];

if (PEOPLE.length === 0 || SERVERS.length === 0) {
  throw new Error('Found no mockup names — data.ts shape changed, and this would have silently produced nothing.');
}

mkdirSync(outDir, { recursive: true });

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

for (const nickname of PEOPLE) {
  const { svg } = new Avatar(moodsStyle, {
    seed: nickname.trim().toLowerCase(),
    faceColor: AVATAR_COLOURS,
    backgroundColor: [TRANSPARENT],
  }).toJSON();
  writeFileSync(join(outDir, `${slug(nickname)}.svg`), svg);
  console.log(`  public/mockup/${slug(nickname)}.svg`);
}

for (const name of SERVERS) {
  const svg = new Avatar(planetsStyle, { seed: name }).toString();
  writeFileSync(join(outDir, `server-${slug(name)}.svg`), svg);
  console.log(`  public/mockup/server-${slug(name)}.svg`);
}

console.log('Done generating mockup avatars.');
