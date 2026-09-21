/**
 * The shape the client reads. It looks its own version up in `app` and shows the
 * line, so a field going missing here is a modal that never appears. GRYT-1083.
 */

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { securityNoticeProblems } from "./security-notices.mjs";

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

/* ── the areas the client puts headings over (GRYT-1339) ────────────────── */

const AREAS = new Set(Object.keys(source.AREAS));

for (const entry of grouped) {
  for (const change of entry.changes) {
    if (change.area === undefined) continue;
    assert.ok(
      AREAS.has(change.area),
      `${entry.version} has a change in area ${JSON.stringify(change.area)}, which the app heads with the raw id`,
    );
  }
}

// Carried as written. An area dropped on the way out puts every change under one heading.
assert.deepEqual(data.app[0].changes, source.app[0].changes, "the newest release's changes lost something on the way out");
assert.ok(
  data.app.some((e) => e.changes?.some((c) => c.area)),
  "no app release carries an area, so What's New never draws a heading",
);

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

/* ── the security notices the client checks servers against ─────────────── */

assert.ok(Array.isArray(data.securityNotices), "changelog.json has no securityNotices array");
assert.deepEqual(
  data.securityNotices,
  source.securityNotices,
  "changelog.json and releases.ts disagree on the security notices",
);
assert.deepEqual(securityNoticeProblems(data.securityNotices), [], "changelog.json carries a notice that is not valid");

// The list ships empty, so the rules are run against notices made up here.
const NOTICE = {
  id: "GHSA-aaaa-bbbb-cccc",
  surface: "server",
  fixedIn: "2.0.0",
  title: "A made-up fix",
  url: "https://gryt.chat/blog/made-up",
  published: "2026-01-02",
};

assert.deepEqual(securityNoticeProblems([NOTICE]), [], "a well-formed notice was refused");
assert.deepEqual(
  securityNoticeProblems([{ ...NOTICE, id: "made-up-beta", fixedIn: "2.0.0-beta.3", surface: "voice" }]),
  [],
  "a prerelease fixedIn was refused",
);

const REFUSED = [
  [{ fixedIn: "2.0" }, "a fixedIn with two parts"],
  [{ fixedIn: "v2.0.0" }, "a fixedIn with a leading v"],
  [{ fixedIn: "latest" }, "a fixedIn that is a word"],
  [{ fixedIn: "2.0.0+build.1" }, "a fixedIn with build metadata"],
  [{ url: "http://gryt.chat/blog/made-up" }, "a plain http url"],
  [{ url: "javascript:alert(1)" }, "a javascript: url"],
  [{ url: "gryt.chat/blog/made-up" }, "a url with no scheme"],
  [{ url: undefined }, "a missing url"],
  [{ surface: "mobile" }, "a surface that does not exist"],
  [{ id: "" }, "an empty id"],
  [{ id: "has spaces" }, "an id with spaces"],
  [{ title: "  " }, "a blank title"],
  [{ published: "2026-02-30" }, "a date that does not exist"],
  [{ published: "15.09.2026" }, "a date that is not ISO"],
];

for (const [change, what] of REFUSED) {
  assert.notDeepEqual(securityNoticeProblems([{ ...NOTICE, ...change }]), [], `${what} was let through`);
}

assert.match(
  securityNoticeProblems([NOTICE, { ...NOTICE, fixedIn: "2.0.1" }]).join("\n"),
  /used twice/,
  "two notices with one id passed, so dismissing one would hide the other",
);
assert.notDeepEqual(securityNoticeProblems(undefined), [], "a missing list was let through");

// And the emitter itself refuses, which is what fails the build before a bad notice reaches gryt.chat.
{
  const dir = mkdtempSync(join(tmpdir(), "changelog-json-"));
  mkdirSync(join(dir, "scripts"));
  mkdirSync(join(dir, "content/changelog"), { recursive: true });
  mkdirSync(join(dir, "public"));
  writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module" }));
  for (const file of ["emit-changelog-json.mjs", "security-notices.mjs"]) {
    copyFileSync(join(root, "scripts", file), join(dir, "scripts", file));
  }
  const bad = { ...NOTICE, url: "http://gryt.chat/blog/made-up" };
  writeFileSync(
    join(dir, "content/changelog/releases.ts"),
    ["app", "server", "voice", "images"].map((s) => `export const ${s} = [];`).join("\n") +
      `\nexport const securityNotices = ${JSON.stringify([bad])};\n`,
  );

  const run = spawnSync(process.execPath, [join(dir, "scripts/emit-changelog-json.mjs")], { encoding: "utf8" });
  rmSync(dir, { recursive: true, force: true });
  assert.notEqual(run.status, 0, "the emitter wrote a notice with an http url");
  assert.match(run.stderr, /not an https address/, "the emitter failed, but not on the notice");
}

console.log(
  `changelog.json: ok, ${data.app.length} app releases, newest ${data.app[0].version}, ` +
    `${data.app.filter((e) => e.note).length} with notes, ${grouped.length} split into kinds, ` +
    `${grouped.filter((e) => e.changes.every((c) => c.area)).length} with areas, ` +
    `${data.securityNotices.length} security notices`,
);
