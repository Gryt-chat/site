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

const releases = await import(join(root, "content/changelog/releases.ts"));

const areaGrouper = new Function(
  "changes",
  "lines",
  // Two casts here too, keeping Area's literal types out of lookups by any string.
  body(lib, "export function groupByArea(changes: Change[]): [string, Change[]][] {", "groupByArea")
    .replace(/ as Record<string, string>/g, "")
    .replace(/ as string\[\]/g, ""),
);
const groupByArea = (changes) => areaGrouper(changes, { AREAS: releases.AREAS });

const splitSecurity = new Function(
  "changes",
  body(lib, "export function splitSecurity(changes: Change[]): [Change[], Change[]] {", "splitSecurity"),
);

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

/* ── the areas (GRYT-1339) ───────────────────────────────────────────────── */

assert.deepEqual(
  Object.values(releases.AREAS),
  ["Voice & video", "Chat", "Notifications", "Servers & invites", "Settings & app", "Phone", "Self-hosting"],
  "the areas are named or ordered differently from the app's What's New, which keeps its own copy",
);

const a = (area, text, kind = "fixed") => ({ kind, ...(area ? { area } : {}), text });
const headings = (groups) => groups.map(([label, changes]) => [label, changes.map((c) => c.text)]);

// AREAS order however the release was written, with no area last as Other.
assert.deepEqual(
  headings(groupByArea([a(null, "loose"), a("chat", "c1"), a("voice", "v1"), a("chat", "c2")])),
  [
    ["Voice & video", ["v1"]],
    ["Chat", ["c1", "c2"]],
    ["Other", ["loose"]],
  ],
  "changes are not under one heading per area in AREAS order, with Other last",
);

// An area added after this built keeps its own name, after the known ones and before Other.
assert.deepEqual(
  headings(groupByArea([a(null, "loose"), a("bots", "b"), a("phone", "p")])),
  [
    ["Phone", ["p"]],
    ["bots", ["b"]],
    ["Other", ["loose"]],
  ],
  "an unknown area was dropped or put somewhere other than before Other",
);

// A release that never said where anything is: one group, so no headings.
assert.deepEqual(
  headings(groupByArea([a(null, "x"), a(null, "y")])),
  [["Other", ["x", "y"]]],
  "a release with no areas is split up anyway",
);

/* ── security above the areas (GRYT-1339) ────────────────────────────────── */

// Security comes out on its own, and the rest keeps its order for the areas.
assert.deepEqual(
  splitSecurity([a("chat", "c1"), a("chat", "s1", "security"), a("voice", "v1", "new"), a(null, "s2", "security")]),
  [
    [a("chat", "s1", "security"), a(null, "s2", "security")],
    [a("chat", "c1"), a("voice", "v1", "new")],
  ],
  "security fixes aren't split out whole, or the rest lost its order",
);

/* ── against the releases that actually exist ────────────────────────────── */

const split = releases.app.filter((r) => r.changes?.length);
assert.ok(split.length > 0, "no app release carries changes, so none of this is reachable");

for (const release of split) {
  const flat = groupChanges(release.changes).flatMap(([, items]) => items);
  assert.deepEqual(
    [...flat].sort(),
    release.changes.map((c) => c.text).sort(),
    `${release.version} loses or duplicates a change when grouped`,
  );

  const byArea = groupByArea(release.changes).flatMap(([, changes]) =>
    groupChanges(changes).flatMap(([, items]) => items),
  );
  assert.deepEqual(
    [...byArea].sort(),
    release.changes.map((c) => c.text).sort(),
    `${release.version} loses or duplicates a change when grouped by area`,
  );

  // As the page draws it: security on its own, the rest by area. Each change exactly once.
  const [security, rest] = splitSecurity(release.changes);
  const drawn = [
    ...security.map((c) => c.text),
    ...groupByArea(rest).flatMap(([, changes]) => groupChanges(changes).flatMap(([, items]) => items)),
  ];
  assert.deepEqual(
    [...drawn].sort(),
    release.changes.map((c) => c.text).sort(),
    `${release.version} loses or repeats a change once security is drawn above the areas`,
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
  entry.includes("const [security, rest] = splitSecurity(line.changes ?? [])") &&
    entry.includes("line.changes?.length ? groupByArea(rest) : null"),
  `${ENTRY} no longer falls back to the line for a release nobody split up, or groups security under its area`,
);

// The line above everything, security included. Sivert asked for it on 2026-09-21.
{
  const header = entry.indexOf("{areas && <p className={styles.headline}>{line.line}</p>}");
  const block = entry.indexOf("{security.length > 0 && (");
  const areaList = entry.indexOf("{areas.map(([area, changes]) => (");
  assert.ok(header > 0, `${ENTRY} doesn't draw the line on a release that was split up`);
  assert.ok(header < block && block < areaList, `${ENTRY} doesn't draw the line, then security, then the areas`);
  assert.ok(
    entry.includes('<AreaHeading label="Security" icon={PiShieldCheckFill} />') && entry.includes("<Kinds changes={security} />"),
    `${ENTRY} draws security without its heading, or without its chip`,
  );
}

// Security is the theme's danger red, on the release page and the index alike.
assert.match(entry, /security: 'danger',/, `${ENTRY} doesn't draw the Security chip in the danger tone`);
assert.equal(
  (index.match(/tone="danger">\s*Security\s*<\/Chip>/g) ?? []).length,
  2,
  `${INDEX} marks a security release in something other than the danger tone`,
);
{
  const css = readFileSync(join(root, "src/pages/ChangelogEntry.module.css"), "utf8");
  const at = css.indexOf("\n.security {");
  assert.ok(at >= 0, "ChangelogEntry.module.css no longer has .security");
  const block = css.slice(at, css.indexOf("}", at));
  assert.match(block, /background: var\(--gryt-danger-2\)/, "the security block isn't tinted with the theme's danger red");
  assert.match(block, /var\(--gryt-danger-6\)/, "the security block has no danger-red edge");
  assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b|rgb\(/i, "the security block uses a colour of its own instead of the theme's");
  const side = (prop) => block.match(new RegExp(`\\n\\s*${prop}: ([^;]+);`))[1].trim().split(/\s+/)[1];
  assert.equal(side("margin"), `-${side("padding")}`, "the security block's side margin doesn't cancel its padding");
}
assert.ok(
  entry.includes("const headed = (areas?.length ?? 0) > 1") &&
    entry.includes("{headed && <AreaHeading label={area} icon={AREA_ICONS[area] ?? OTHER_ICON} />}"),
  `${ENTRY} heads a release whose changes are all in one area, or never heads one`,
);
assert.ok(
  entry.includes("groupChanges(changes).map(([kind, items])"),
  `${ENTRY} no longer groups each area's changes by kind`,
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
    `${split.filter((r) => hasSecurity(r)).length} marked security, security above the areas, nothing lost or repeated`,
);
