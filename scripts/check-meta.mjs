/**
 * Checks the built site's metadata against the files it points at.
 *
 * The bug this exists for: /changelog was in the prerender list but not the
 * share-card list, so every prerendered page said `og:image=/changelog/og.png`
 * and that file did not exist. Nothing failed. The build was green, the page
 * was fine, and the card was simply absent wherever anyone pasted the link —
 * which is the one place nobody looks.
 *
 * It also checks that each page carries the stylesheet its own route needs
 * (GRYT-959). Same class of bug: every prerendered page shipped only the global
 * stylesheet, its own arrived 50–120ms later with the lazy chunk, and the page
 * painted unstyled and then restyled itself. Nothing failed there either.
 *
 * Run after `yarn build`. Exits non-zero on the first real problem.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { routeStyles } from "./routeStyles.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const SITE = "https://gryt.chat";

/* Which stylesheet each route needs. Read from App.tsx and the build manifest,
   so adding a page cannot forget to update a list here. */
const template = readFileSync(join(distDir, "index.html"), "utf8");
const globalCss = template.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1] ?? "";
const stylesFor = routeStyles({
  appSource: join(__dirname, "..", "src", "App.tsx"),
  manifestPath: join(distDir, ".vite", "manifest.json"),
  globalCss,
});

/**
 * `developers/contributing/index.html` back to the route `/developers/contributing`.
 *
 * Only the static routes resolve; a blog post lands on `/blog/<slug>`, which is
 * not a key, and comes back undefined. That is deliberate — the dynamic ones
 * are covered by the route they were rendered from, and guessing at `:slug`
 * here would be a second place to keep the router's shape.
 */
function routeOf(rel) {
  return "/" + rel.replace(/\/index\.html$/, "").replace(/^index\.html$/, "");
}

if (!existsSync(distDir)) {
  console.error("No dist/. Run `yarn build` first.");
  process.exit(1);
}

/** Every index.html plus 404.html, at any depth. */
function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry === "index.html" || entry === "404.html") out.push(full);
  }
  return out;
}

const problems = [];
const attr = (html, re) => html.match(re)?.[1];

for (const file of htmlFiles(distDir)) {
  const rel = relative(distDir, file);
  const html = readFileSync(file, "utf8");

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /<meta name="robots" content="noindex"/.test(html);

  // The home page leads with the brand instead of suffixing it — it has no
  // page name to lead with. Everything else reads "<name> | Gryt".
  const isHome = rel === "index.html";
  if (!title) problems.push(`${rel}: no <title>`);
  else if (isHome && !title.startsWith("Gryt")) problems.push(`${rel}: home title should lead with Gryt — ${title}`);
  else if (!isHome && !title.endsWith("| Gryt")) problems.push(`${rel}: title does not end "| Gryt" — ${title}`);

  if (!ogImage) {
    problems.push(`${rel}: no og:image`);
  } else if (ogImage.startsWith(SITE)) {
    const asset = join(distDir, ogImage.slice(SITE.length));
    if (!existsSync(asset)) problems.push(`${rel}: og:image 404s — ${ogImage.slice(SITE.length)}`);
  }

  // A page is either indexable with a canonical, or noindex without one.
  // Both, or neither, means the two halves disagree about what the page is.
  if (!noindex && !canonical) problems.push(`${rel}: indexable but no canonical`);
  if (noindex && canonical) problems.push(`${rel}: noindex and canonical at once`);

  /* And the stylesheets the route needs, in the served head rather than pulled
     in later by the lazy chunk. A missing one is invisible in a build log and
     shows up as the page flashing unstyled on load. */
  const wanted = stylesFor.get(routeOf(rel));
  if (wanted) {
    for (const href of wanted) {
      if (!html.includes(`href="${href}"`)) {
        problems.push(`${rel}: head is missing ${href}, so the page will flash unstyled`);
      }
    }
  }
}

if (problems.length) {
  console.error(`check-meta: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`check-meta: ${htmlFiles(distDir).length} pages, all titles suffixed, all og:images present, canonicals consistent.`);
