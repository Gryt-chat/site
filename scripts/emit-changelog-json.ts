/**
 * The changelog lines as data, for anything that is not this site. The client
 * reads it to say what changed the first time somebody opens a new version.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ReleaseLine, SecurityNotice, Surface } from "../content/changelog/releases.ts";
import { securityNoticeProblems } from "./security-notices.ts";

/** One release as changelog.json carries it. */
export interface EmittedLine {
  version: string;
  date: string;
  line: string;
  changes?: ReleaseLine["changes"];
  channel?: string;
  post?: string;
  image?: string;
  note?: boolean;
}

export type ChangelogJson = { generated: string } & Record<Surface, EmittedLine[]> & {
  securityNotices: Pick<SecurityNotice, "id" | "surface" | "fixedIn" | "title" | "url" | "published">[];
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Imported rather than parsed: the lines carry quotes and apostrophes, and a
// regex over them is a way to ship a truncated sentence without noticing.
const releases: typeof import("../content/changelog/releases.ts") = await import(join(root, "content/changelog/releases.ts"));

/** Versions with real prose beside the line. Only the app has them. */
const notes = new Set(
  readdirSync(join(root, "content/changelog"))
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, "")),
);

const SURFACES: Surface[] = ["app", "server", "voice", "images"];

/** The release's own picture, else its post's, as an absolute URL; the client is another origin. */
function imageFor(entry: ReleaseLine) {
  let path = entry.image;
  if (!path && entry.post) {
    const mdx = readFileSync(join(root, `content/blog/${entry.post}.mdx`), "utf8");
    path = /^---\n[\s\S]*?^image:\s*(\S+)\s*$[\s\S]*?^---$/m.exec(mdx)?.[1];
  }
  if (!path) return undefined;
  if (!existsSync(join(root, "public", path))) throw new Error(`${entry.version}: ${path} is not in public/`);
  return `https://gryt.chat${path}`;
}

const generated = new Date().toISOString();
const lines: Partial<Record<Surface, EmittedLine[]>> = {};
for (const surface of SURFACES) {
  const list = releases[surface];
  if (!Array.isArray(list)) throw new Error(`releases.ts no longer exports ${surface}`);
  lines[surface] = list.map((entry) => ({
    version: entry.version,
    date: entry.date,
    line: entry.line,
    // Each change's kind and area, where somebody has split the release up. The client
    // groups by both; anything without changes falls back to showing the line.
    ...(entry.changes?.length ? { changes: entry.changes } : {}),
    ...(entry.channel ? { channel: entry.channel } : {}),
    ...(entry.post ? { post: entry.post } : {}),
    ...(imageFor(entry) ? { image: imageFor(entry) } : {}),
    // Whether /changelog/<version> has prose to read, so a caller can decide
    // between linking there and linking at the index.
    ...(surface === "app" && notes.has(entry.version) ? { note: true } : {}),
  }));
}

// A top-level key rather than a surface, so a client that predates it reads app and ignores the rest.
const notices = releases.securityNotices;
const problems = securityNoticeProblems(notices);
if (problems.length > 0) {
  throw new Error(`releases.ts has security notices changelog.json can't carry:\n  ${problems.join("\n  ")}`);
}
const payload = {
  generated,
  ...lines,
  securityNotices: notices.map(({ id, surface, fixedIn, title, url, published }) => ({
    id,
    surface,
    fixedIn,
    title,
    url,
    published,
  })),
};

// public/, so vite copies it into dist and the dev server serves it too.
const out = join(root, "public/changelog.json");
writeFileSync(out, JSON.stringify(payload));

const counts = SURFACES.map((s) => `${s} ${payload[s]?.length}`).join(", ");
console.log(`changelog.json: ${counts}, security notices ${payload.securityNotices.length}`);
