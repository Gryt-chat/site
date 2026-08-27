/**
 * Every destination the site chrome can point at, in one place.
 *
 * The nav and the footer both used to carry their own copy of this, which is
 * why `Why Gryt?`, `Changelog` and the docs appeared in both and `Blog` was in
 * the mobile sheet but not the desktop nav. A link that exists twice drifts;
 * a link that exists once is either in a group or it is not.
 *
 * The groups are the editorial decision. Thirty targets is too many to lay out
 * flat — that is what made the footer hard to read — so they are sorted by what
 * somebody is trying to do rather than by where the link happens to go.
 */

export interface SiteLink {
  label: string
  href: string
  /** A react-router route rather than a full page load. */
  route?: boolean
  /** `rel="me"` for identity verification. Mastodon needs it. */
  relMe?: boolean
}

/** Do the thing. The two that matter most are lifted out as `actions` below. */
export const getGoing: SiteLink[] = [
  { label: 'Open in browser', href: 'https://app.gryt.chat' },
  { label: 'Download', href: 'https://github.com/Gryt-chat/gryt/releases' },
  { label: 'Self-host guide', href: 'https://docs.gryt.chat/docs/guide/quick-start' },
  { label: 'Documentation', href: 'https://docs.gryt.chat' },
  { label: 'Roadmap', href: 'https://docs.gryt.chat/docs/guide/roadmap' },
]

/** Read about it. This is where Blog belongs, and where it was missing from. */
export const reading: SiteLink[] = [
  { label: 'Why Gryt?', href: '/why-gryt', route: true },
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
 * Read the thing.
 *
 * Six repositories, and the monorepo first because it is the one somebody who
 * has not read any of them should open. The rest are equal siblings.
 */
export const source: SiteLink[] = [
  { label: 'Monorepo', href: 'https://github.com/Gryt-chat/gryt' },
  { label: 'Client', href: 'https://github.com/Gryt-chat/client' },
  { label: 'Server', href: 'https://github.com/Gryt-chat/server' },
  { label: 'SFU', href: 'https://github.com/Gryt-chat/sfu' },
  { label: 'Auth', href: 'https://github.com/Gryt-chat/auth' },
  { label: 'Image worker', href: 'https://github.com/Gryt-chat/image-worker' },
]

/** The small print. Never in the nav, always at the very bottom. */
export const legal: SiteLink[] = [
  { label: 'Privacy', href: '/privacy', route: true },
  { label: 'Terms of use', href: '/terms', route: true },
  { label: 'Guidelines', href: '/community-guidelines', route: true },
  { label: 'Business inquiries', href: 'mailto:business@gryt.chat' },
]

/** The two the whole site is for. Buttons, never text links. */
export const actions = {
  openApp: { label: 'Open App', href: 'https://app.gryt.chat' } satisfies SiteLink,
  download: { label: 'Download', href: '#download' } satisfies SiteLink,
}

export const tagline = 'Voice, text and video chat you host yourself.'

/** Flat, for anything that searches rather than groups. */
export const allLinks: { group: string; links: SiteLink[] }[] = [
  { group: 'Read', links: reading },
  { group: 'Get going', links: getGoing },
  { group: 'Source', links: source },
  { group: 'Community', links: community },
  { group: 'Legal', links: legal },
]
