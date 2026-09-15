// What a security notice in releases.ts has to be before changelog.json carries it.
// The app compares versions against `fixedIn` and opens `url`, so both are checked here.

const SURFACES = new Set(["app", "server", "voice", "images"]);

/** x.y.z with an optional prerelease such as -beta.4. No leading v, no build metadata. */
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;

/** A GHSA id or a slug. The app stores it in a dismissal key, so nothing fancy. */
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;

function isHttps(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** A real calendar day, so 2026-02-30 is refused rather than rolled into March. */
function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Everything wrong with the list, one line each. Empty means it can ship. */
export function securityNoticeProblems(notices) {
  if (!Array.isArray(notices)) return ["securityNotices is not an array"];

  const problems = [];
  const ids = new Set();

  notices.forEach((notice, index) => {
    if (!notice || typeof notice !== "object") {
      problems.push(`notice ${index} is not an object`);
      return;
    }

    const name = typeof notice.id === "string" && notice.id ? notice.id : `notice ${index}`;

    if (typeof notice.id !== "string" || !ID.test(notice.id)) {
      problems.push(`${name}: id ${JSON.stringify(notice.id)} is not letters, digits, dots, dashes or underscores`);
    } else if (ids.has(notice.id)) {
      problems.push(`${name}: the id is used twice, so dismissing one notice would hide the other`);
    } else {
      ids.add(notice.id);
    }

    if (!SURFACES.has(notice.surface)) {
      problems.push(`${name}: surface ${JSON.stringify(notice.surface)} is not one of ${[...SURFACES].join(", ")}`);
    }
    if (typeof notice.fixedIn !== "string" || !VERSION.test(notice.fixedIn)) {
      problems.push(`${name}: fixedIn ${JSON.stringify(notice.fixedIn)} is not a version like 1.2.3`);
    }
    if (typeof notice.title !== "string" || !notice.title.trim()) {
      problems.push(`${name}: the title is empty`);
    }
    if (!isHttps(notice.url)) {
      problems.push(`${name}: url ${JSON.stringify(notice.url)} is not an https address`);
    }
    if (!isIsoDate(notice.published)) {
      problems.push(`${name}: published ${JSON.stringify(notice.published)} is not a date like 2026-09-15`);
    }
  });

  return problems;
}
