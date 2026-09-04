/**
 * Every destination the site chrome can point at, in one place.
 *
 * The nav and the footer used to carry their own copies, and they drifted:
 * three links appeared in both, one was in the mobile sheet and not the
 * desktop nav, and `/download` was linked from nowhere at all.
 *
 * The groups are the editorial decision. Thirty targets is too many to lay out
 * flat, so they are sorted by what somebody is trying to do rather than by
 * where the link happens to go.
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
 * The links two lists share, named rather than indexed.
 *
 * `navBar` used to be built as `reading[0]`, `reading[1]`, `getGoing[3]` with a
 * comment beside each saying what that index was. Adding one link to the middle
 * of `getGoing` silently moves the third one somewhere else, which is the same
 * class of drift this file exists to stop and which `Navbar.tsx` already warns
 * about in its own lookup. A const cannot go stale.
 */
const openInBrowser: SiteLink = { label: 'Open in browser', href: 'https://app.gryt.chat' }
const download: SiteLink = { label: 'Download', href: '/download', route: true }
const selfHosting: SiteLink = { label: 'Self-hosting', href: '/self-hosting', route: true }
const developers: SiteLink = { label: 'Developers', href: '/developers', route: true }
const docs: SiteLink = { label: 'Docs', href: 'https://docs.gryt.chat' }
const roadmap: SiteLink = { label: 'Roadmap', href: 'https://docs.gryt.chat/docs/guide/roadmap' }
const whyGryt: SiteLink = { label: 'Why Gryt?', href: '/why-gryt', route: true }
const compared: SiteLink = { label: 'Compared', href: '/compare', route: true }

/**
 * Do the thing. The two that matter most are lifted out as `actions` below.
 *
 * `Self-host guide` used to go straight to the docs quick-start. It goes to
 * /self-hosting now, which is the page that then hands you the quick-start
 * along with the other four ways in.
 */
export const getGoing: SiteLink[] = [
  openInBrowser,
  download,
  selfHosting,
  developers,
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
 * Read the thing.
 *
 * Named for what each one is rather than what the directory is called. Somebody
 * who has never seen this project does not know what an SFU is, and the whole
 * point of the row is that they can go and look.
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
 * What the bar carries, as opposed to what the sheet and the footer carry.
 *
 * Four, and it is at its limit: two buttons sit beside them, and six links plus
 * two buttons is a directory rather than a decision.
 *
 * `Compared` came out to make room for the two audience pages, and it lost the
 * argument because it is a page you read once when you are weighing Gryt up
 * against something else, while /developers and /self-hosting are where a whole
 * kind of visitor should land. It is still in the sheet and in the footer.
 */
export const navBar: SiteLink[] = [whyGryt, developers, selfHosting, docs]

/** The two the whole site is for. Buttons, never text links. */
export const actions = {
  openApp: { label: 'Open in browser', href: 'https://app.gryt.chat' } satisfies SiteLink,
  download: { label: 'Download', href: '#download' } satisfies SiteLink,
}

/**
 * The tagline the chrome carries.
 *
 * It used to be "Voice, text and video chat you host yourself", which says
 * which shelf Gryt is on and nothing else. The front page no longer opens that
 * way and the footer should not either.
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
