// The grouping and the security marker, run as the pages' own code. A dropped
// kind is a change nobody reads, a missed marker a fix nobody scrolls for. 1091.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIB = "src/lib/changelog.ts";
const INDEX = "src/pages/ChangelogIndex.tsx";
const ENTRY = "src/pages/ChangelogEntry.tsx";

const lib = readFileSync(join(root, LIB), "utf8");
const index = readFileSync(join(root, INDEX), "utf8");
const entry = readFileSync(join(root, ENTRY), "utf8");

/** Everything from `opener` to the brace that closes the block it opens. */
function body(text, opener, what) {
  const at = text.indexOf(opener);
  assert.ok(at >= 0, `no longer has ${what}`);
  const start = at + opener.length - 1;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(start + 1, i);
  }
  throw new Error(`unbalanced braces in ${what}`);
}

const KIND_ORDER = JSON.parse(
  (lib.match(/const KIND_ORDER: ChangeKind\[\] = (\[[^\]]*\])/)?.[1] ?? "null").replace(/'/g, '"'),
);
assert.deepEqual(
  KIND_ORDER,
  ["security", "new", "changed", "fixed"],
  "the kinds are drawn in a different order — security below the features is what gets scrolled past",
);

const grouper = new Function(
  "changes",
  "KIND_ORDER",
  // Two casts, which only exist to keep ChangeKind out of a string comparison.
  body(lib, "export function groupChanges(changes: Change[]): [string, string[]][] {", "groupChanges")
    .replace(/ as string\[\]/g, "")
    .replace(/ as string/g, ""),
);
const groupChanges = (changes) => grouper(changes, KIND_ORDER);

const hasSecurity = new Function(
  "release",
  body(index, "function hasSecurity(release: ListedRelease): boolean {", "hasSecurity"),
);

/* ── the grouping ────────────────────────────────────────────────────────── */

// Security leads however the release was written, and each kind appears once.
assert.deepEqual(
  groupChanges([
    { kind: "fixed", text: "b" },
    { kind: "security", text: "a" },
    { kind: "fixed", text: "c" },
  ]),
  [
    ["security", ["a"]],
    ["fixed", ["b", "c"]],
  ],
  "changes are not gathered under one heading per kind in KIND_ORDER",
);

// A kind added to the data after this built is kept, not filtered away.
assert.deepEqual(
  groupChanges([
    { kind: "deprecated", text: "going away" },
    { kind: "new", text: "here now" },
  ]),
  [
    ["new", ["here now"]],
    ["deprecated", ["going away"]],
  ],
  "an unknown kind was dropped, so a change nobody sees",
);

/* ── against the releases that actually exist ────────────────────────────── */

const releases = await import(join(root, "content/changelog/releases.ts"));

const split = releases.app.filter((r) => r.changes?.length);
assert.ok(split.length > 0, "no app release carries changes, so none of this is reachable");

for (const release of split) {
  const flat = groupChanges(release.changes).flatMap(([, items]) => items);
  assert.deepEqual(
    [...flat].sort(),
    release.changes.map((c) => c.text).sort(),
    `${release.version} loses or duplicates a change when grouped`,
  );

  const marked = hasSecurity(release);
  assert.equal(
    marked,
    release.changes.some((c) => c.kind === "security"),
    `${release.version} is marked ${marked} on the index, which is not what its kinds say`,
  );
}

// A release with no kinds is not marked, and has no page of its own to link at.
for (const release of releases.app.filter((r) => !r.changes?.length)) {
  assert.equal(
    hasSecurity(release),
    false,
    `${release.version} carries no kinds and is still marked as a security release`,
  );
}

/* ── the three-way branch on the entry page ──────────────────────────────── */

// Prose wins, then the line, then nowhere to go. Redirecting first sends every
// release without a note back to the index, which is where it came from.
const lineAt = entry.indexOf("if (!release && line) return <LineOnly line={line} />");
const redirectAt = entry.indexOf('return <Navigate to="/changelog" replace />');
assert.ok(lineAt > 0, `${ENTRY} no longer gives a release without a note a page`);
assert.ok(
  redirectAt > lineAt,
  `${ENTRY} redirects before it looks for a line, so only noted releases get a page`,
);

// Kinds when there are kinds, the sentence when there are not.
assert.ok(
  entry.includes("line.changes?.length ? groupChanges(line.changes) : null"),
  `${ENTRY} no longer falls back to the line for a release nobody split up`,
);
assert.ok(
  entry.includes("styles.onlyLine"),
  `${ENTRY} has nothing to draw a release that carries only a line`,
);

assert.ok(
  index.includes("linked={surface === 'app'}"),
  `${INDEX} no longer links the app rows, which are the ones with a page`,
);

console.log(
  `changelog kinds: ok, ${split.length} releases split, ` +
    `${split.filter((r) => hasSecurity(r)).length} marked security, nothing lost in grouping`,
);
