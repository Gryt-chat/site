/**
 * The changelog lines as data, for anything that is not this site. The client
 * reads it to say what changed the first time somebody opens a new version.
 */

import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Imported rather than parsed: the lines carry quotes and apostrophes, and a
// regex over them is a way to ship a truncated sentence without noticing.
const releases = await import(join(root, "content/changelog/releases.ts"));

/** Versions with real prose beside the line. Only the app has them. */
const notes = new Set(
  readdirSync(join(root, "content/changelog"))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, "")),
);

const SURFACES = ["app", "server", "voice", "images"];

const payload = { generated: new Date().toISOString() };
for (const surface of SURFACES) {
  const list = releases[surface];
  if (!Array.isArray(list)) throw new Error(`releases.ts no longer exports ${surface}`);
  payload[surface] = list.map((entry) => ({
    version: entry.version,
    date: entry.date,
    line: entry.line,
    ...(entry.channel ? { channel: entry.channel } : {}),
    ...(entry.post ? { post: entry.post } : {}),
    // Whether /changelog/<version> has prose to read, so a caller can decide
    // between linking there and linking at the index.
    ...(surface === "app" && notes.has(entry.version) ? { note: true } : {}),
  }));
}

// public/, so vite copies it into dist and the dev server serves it too.
const out = join(root, "public/changelog.json");
writeFileSync(out, JSON.stringify(payload));

const counts = SURFACES.map((s) => `${s} ${payload[s].length}`).join(", ");
console.log(`changelog.json: ${counts}`);
