// The changelog check against fixtures. It decides whether gryt.chat can build,
// and a release now waits on a line it has to accept (GRYT-1111).

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const CHECK = new URL("check-changelog-lines.mjs", import.meta.url).pathname;
const SURFACES = ["app", "server", "voice", "images"];
const AREAS = { voice: "Voice & video", chat: "Chat" };

const day = (offset) =>
  new Date(Date.now() + offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** A directory shaped the way the check expects to be run in. */
function fixture({ lines, releases, cache = true }) {
  const dir = mkdtempSync(join(tmpdir(), "changelog-lines-"));
  mkdirSync(join(dir, ".cache"));
  mkdirSync(join(dir, "content/changelog"), { recursive: true });
  writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module" }));

  const published = {};
  for (const surface of SURFACES) {
    published[surface] = (releases[surface] ?? []).map(([version, date, prerelease = false]) => ({
      tag: `v${version}`,
      date: `${date}T12:00:00Z`,
      prerelease,
    }));
  }
  if (cache) writeFileSync(join(dir, ".cache/releases.json"), JSON.stringify(published));

  const body = (surface) =>
    (lines[surface] ?? [])
      .map(
        ([version, date, changes]) =>
          `  {\n    version: "${version}",\n    date: "${date}",\n` +
          (changes ? `    changes: ${JSON.stringify(changes)},\n` : "") +
          "  },",
      )
      .join("\n");

  writeFileSync(
    join(dir, "content/changelog/releases.ts"),
    `export const AREAS = ${JSON.stringify(AREAS)} as const;\n\n` +
      SURFACES.map((s) => `export const ${s}: ReleaseLine[] = [\n${body(s)}\n];`).join("\n\n") +
      "\n",
  );

  return dir;
}

/** Runs the check in that directory, the way the build does. */
function run(dir) {
  try {
    return { code: 0, out: execFileSync("node", [CHECK], { cwd: dir, encoding: "utf8" }) };
  } catch (e) {
    return { code: e.status, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

test("a line for a release that happened passes", () => {
  const dir = fixture({
    lines: { app: [["1.11.3", day(0)]] },
    releases: { app: [["1.11.3", day(0)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 0);
  assert.match(out, /every date matches/);
});

test("a line written ahead of its release passes, and says so", () => {
  /* The release gate refuses to start without one, so this is the normal order
     now rather than a mistake. */
  const dir = fixture({
    lines: { app: [["1.11.4", day(0)], ["1.11.3", day(-1)]] },
    releases: { app: [["1.11.3", day(-1)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 0, out);
  assert.match(out, /app 1\.11\.4 waiting on a release/);
});

test("each surface is judged against its own releases", () => {
  /* server 1.7.0 is below the app's 1.11.3 but above every server release, so
     it is pending rather than invented. */
  const dir = fixture({
    lines: { app: [["1.11.3", day(-1)]], server: [["1.7.0", day(0)], ["1.6.9", day(-5)]] },
    releases: { app: [["1.11.3", day(-1)]], server: [["1.6.9", day(-5)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 0, out);
  assert.match(out, /server 1\.7\.0 waiting on a release/);
});

test("a line below the newest release that does not exist still fails", () => {
  const dir = fixture({
    lines: { app: [["1.11.3", day(0)], ["1.5.99", day(-30)]] },
    releases: { app: [["1.11.3", day(0)], ["1.5.98", day(-30)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /never released/);
  assert.match(out, /1\.5\.99/);
});

test("a line ahead of a release that never happened fails after two days", () => {
  const dir = fixture({
    lines: { app: [["1.11.4", day(-3)], ["1.11.3", day(-5)]] },
    releases: { app: [["1.11.3", day(-5)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /never happened/);
  assert.match(out, /1\.11\.4/);
});

test("a prerelease sorts below its own release", () => {
  /* 1.12.0-beta.1 is published; a line for 1.12.0 is still ahead of it. */
  const dir = fixture({
    lines: { app: [["1.12.0", day(0)]] },
    releases: { app: [["1.12.0-beta.1", day(-1), true]] },
  });
  assert.equal(run(dir).code, 0);

  /* And the other way round: 1.11.9 is below the published beta, so it is a
     typo rather than something pending. */
  const older = fixture({
    lines: { app: [["1.11.9", day(0)]] },
    releases: { app: [["1.12.0-beta.1", day(-1), true]] },
  });
  assert.equal(run(older).code, 1);
});

test("versions are compared as numbers, not as strings", () => {
  /* "1.9.0" > "1.11.0" as strings, which would call a pending line invented. */
  const dir = fixture({
    lines: { app: [["1.11.4", day(0)], ["1.11.3", day(-1)], ["1.9.0", day(-9)]] },
    releases: { app: [["1.9.0", day(-9)], ["1.11.3", day(-1)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 0, out);
  assert.match(out, /app 1\.11\.4 waiting/);
});

test("a date that is not the release's still fails", () => {
  const dir = fixture({
    lines: { app: [["1.11.3", day(-4)]] },
    releases: { app: [["1.11.3", day(0)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /is not the release's/);
});

test("a surface with nothing published takes a line for anything", () => {
  const dir = fixture({ lines: { images: [["0.1.0", day(0)]] }, releases: {} });
  assert.equal(run(dir).code, 0);
});

test("a release with no line at all still fails", () => {
  const dir = fixture({ lines: {}, releases: { app: [["1.11.3", day(0)]] } });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /neither a line nor a note/);
});

/* ── areas (GRYT-1339) ───────────────────────────────────────────────────── */

const fixed = (area) => ({ kind: "fixed", ...(area ? { area } : {}), text: "Something works now." });

test("a new app change with an area passes", () => {
  const dir = fixture({
    lines: { app: [["1.12.0", day(0), [fixed("voice"), fixed("chat")]]] },
    releases: { app: [["1.12.0", day(0)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 0, out);
  assert.match(out, /has an area/);
});

test("a new app change with no area fails, and names it", () => {
  const dir = fixture({
    lines: { app: [["1.12.0", day(0), [fixed("voice"), fixed()]]] },
    releases: { app: [["1.12.0", day(0)]] },
  });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /with no area/);
  assert.match(out, /app 1\.12\.0, change 2/);
});

test("an app change from before areas landed needs none", () => {
  const dir = fixture({
    lines: { app: [["1.11.5", "2026-09-09", [fixed()]]] },
    releases: { app: [["1.11.5", "2026-09-09"]] },
  });
  assert.equal(run(dir).code, 0);
});

test("only the app has to say where a change is", () => {
  /* What's New and the release page are the only things that group by area,
     and both read the app. */
  const dir = fixture({
    lines: { server: [["1.11.0", day(0), [fixed()]]] },
    releases: { server: [["1.11.0", day(0)]] },
  });
  assert.equal(run(dir).code, 0);
});

test("an area that isn't in AREAS fails, on any surface and any date", () => {
  for (const [surface, date] of [["app", "2026-09-09"], ["server", day(0)]]) {
    const dir = fixture({
      lines: { [surface]: [["1.11.5", date, [fixed("voise")]]] },
      releases: { [surface]: [["1.11.5", date]] },
    });
    const { code, out } = run(dir);
    assert.equal(code, 1, `${surface}: ${out}`);
    assert.match(out, /isn't one of voice, chat/);
    assert.match(out, /"voise"/);
  }
});

test("a missing area fails even with no releases fetched", () => {
  /* Without the network the rest of the check skips, and this half needs none. */
  const dir = fixture({
    lines: { app: [["1.12.0", day(0), [fixed()]]] },
    releases: {},
    cache: false,
  });
  const { code, out } = run(dir);
  assert.equal(code, 1);
  assert.match(out, /with no area/);
});
