/**
 * Reads the public repository count off the GitHub organisation at build time, into a
 * committed file, and only on success — a stale-but-true count beats "0 repositories".
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "githubStats.json");

/**
 * The repository list, not `public_repos`, which says 33 and counts 14 archived
 * `deprecated-*` repositories. Forks are excluded too, so adding one cannot inflate it.
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

    // Guard the shape rather than trusting it. A number is what this is for, and 0 is the
    // answer a renamed organisation would give — writing that is the failure to prevent.
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
