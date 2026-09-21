/**
 * The changelog lines against the releases that happened, or the one about to: a
 * version invented, a date that disagrees, a release with neither line nor note.
 */

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CACHE = ".cache/releases.json";
const SOURCE = "content/changelog/releases.ts";

/* ── every change says where it is ───────────────────────────────────────── */

// The day areas landed. What's New files a change without one under Other.
const AREA_REQUIRED_FROM = "2026-09-21";

// Imported rather than parsed, and before the cache, so a missing area fails without the network.
const lists = await import(pathToFileURL(resolve(SOURCE)).href);
const areas = Object.keys(lists.AREAS ?? {});
assert.ok(areas.length > 0, `${SOURCE} no longer exports AREAS, so no change can say where it is`);

const unknownArea = [];
const noArea = [];
for (const [surface, list] of Object.entries(lists)) {
  if (!Array.isArray(list)) continue;
  for (const entry of list) {
    for (const [i, change] of (entry.changes ?? []).entries()) {
      const start = change.text.length > 40 ? `${change.text.slice(0, 40)}…` : change.text;
      const which = `${surface} ${entry.version}, change ${i + 1} ("${start}")`;
      if (change.area === undefined) {
        if (surface === "app" && entry.date >= AREA_REQUIRED_FROM) noArea.push(which);
      } else if (!areas.includes(change.area)) {
        unknownArea.push(`${which}: ${JSON.stringify(change.area)}`);
      }
    }
  }
}

assert.deepEqual(unknownArea, [], `changes with an area that isn't one of ${areas.join(", ")}`);
assert.deepEqual(noArea, [], `app changes dated ${AREA_REQUIRED_FROM} or later with no area`);

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

/** 1.2.3 and 1.2.3-beta.4, low to high, with a release above its own betas. */
function compare(a, b) {
  const parse = (v) => {
    const [core, pre] = v.split("-");
    return {
      nums: core.split(".").map(Number),
      pre: pre ? pre.split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : p)) : null,
    };
  };
  const x = parse(a);
  const y = parse(b);

  for (let i = 0; i < Math.max(x.nums.length, y.nums.length); i++) {
    const d = (x.nums[i] ?? 0) - (y.nums[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }

  if (x.pre === null && y.pre === null) return 0;
  if (x.pre === null) return 1;
  if (y.pre === null) return -1;

  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const p = x.pre[i];
    const q = y.pre[i];
    if (p === undefined) return -1;
    if (q === undefined) return 1;
    if (p === q) continue;
    if (typeof p === "number" && typeof q === "number") return p < q ? -1 : 1;
    return String(p) < String(q) ? -1 : 1;
  }
  return 0;
}

/** The highest version each surface has published, or null if it has none. */
const newest = new Map(
  Object.entries(published).map(([surface, list]) => [
    surface,
    list.map((r) => r.tag.replace(/^v/, "")).sort(compare).at(-1) ?? null,
  ]),
);

/* Above everything published means the release has not happened yet, which is
   the normal order now: a release refuses to start without a line (GRYT-1107). */
function ahead(entry) {
  const top = newest.get(entry.surface);
  return top === null || compare(entry.version, top) > 0;
}

const DAY = 24 * 60 * 60 * 1000;
const stale = (entry) => Date.now() - Date.parse(`${entry.date}T00:00:00Z`) > 2 * DAY;

/* ── every line names a release that happened, or one about to ───────────── */

const pending = entries.filter((e) => !byVersion.get(e.surface).has(e.version) && ahead(e));

const invented = entries
  .filter((e) => !byVersion.get(e.surface).has(e.version) && !ahead(e))
  .map((e) => `${e.surface} ${e.version}`);

assert.deepEqual(invented, [], "lines naming a version that was never released");

/* A release that was going to happen has happened by now. One that was not
   leaves a line on the page for something nobody can download. */
const abandoned = pending
  .filter(stale)
  .map((e) => `${e.surface} ${e.version}, written ${e.date}`);

assert.deepEqual(abandoned, [], "lines written ahead of a release that never happened");

/* ── every date is the release's own ─────────────────────────────────────── */

const wrong = entries
  .filter((e) => byVersion.get(e.surface).has(e.version))
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

/* Stable only. A `-beta.N` is a build of a version rather than a version — 1.4.0 had twenty
   — and twenty lines saying "another 1.4.0 build" is noise. A beta may still get one. */
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
  `changelog: ${entries.length} lines across ${surfaces.length} surfaces, every date matches, ` +
    `every app change from ${AREA_REQUIRED_FROM} has an area` +
    (pending.length > 0
      ? `, ${pending.map((e) => `${e.surface} ${e.version}`).join(" and ")} waiting on a release`
      : ""),
);
