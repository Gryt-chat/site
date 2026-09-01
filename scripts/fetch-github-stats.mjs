/**
 * Reads the public repository count off the GitHub organisation at build time.
 *
 * The number is on the home page ("13 repositories, all public") and used to be
 * a literal, which goes stale the moment a repository is added and says nothing
 * when it does.
 *
 * ## Why it writes a committed file rather than injecting a value
 *
 * `src/data/githubStats.json` is in git with a real number in it. This script
 * overwrites it, and **only on success**. So a build with no network, a rate
 * limit, or GitHub having a bad morning produces the last known good number
 * instead of `0`, and the build still finishes.
 *
 * That trade is deliberate: a stale-but-true count is a small wrong, and a site
 * announcing "0 repositories, all public" is a large one. Failing the release
 * over an unreachable third party would be worse than either.
 *
 * The freshness therefore comes from building often rather than from this being
 * guaranteed current. If the number matters more than that some day, it wants
 * to be a runtime fetch like `src/lib/releases.ts` — which is a different
 * decision, because then it can be wrong in the browser instead.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "githubStats.json");

/**
 * The repository list, not `orgs/Gryt-chat`'s `public_repos`.
 *
 * That field says 33, and 14 of those are archived `deprecated-*` repositories
 * from earlier rewrites — `deprecated-clientV2`, `gryt-authentication-server`
 * and so on. Publishing 33 would be true and misleading at once: the sentence
 * is about what Gryt is made of, and padding it with a decade of dead names to
 * make the figure larger is the kind of thing this site does not do.
 *
 * So archived is excluded, and forks with it. There are no forks today; the
 * filter is there so that adding one does not quietly inflate the count.
 */
const REPOS = "https://api.github.com/orgs/Gryt-chat/repos?type=public&per_page=100";

/** Long enough for a slow morning, short enough not to stall a release. */
const TIMEOUT_MS = 8000;

function keepExisting(why) {
  let current = "unreadable";
  try {
    current = String(JSON.parse(readFileSync(OUT, "utf8")).publicRepos);
  } catch {
    /* Reported as unreadable below. The build carries on either way — this
     * script exists to improve a number, not to gate a release on one. */
  }
  console.warn(`fetch-github-stats: ${why}. Keeping ${current}.`);
}

try {
  const response = await fetch(REPOS, {
    headers: {
      accept: "application/vnd.github+json",
      // GitHub asks for one and rate-limits harder without it.
      "user-agent": "gryt-site-build",
      // Lifts the unauthenticated 60/hour to 1000/hour where CI provides one.
      // Absent locally, which is fine: one call per build is well inside 60.
      ...(process.env.GITHUB_TOKEN
        ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    keepExisting(`GitHub answered ${response.status}`);
  } else {
    const body = await response.json();

    // One page of 100 covers 33 comfortably. If the organisation ever outgrows
    // it, say so rather than silently publishing the first hundred.
    if (Array.isArray(body) && body.length === 100) {
      keepExisting("there may be more than one page of repositories now");
      process.exit(0);
    }

    const count = Array.isArray(body)
      ? body.filter((repo) => repo && !repo.fork && !repo.archived).length
      : null;

    // Guard the shape rather than trusting it. A number is what this is for,
    // and 0 is the answer a renamed organisation would give — writing that
    // would be the exact failure the fallback exists to prevent.
    if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) {
      keepExisting(`GitHub returned no usable repository list (${JSON.stringify(count)})`);
    } else {
      writeFileSync(OUT, `${JSON.stringify({ publicRepos: count }, null, 2)}\n`);
      console.log(`fetch-github-stats: ${count} active public repositories.`);
    }
  }
} catch (error) {
  keepExisting(`could not reach GitHub (${error instanceof Error ? error.message : error})`);
}
