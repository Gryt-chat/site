/**
 * The published releases, cached for the changelog check.
 *
 * Same shape as `fetch-github-stats.mjs`: unauthenticated calls at build time,
 * written to `.cache/` so the check runs offline afterwards. A network that is
 * not there leaves the previous cache in place rather than failing the build —
 * the check treats a missing cache as "skip", so nothing depends on GitHub
 * being up to ship the site.
 *
 * Four repositories, because the four tabs on the changelog release on four
 * clocks. The surface names match the exports in `content/changelog/releases.ts`.
 */

import { mkdirSync, writeFileSync } from "node:fs";

const REPOS = {
  app: "Gryt-chat/gryt",
  server: "Gryt-chat/server",
  voice: "Gryt-chat/sfu",
  images: "Gryt-chat/image-worker",
};

async function releasesOf(repo) {
  const pages = [];
  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`,
      { headers: { accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${repo}`);
    const body = await response.json();
    if (body.length === 0) break;
    pages.push(...body);
  }
  return pages
    .filter((r) => !r.draft)
    .map((r) => ({ tag: r.tag_name, date: r.published_at, prerelease: r.prerelease }));
}

try {
  const cache = {};
  for (const [surface, repo] of Object.entries(REPOS)) {
    cache[surface] = await releasesOf(repo);
  }

  mkdirSync(".cache", { recursive: true });
  writeFileSync(".cache/releases.json", JSON.stringify(cache, null, 1));
  console.log(
    Object.entries(cache)
      .map(([surface, list]) => `${surface} ${list.length}`)
      .join(", "),
  );
} catch (error) {
  console.warn(`could not fetch releases (${error.message}) — keeping the cache there is`);
}
