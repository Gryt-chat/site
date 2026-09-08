/**
 * Every destination the site chrome can point at, in one place. The nav and the footer had
 * their own copies and drifted; the groups sort by what somebody is trying to do.
 */

export interface SiteLink {
  label: string
  href: string
  /** A react-router route rather than a full page load. */
  route?: boolean
  /** `rel="me"` for identity verification. Mastodon needs it. */
  relMe?: boolean
}

/**
 * The links two lists share, named rather than indexed. `navBar` was built as `reading[0]`
 * and `getGoing[3]`, so adding a link to the middle silently moved another one.
 */
const openInBrowser: SiteLink = { label: 'Open in browser', href: 'https://app.gryt.chat' }
const download: SiteLink = { label: 'Download', href: '/download', route: true }
const selfHosting: SiteLink = { label: 'Self-hosting', href: '/self-hosting', route: true }
const developers: SiteLink = { label: 'Developers', href: '/developers', route: true }
const built: SiteLink = { label: 'Built with Gryt', href: '/built', route: true }
const docs: SiteLink = { label: 'Docs', href: 'https://docs.gryt.chat' }
const roadmap: SiteLink = { label: 'Roadmap', href: 'https://docs.gryt.chat/docs/about/roadmap' }
const whyGryt: SiteLink = { label: 'Why Gryt?', href: '/why-gryt', route: true }
const compared: SiteLink = { label: 'Compared', href: '/compare', route: true }

/**
 * Do the thing. The two that matter most are lifted out as `actions` below, and
 * "Self-host guide" goes to /self-hosting rather than straight to the quick-start.
 */
export const getGoing: SiteLink[] = [
  openInBrowser,
  download,
  selfHosting,
  developers,
  built,
  docs,
  roadmap,
]

/** Read about it. This is where Blog belongs, and where it was missing from. */
export const reading: SiteLink[] = [
  whyGryt,
  compared,
  { label: 'Blog', href: '/blog', route: true },
  { label: 'Changelog', href: '/changelog', route: true },
  { label: 'Sponsors', href: '/sponsors', route: true },
]

/** Talk to somebody. */
export const community: SiteLink[] = [
  { label: 'Discord', href: 'https://gryt.chat/discord' },
  { label: 'Mastodon', href: 'https://mastodon.social/@gryt', relMe: true },
  { label: 'Bluesky', href: 'https://bsky.app/profile/gryt.chat' },
  { label: 'Reddit', href: 'https://www.reddit.com/r/Gryt/' },
  { label: 'Feedback', href: 'https://feedback.gryt.chat' },
]

/**
 * Read the thing. Named for what each one is rather than what the directory is called:
 * somebody who has never seen this project does not know what an SFU is.
 */
export const source: SiteLink[] = [
  { label: 'Everything', href: 'https://github.com/Gryt-chat/gryt' },
  { label: 'The app', href: 'https://github.com/Gryt-chat/client' },
  { label: 'The server', href: 'https://github.com/Gryt-chat/server' },
  { label: 'Voice server', href: 'https://github.com/Gryt-chat/sfu' },
  { label: 'Logins', href: 'https://github.com/Gryt-chat/auth' },
  { label: 'Image handling', href: 'https://github.com/Gryt-chat/image-worker' },
]

/** The small print. Never in the nav, always at the very bottom. */
export const legal: SiteLink[] = [
  { label: 'Privacy', href: '/privacy', route: true },
  { label: 'Terms of use', href: '/terms', route: true },
  { label: 'Guidelines', href: '/community-guidelines', route: true },
  { label: 'Security', href: '/security', route: true },
  { label: 'Business inquiries', href: 'mailto:business@gryt.chat' },
]

/**
 * What the bar carries, as opposed to the sheet and the footer. Four, and at its limit —
 * six links plus two buttons is a directory. "Compared" came out for the audience pages.
 */
export const navBar: SiteLink[] = [whyGryt, developers, selfHosting, docs]

/** The two the whole site is for. Buttons, never text links. */
export const actions = {
  openApp: { label: 'Open in browser', href: 'https://app.gryt.chat' } satisfies SiteLink,
  download: { label: 'Download', href: '#download' } satisfies SiteLink,
}

/**
 * The tagline the chrome carries. It used to say which shelf Gryt is on and nothing else;
 * the front page no longer opens that way and the footer should not either.
 */
export const tagline =
  'Voice, video and text chat that belongs to you. The app you download is also the server, and joining one asks nothing of you.'

/** Flat, for anything that searches rather than groups. */
export const allLinks: { group: string; links: SiteLink[] }[] = [
  { group: 'Read', links: reading },
  { group: 'Get going', links: getGoing },
  { group: 'Source', links: source },
  { group: 'Community', links: community },
  { group: 'Legal', links: legal },
]
