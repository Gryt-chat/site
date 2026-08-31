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
    description: "The questions people ask before they trust a chat app, answered straight.",
  },
  {
    path: "developers",
    title: "For developers",
    description:
      "Gryt's packages on npm, the bot SDK, the APIs, the voice engine and the design system.",
  },
  {
    path: "self-hosting",
    title: "Self-hosting",
    description:
      "How to run a Gryt server, from the app on your desk to a Helm chart, and what you get to decide once it is up.",
  },
  {
    path: "blog",
    title: "Blog",
    description: "Posts about building Gryt, written by the one person building it.",
  },
  {
    path: "compare",
    title: "Gryt vs Discord and TeamSpeak",
    description:
      "What the same features cost on Discord and TeamSpeak, including the rows where Gryt loses.",
  },
  {
    path: "changelog",
    title: "Changelog",
    description: "What changed in each release of Gryt.",
  },
  {
    path: "sponsors",
    title: "Sponsors",
    description:
      "Everyone who has chipped in, and what the money pays for.",
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
    path: "security",
    title: "Reporting a security problem",
    description:
      "How to report a vulnerability in Gryt, what is in scope, and what we can honestly promise back.",
  },
  {
    path: "invite",
    title: "Invite",
    description: "Join a Gryt server with an invite link.",
  },
  {
    path: "download",
    title: "Download",
    description: "Download Gryt for Windows, macOS or Linux.",
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
  { path: "security-policy", of: "security" },
];

/** The primary page an alias stands in for, or undefined if it is not an alias. */
export function primaryFor(path) {
  const alias = ALIAS_PAGES.find((a) => a.path === path);
  return alias ? STATIC_PAGES.find((p) => p.path === alias.of) : undefined;
}
