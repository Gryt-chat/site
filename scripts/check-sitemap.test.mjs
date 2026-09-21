import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sitemapProblems } from "./check-sitemap.mjs";

const canonical = (url) => `<head><link rel="canonical" href="${url}" /></head>`;
const noindex = '<head><meta name="robots" content="noindex" /></head>';

/** A small dist: two pages, an alias of one, a noindex page, a sitemap and robots.txt. */
function site({ pages = {}, locs, robots } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "check-sitemap-"));
  const files = {
    "index.html": canonical("https://gryt.chat"),
    "blog/index.html": canonical("https://gryt.chat/blog"),
    "posts/index.html": canonical("https://gryt.chat/blog"),
    "invite/index.html": noindex,
    ...pages,
  };
  for (const [file, html] of Object.entries(files)) {
    mkdirSync(join(dir, file, ".."), { recursive: true });
    writeFileSync(join(dir, file), html);
  }
  const urls = (locs ?? ["https://gryt.chat", "https://gryt.chat/blog"])
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-09-21</lastmod>\n  </url>`)
    .join("\n");
  writeFileSync(
    join(dir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(join(dir, "robots.txt"), robots ?? "User-agent: *\nAllow: /\n\nSitemap: https://gryt.chat/sitemap.xml\n");
  return dir;
}

function problemsIn(options) {
  const dir = site(options);
  try {
    return sitemapProblems(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("a sitemap that matches the pages passes", () => {
  assert.deepEqual(problemsIn(), []);
});

test("an entry whose page names another canonical fails", () => {
  const problems = problemsIn({ pages: { "blog/index.html": canonical("https://gryt.chat/news") } });
  assert.ok(problems.some((p) => p.includes("its canonical is https://gryt.chat/news")), problems.join("\n"));
});

test("an entry with a trailing slash the canonical does not have fails", () => {
  const problems = problemsIn({ locs: ["https://gryt.chat", "https://gryt.chat/blog/"] });
  assert.ok(problems.some((p) => p.startsWith("https://gryt.chat/blog/ is listed but its canonical")), problems.join("\n"));
});

test("an entry with no page on disk fails", () => {
  const problems = problemsIn({ locs: ["https://gryt.chat", "https://gryt.chat/blog", "https://gryt.chat/gone"] });
  assert.ok(problems.some((p) => p.includes("gone/index.html")), problems.join("\n"));
});

test("an indexable page missing from the sitemap fails", () => {
  const problems = problemsIn({ pages: { "download/index.html": canonical("https://gryt.chat/download") } });
  assert.ok(problems.some((p) => p.includes("https://gryt.chat/download is not in sitemap.xml")), problems.join("\n"));
});

test("a noindex page in the sitemap fails", () => {
  const problems = problemsIn({ locs: ["https://gryt.chat", "https://gryt.chat/blog", "https://gryt.chat/invite"] });
  assert.ok(problems.some((p) => p.includes("/invite is listed but the page is noindex")), problems.join("\n"));
});

test("robots.txt has to name the sitemap and block nothing in it", () => {
  const unnamed = problemsIn({ robots: "User-agent: *\nAllow: /\n" });
  assert.ok(unnamed.some((p) => p.includes("no \"Sitemap:")), unnamed.join("\n"));

  const blocking = problemsIn({ robots: "User-agent: *\nDisallow: /blog\n\nSitemap: https://gryt.chat/sitemap.xml\n" });
  assert.ok(blocking.some((p) => p.includes("disallows /blog")), blocking.join("\n"));
});
