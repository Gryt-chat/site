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

/* ── the kinds the client groups by ──────────────────────────────────────── */

const KINDS = new Set(["new", "fixed", "changed", "security"]);

const grouped = data.app.filter((e) => e.changes);
assert.ok(
  grouped.length > 0,
  "no app release carries changes, so the modal falls back to one row for every version",
);

for (const entry of grouped) {
  assert.ok(
    Array.isArray(entry.changes) && entry.changes.length > 0,
    `${entry.version} has an empty changes array, which renders as a modal with a header and nothing under it`,
  );
  for (const change of entry.changes) {
    assert.ok(
      KINDS.has(change.kind),
      `${entry.version} has a change of kind ${JSON.stringify(change.kind)}; ` +
        `the client only draws ${[...KINDS].join(", ")} and would label it with nothing`,
    );
    assert.ok(
      typeof change.text === "string" && change.text.length > 0,
      `${entry.version} has a ${change.kind} change with no text`,
    );
  }
}

/* Both are written by hand, so a `changes` list saying less than the line does
   is how somebody stops hearing about the thing the release was for. */
for (const entry of grouped) {
  assert.ok(
    entry.changes.length >= entry.line.split(/(?<=\.)\s+/).filter(Boolean).length,
    `${entry.version} has ${entry.changes.length} changes for a line of ` +
      `${entry.line.split(/(?<=\.)\s+/).filter(Boolean).length} sentences, so the split dropped something`,
  );
}

// Nothing before 1.10 was split, on purpose. The fallback has to keep working,
// so at least one release without changes has to survive to exercise it.
assert.ok(
  data.app.some((e) => !e.changes),
  "every app release now carries changes, so nothing exercises the fallback the client still ships",
);

console.log(
  `changelog.json: ok, ${data.app.length} app releases, newest ${data.app[0].version}, ` +
    `${data.app.filter((e) => e.note).length} with notes, ${grouped.length} split into kinds`,
);
