/**
 * The published releases, cached for the changelog check.
 *
 * Same shape as `fetch-github-stats.mjs`: one unauthenticated call at build
 * time, written to `.cache/` so the check runs offline afterwards. A network
 * that is not there leaves the previous cache in place rather than failing the
 * build — the check treats a missing cache as "skip", so nothing depends on
 * GitHub being up to ship the site.
 */

import { mkdirSync, writeFileSync } from "node:fs";

const API = "https://api.github.com/repos/Gryt-chat/gryt/releases?per_page=100";

try {
  const pages = [];
  for (let page = 1; page <= 3; page++) {
    const response = await fetch(`${API}&page=${page}`, {
      headers: { accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const body = await response.json();
    if (body.length === 0) break;
    pages.push(...body);
  }

  const releases = pages
    .filter((r) => !r.draft)
    .map((r) => ({ tag: r.tag_name, date: r.published_at, prerelease: r.prerelease }));

  mkdirSync(".cache", { recursive: true });
  writeFileSync(".cache/releases.json", JSON.stringify(releases, null, 1));
  console.log(`cached ${releases.length} releases`);
} catch (error) {
  console.warn(`could not fetch releases (${error.message}) — keeping the cache there is`);
}
