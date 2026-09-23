/** The latest release's assets, read at build time into a committed file that
 * src/lib/releases.ts imports directly, rather than fetched by the visitor's browser. */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "latestRelease.json");

const LATEST = "https://api.github.com/repos/Gryt-chat/gryt/releases/latest";

/** Long enough for a slow morning, short enough not to stall a release. */
const TIMEOUT_MS = 8000;

function keepExisting(why) {
  let current = "unreadable";
  try {
    current = String(JSON.parse(readFileSync(OUT, "utf8")).tag_name);
  } catch {
    /* Reported as unreadable below. The build carries on either way — this
     * script exists to keep the list current, not to gate a release on it. */
  }
  console.warn(`fetch-latest-release: ${why}. Keeping ${current}.`);
}

try {
  const response = await fetch(LATEST, {
    headers: {
      accept: "application/vnd.github+json",
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

    if (typeof body.tag_name !== "string" || !Array.isArray(body.assets)) {
      keepExisting("GitHub returned a release with no usable tag or asset list");
    } else {
      const release = {
        tag_name: body.tag_name,
        published_at: body.published_at ?? null,
        assets: body.assets.map((asset) => ({
          name: asset.name,
          browser_download_url: asset.browser_download_url,
          size: asset.size,
        })),
      };
      writeFileSync(OUT, `${JSON.stringify(release, null, 1)}\n`);
      console.log(`fetch-latest-release: ${release.tag_name}, ${release.assets.length} assets.`);
    }
  }
} catch (error) {
  keepExisting(`could not reach GitHub (${error instanceof Error ? error.message : error})`);
}
