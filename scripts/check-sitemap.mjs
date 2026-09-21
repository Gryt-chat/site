/**
 * Holds dist/sitemap.xml to the pages on disk, both ways: every entry is a page whose canonical
 * is that exact URL, and every indexable page is an entry. Runs in `yarn build`, after the prerender.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://gryt.chat";

/** Every index.html under `dir`, relative to `root`. */
function pages(dir, root = dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...pages(full, root));
    else if (entry === "index.html") out.push(relative(root, full));
  }
  return out;
}

function head(html) {
  return {
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html),
  };
}

/** What is wrong with the sitemap and robots.txt in `distDir`, as sentences. Empty is clean. */
export function sitemapProblems(distDir) {
  const sitemapFile = join(distDir, "sitemap.xml");
  if (!existsSync(sitemapFile)) return ["sitemap.xml was not written"];

  const problems = [];
  const xml = readFileSync(sitemapFile, "utf8");
  if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    problems.push("sitemap.xml has no sitemaps.org <urlset>");
  }

  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, url]) => ({
    loc: url.match(/<loc>([^<]*)<\/loc>/)?.[1]?.replace(/&amp;/g, "&"),
    lastmod: url.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1],
  }));
  if (entries.length === 0) problems.push("sitemap.xml lists no pages");

  const listed = new Set();
  for (const { loc, lastmod } of entries) {
    if (!loc) {
      problems.push("an entry in sitemap.xml has no <loc>");
      continue;
    }
    if (listed.has(loc)) problems.push(`${loc} is listed twice`);
    listed.add(loc);

    if (lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
      problems.push(`${loc} has lastmod "${lastmod}", which is not a YYYY-MM-DD date`);
    }
    if (loc !== SITE && !loc.startsWith(`${SITE}/`)) {
      problems.push(`${loc} is not on ${SITE}`);
      continue;
    }

    const file = join(distDir, new URL(loc).pathname, "index.html");
    if (!existsSync(file)) {
      problems.push(`${loc} is listed but there is no ${relative(distDir, file)}`);
      continue;
    }
    const { canonical, noindex } = head(readFileSync(file, "utf8"));
    if (noindex) problems.push(`${loc} is listed but the page is noindex`);
    else if (canonical !== loc) problems.push(`${loc} is listed but its canonical is ${canonical ?? "missing"}`);
  }

  // An alias page counts through its canonical, so /privacy-policy needs /privacy listed.
  for (const page of pages(distDir)) {
    const { canonical, noindex } = head(readFileSync(join(distDir, page), "utf8"));
    if (noindex || !canonical || listed.has(canonical)) continue;
    problems.push(`${page} is indexable, but its canonical ${canonical} is not in sitemap.xml`);
  }

  const robotsFile = join(distDir, "robots.txt");
  if (!existsSync(robotsFile)) {
    problems.push("robots.txt is missing, so nothing points a crawler at the sitemap");
  } else {
    const rules = readFileSync(robotsFile, "utf8").split("\n").map((line) => line.trim());
    if (!rules.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
      problems.push(`robots.txt has no "Sitemap: ${SITE}/sitemap.xml" line`);
    }
    for (const rule of rules) {
      const blocked = rule.match(/^disallow:\s*(\S+)/i)?.[1];
      const hit = blocked && [...listed].find((loc) => new URL(loc).pathname.startsWith(blocked));
      if (hit) problems.push(`robots.txt disallows ${blocked}, which blocks ${hit}`);
    }
  }

  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
  const problems = sitemapProblems(distDir);
  if (problems.length) {
    console.error(`check-sitemap: ${problems.length} problem(s)\n`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  const count = readFileSync(join(distDir, "sitemap.xml"), "utf8").match(/<url>/g).length;
  console.log(`check-sitemap: ${count} pages, each one on disk under its own canonical, and robots.txt points at the file.`);
}
