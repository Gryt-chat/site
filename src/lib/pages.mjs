/**
 * The one list of static pages.
 *
 * This existed in three places and drifted, which is not hypothetical: on
 * 2026-08-09 `/changelog` was in the prerender list but not the share-card
 * list, so the page advertised an og:image that returned 404. Nothing failed;
 * the card was just missing wherever the link was pasted.
 *
 * Plain .mjs on purpose. `scripts/prerender-blog.mjs` and
 * `scripts/generate-og-image.mjs` are run by node with no build step and cannot
 * import TypeScript, and the app is bundled by Vite which imports .mjs happily.
 * `pages.d.ts` beside this file gives the TypeScript side its types.
 *
 * Adding a page here gives it a title, a meta description, prerendered HTML, a
 * canonical, a share card and a client-side document title. Forgetting one of
 * those is what this file is for.
 */

/** @type {{ path: string, title: string, description: string }[]} */
export const STATIC_PAGES = [
  {
    path: "why-gryt",
    title: "Why Gryt?",
    description: "Why we built an open-source, self-hosted voice chat platform.",
  },
  {
    path: "blog",
    title: "Blog",
    description: "Stories, updates, and technical deep-dives from the Gryt team.",
  },
  {
    path: "changelog",
    title: "Changelog",
    description: "What changed in each release of Gryt.",
  },
  {
    path: "terms",
    title: "Terms of Use",
    description:
      "The terms covering the services we operate. Community servers set their own on top of these.",
  },
  {
    path: "privacy",
    title: "Privacy Policy",
    description: "How Gryt handles your data. We collect as little as we can get away with.",
  },
  {
    path: "community-guidelines",
    title: "Community Guidelines",
    description: "Rules and expectations for the Gryt community.",
  },
  {
    path: "invite",
    title: "Invite",
    description: "Join a Gryt server with an invite link.",
  },
];

/**
 * Routes that render an existing page under a second URL. They get their own
 * directory so nginx can serve them without an SPA catch-all, but their
 * canonical points at the primary.
 *
 * @type {{ path: string, of: string }[]}
 */
export const ALIAS_PAGES = [
  { path: "privacy-policy", of: "privacy" },
  { path: "terms-of-use", of: "terms" },
  { path: "guidelines", of: "community-guidelines" },
];

/** The primary page an alias stands in for, or undefined if it is not an alias. */
export function primaryFor(path) {
  const alias = ALIAS_PAGES.find((a) => a.path === path);
  return alias ? STATIC_PAGES.find((p) => p.path === alias.of) : undefined;
}
