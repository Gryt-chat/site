/**
 * The shape the client reads. It looks its own version up in `app` and shows the
 * line, so a field going missing here is a modal that never appears. GRYT-1083.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Built here rather than read off disk, so this passes or fails on the emitter
// rather than on whatever a previous build happened to leave behind.
execFileSync(process.execPath, [join(root, "scripts/emit-changelog-json.mjs")], {
  stdio: "pipe",
});
const data = JSON.parse(readFileSync(join(root, "public/changelog.json"), "utf8"));

for (const surface of ["app", "server", "voice", "images"]) {
  assert.ok(Array.isArray(data[surface]), `changelog.json has no ${surface} array`);
  assert.ok(data[surface].length > 0, `${surface} is empty`);
}

for (const entry of data.app) {
  assert.match(entry.version, /^\d+\.\d+\.\d+/, `an app version is not a version: ${entry.version}`);
  assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/, `${entry.version} has no ISO date`);
  assert.ok(
    typeof entry.line === "string" && entry.line.length > 0,
    `${entry.version} has no line, so the modal would open empty`,
  );
}

/** Newest first, which is the order the source is in and the order a reader wants. */
const dates = data.app.map((e) => e.date);
assert.deepEqual(
  dates,
  [...dates].sort().reverse(),
  "app is not newest first, so 'the latest release' is whichever one is first by luck",
);

// The source is what the site renders; the JSON is the same data for everyone
// else. They drifting apart is the failure this file exists for.
const source = await import(join(root, "content/changelog/releases.ts"));
assert.equal(
  data.app.length,
  source.app.length,
  "changelog.json and releases.ts disagree on how many app releases there are",
);
assert.equal(data.app[0].version, source.app[0].version, "the newest release does not match");
assert.equal(data.app[0].line, source.app[0].line, "the newest line does not match");

// A release with prose is marked, so a caller can link at it rather than the index.
const withNote = data.app.find((e) => e.note);
assert.ok(withNote, "no app release is marked as having a note, but the .mdx files exist");

console.log(
  `changelog.json: ok, ${data.app.length} app releases, newest ${data.app[0].version}, ` +
    `${data.app.filter((e) => e.note).length} with notes`,
);
