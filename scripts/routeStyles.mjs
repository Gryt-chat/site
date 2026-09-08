/**
 * Which stylesheets a route needs, so the prerendered HTML asks for them up front
 * (GRYT-959). Worked out from App.tsx and Vite's manifest, not a hand-kept table.
 */

import { readFileSync } from "node:fs";

/** `const Name = lazy(() => import("./pages/Whatever")` */
const LAZY = /const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*["']([^"']+)["']/g;

/** `<Route path="/x" element={<Name />} />` */
const ROUTE = /<Route\s+path=["']([^"']+)["']\s+element=\{<(\w+)\s*\/>\}/g;

/**
 * Every CSS file a manifest entry pulls in, including through its imports. Depth-first with
 * a seen set: two routes sharing `PageHeader` would walk it twice, and a cycle would loop.
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
 * Route path to the stylesheets it needs, as `/assets/…` URLs. The global stylesheet is left
 * out: it is already in the template, and asking twice is a second request.
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
