// A link in running text is underlined, and it is the base layer that says so.
// Turning that off globally puts it back on every page to remember. GRYT-1094.

import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");

const base = readFileSync(join(src, "index.css"), "utf8");

/** The `a` rule inside `@layer base`, from its brace to the one that closes it. */
function baseRule(name) {
  const at = base.indexOf(`\n  ${name} {`);
  assert.ok(at >= 0, `index.css no longer has a base-layer rule for ${name}`);
  return base.slice(at, base.indexOf("\n  }", at));
}

const anchor = baseRule("a");
assert.match(
  anchor,
  /text-decoration:\s*underline/,
  "the base layer no longer underlines links, so every page has to remember to",
);
assert.match(
  anchor,
  /text-decoration-color:\s*color-mix/,
  "the underline is no longer tinted, so a paragraph of links reads as a fence",
);
assert.match(
  base,
  /a:hover\s*\{[^}]*text-decoration-color:\s*currentColor/,
  "the underline no longer goes solid on hover, so a link gives no feedback",
);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".css")) out.push(full);
  }
  return out;
}

/* Turning it off for a class is how the nav, the cards and the buttons opt out.
   Turning it off for the bare element puts the site back where it started. */
const global = [];
for (const file of walk(src)) {
  const body = readFileSync(file, "utf8");
  for (const [, , selector] of body.matchAll(/(^|\n)\s*([^{}\n]+?)\s*\{[^}]*text-decoration:\s*none/g)) {
    if (/^a(:\w[\w-]*)?$/.test(selector.trim())) {
      global.push(`${relative(root, file).split("\\").join("/")} — ${selector.trim()}`);
    }
  }
}

assert.deepEqual(
  global,
  [],
  `these turn the underline off for every link on the site:\n  ${global.join("\n  ")}`,
);

const optOuts = walk(src).filter((f) => readFileSync(f, "utf8").includes("text-decoration: none"));
console.log(
  `link underline: ok, underlined in the base layer, ${optOuts.length} stylesheets opt a component out`,
);
