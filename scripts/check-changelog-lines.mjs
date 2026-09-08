/**
 * The changelog lines against the releases that actually happened.
 *
 * Written after twenty-seven of the first sixty dates went in wrong. They were
 * typed from the commit ranges rather than read off the releases, which is the
 * one thing `patch-notes-style.md` opens by saying not to do: *never from
 * memory*. Nothing failed, the page rendered, and every one of those dates was
 * a plausible day either side of the real one.
 *
 * Three things are checked, and the second is the one that costs a reader:
 *
 * - A line naming a version that was never released. Usually a typo in a
 *   version number, which silently invents a release.
 * - A date that disagrees with the release. Invisible, and wrong forever.
 * - A release with no line and no note, which is the gap this page exists to
 *   not have.
 *
 * All four surfaces, because they release on four clocks and the app pass is
 * the only one a human has ever proofread.
 *
 * The release lists are fetched once into `.cache/releases.json` by
 * `fetch-releases.mjs` so this runs offline and in CI without a token.
 */

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const CACHE = ".cache/releases.json";
const SOURCE = "content/changelog/releases.ts";

if (!existsSync(CACHE)) {
  console.log(`${CACHE} is not there — run \`yarn fetch:releases\` first. Skipping.`);
  process.exit(0);
}

/** Published releases per surface, newest first, as {tag, date, prerelease}. */
const published = JSON.parse(readFileSync(CACHE, "utf8"));

if (Array.isArray(published)) {
  console.log(`${CACHE} only holds the app — run \`yarn fetch:releases\` again. Skipping.`);
  process.exit(0);
}

const source = readFileSync(SOURCE, "utf8");

/** Which exported array each entry sits in, so a mistake names its surface. */
const surfaces = [...source.matchAll(/export const (\w+): ReleaseLine\[\] = \[([\s\S]*?)\n\];/g)];
assert.deepEqual(
  surfaces.map(([, name]) => name),
  Object.keys(published),
  "the surfaces in the source and in the cache are not the same set",
);

const entries = [];
for (const [, surface, body] of surfaces) {
  for (const m of body.matchAll(/version: "([^"]+)",\s*\n\s*date: "([^"]+)"/g)) {
    entries.push({ surface, version: m[1], date: m[2] });
  }
}

/** A surface's releases by version, with the leading v off the tag. */
const byVersion = new Map(
  Object.entries(published).map(([surface, list]) => [
    surface,
    new Map(list.map((r) => [r.tag.replace(/^v/, ""), r])),
  ]),
);

/* ── every line names a release that happened ────────────────────────────── */

const invented = entries
  .filter((e) => !byVersion.get(e.surface).has(e.version))
  .map((e) => `${e.surface} ${e.version}`);

assert.deepEqual(invented, [], "lines naming a version that was never released");

/* ── every date is the release's own ─────────────────────────────────────── */

const wrong = entries
  .map((e) => ({ ...e, released: byVersion.get(e.surface).get(e.version).date.slice(0, 10) }))
  .filter((e) => e.released !== e.date)
  .map((e) => `${e.surface} ${e.version}: line says ${e.date}, released ${e.released}`);

assert.deepEqual(wrong, [], "lines whose date is not the release's");

/* ── every release is on the page ────────────────────────────────────────── */

// A note is an MDX file named for its version, so the directory is the list.
// Only the app has them; the other three are lines or nothing.
const notes = new Set(
  readdirSync("content/changelog")
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, "")),
);

/* Stable only. A `-beta.N` is a build of a version rather than a version: 1.4.0
   had twenty of them, and twenty lines saying "another 1.4.0 build" is the
   noise patch-notes-style.md means when it says a note about deleting a dead
   script is worse than silence. A beta that carried something gets a line the
   same as anything else; it is just not required to. */
const missing = [];
for (const [surface, list] of Object.entries(published)) {
  const lined = new Set(entries.filter((e) => e.surface === surface).map((e) => e.version));
  for (const release of list) {
    if (release.prerelease) continue;
    const version = release.tag.replace(/^v/, "");
    if (lined.has(version)) continue;
    if (surface === "app" && notes.has(version)) continue;
    missing.push(`${surface} ${version}`);
  }
}

assert.deepEqual(missing, [], "releases with neither a line nor a note — the page would not list them");

console.log(
  `changelog: ${entries.length} lines across ${surfaces.length} surfaces, every date matches`,
);
