/**
 * The one list of static pages. It existed in three places and drifted, which is how
 * /changelog advertised an og:image that 404'd. Plain .mjs, so node can import it.
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
    path: "developers/bots",
    title: "Bots",
    description:
      "A bot joins a Gryt server the way any other client does. The handshake, the SDK, and running one in a container.",
  },
  {
    path: "developers/addons",
    title: "Client addons",
    description:
      "A theme is CSS. A plugin runs in a worker of its own, and what it can call is what you granted it.",
  },
  {
    path: "developers/plugins",
    title: "Server plugins",
    description:
      "JavaScript that runs inside a Gryt server, with the database and the filesystem, and why that is a bigger decision than a theme.",
  },
  {
    path: "developers/apis",
    title: "The APIs",
    description:
      "Every REST endpoint and socket event a Gryt server answers, the SFU protocol, and how identity is checked.",
  },
  {
    path: "developers/voice",
    title: "The voice engine",
    description:
      "@gryt/voice is the calling half of Gryt on its own: signalling, ICE, tracks and audio behind React hooks.",
  },
  {
    path: "developers/design-system",
    title: "The design system",
    description:
      "One set of tokens, two renderers, and a generator that turns a palette into a link. Four packages, all MIT.",
  },
  {
    path: "developers/contributing",
    title: "Contributing",
    description:
      "How a change gets into Gryt, what pull requests are wanted for, and which paths always get a human read.",
  },
  {
    path: "built",
    title: "Built with Gryt",
    description:
      "Bots, client addons and server plugins people have made, each a folder you can read before you run it.",
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
 * Routes that render an existing page under a second URL: their own directory so nginx can
 * serve them without an SPA catch-all, with a canonical pointing at the primary.
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
