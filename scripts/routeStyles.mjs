/**
 * Which stylesheets a route needs, so the prerendered HTML can ask for them
 * up front (GRYT-959).
 *
 * ## The bug this exists for
 *
 * Every page in `dist` shipped exactly one `<link rel="stylesheet">` — the
 * global one out of `index.html` — because `renderPage` injects markup into
 * that template and never touches the head's assets. Every route's *own* CSS
 * is a separate chunk, pulled in by the `React.lazy` import when the bundle
 * runs.
 *
 * So the browser painted the prerendered markup with the nav and the footer
 * styled and the page itself bare, then restyled it 50–120ms later. Measured on
 * `/developers/contributing`: first paint at 160ms, and `audience`, `devHub`,
 * `PageHeader` and `Snippet` starting at 213ms with the last finishing at 283ms.
 *
 * Worse the more chunks a page pulls, which is why the pages with four were the
 * ones somebody noticed — but it was every route on the site.
 *
 * ## How the mapping is worked out
 *
 * From `App.tsx`, not from a list kept beside it. A hand-maintained route table
 * here would be a second place to update every time a page is added, and the
 * failure mode is silent: the page just goes back to flashing.
 *
 * Two reads:
 *
 *   const Foo = lazy(() => import("./pages/Foo").then(...))
 *   <Route path="/bar" element={<Foo />} />
 *
 * which gives `/bar -> src/pages/Foo.tsx`, and Vite's build manifest turns that
 * into the CSS it emitted, following `imports` so a shared module's stylesheet
 * comes along.
 */

import { readFileSync } from "node:fs";

/** `const Name = lazy(() => import("./pages/Whatever")` */
const LAZY = /const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']/g;

/** `<Route path="/x" element={<Name />} />` */
const ROUTE = /<Route\s+path=["']([^"']+)["']\s+element=\{<(\w+)\s*\/>\}/g;

/**
 * Every CSS file a manifest entry pulls in, including through its imports.
 *
 * Depth-first with a seen set, because two routes sharing `PageHeader` would
 * otherwise walk it twice, and a cycle would not terminate at all.
 */
function cssFor(manifest, key, seen = new Set()) {
  if (!key || seen.has(key)) return [];
  seen.add(key);

  const entry = manifest[key];
  if (!entry) return [];

  const out = [...(entry.css ?? [])];
  for (const imported of entry.imports ?? []) {
    out.push(...cssFor(manifest, imported, seen));
  }
  return out;
}

/**
 * Route path to the stylesheets it needs, as `/assets/…` URLs.
 *
 * The global stylesheet is left out: it is already in the template, and asking
 * for it twice would be a second request for a file the browser has.
 */
export function routeStyles({ appSource, manifestPath, globalCss }) {
  const app = readFileSync(appSource, "utf-8");

  const moduleFor = new Map();
  for (const [, name, spec] of app.matchAll(LAZY)) {
    /* `./pages/Foo` as written in App.tsx becomes `src/pages/Foo.tsx`, which is
       how Vite keys the manifest. The extension is not in the import. */
    moduleFor.set(name, spec.replace(/^\.\//, "src/") + ".tsx");
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  } catch {
    throw new Error(
      `No build manifest at ${manifestPath}.\n` +
        "  `build.manifest` has to be on in vite.config.ts, or every prerendered\n" +
        "  page ships without its own stylesheet and flashes unstyled.",
    );
  }

  const byRoute = new Map();
  for (const [, path, name] of app.matchAll(ROUTE)) {
    const key = moduleFor.get(name);
    if (!key) continue;

    const files = [...new Set(cssFor(manifest, key))]
      .map((f) => `/${f}`)
      .filter((f) => f !== globalCss);

    if (files.length > 0) byRoute.set(path, files);
  }

  return byRoute;
}

/** The `<link>` tags for a route, ready to go into the head. */
export function styleLinks(files) {
  return files
    .map((href) => `\n    <link rel="stylesheet" crossorigin href="${href}">`)
    .join("");
}
