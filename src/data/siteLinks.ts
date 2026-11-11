/**
 * Every destination the site chrome can point at, in one place. The footer columns and the
 * mobile sheet both come from `footerGroups`; the bar picks from the same links.
 */

export interface SiteLink {
  label: string
  href: string
  /** A react-router route rather than a full page load. */
  route?: boolean
  /** `rel="me"` for identity verification. Mastodon needs it. */
  relMe?: boolean
  /** A small pill after the label in the bar, e.g. "Soon". */
  tag?: string
}

const download: SiteLink = { label: 'Download', href: '/download', route: true }
const openInBrowser: SiteLink = { label: 'Open in browser', href: 'https://app.gryt.chat' }
const selfHosting: SiteLink = { label: 'Self-hosting', href: '/self-hosting', route: true }
const cloud: SiteLink = { label: 'Gryt Cloud', href: '/business', route: true, tag: 'Soon' }
const whyGryt: SiteLink = { label: 'Why Gryt?', href: '/why-gryt', route: true }
const features: SiteLink = { label: 'Features', href: '/features', route: true }
const compared: SiteLink = { label: 'Compared', href: '/compare', route: true }
const blog: SiteLink = { label: 'Blog', href: '/blog', route: true }
const changelog: SiteLink = { label: 'Changelog', href: '/changelog', route: true }
const support: SiteLink = { label: 'Support', href: '/support', route: true }
const docs: SiteLink = { label: 'Docs', href: 'https://docs.gryt.chat/docs' }
const developers: SiteLink = { label: 'Developers', href: '/developers', route: true }
const ourServer: SiteLink = { label: 'Our Gryt server', href: 'https://gryt.chat/community' }
const feedback: SiteLink = { label: 'Feedback', href: 'https://feedback.gryt.chat' }
const sponsor: SiteLink = { label: 'Sponsor Gryt', href: '/sponsor', route: true }

export const footerGroups: { title: string; links: SiteLink[] }[] = [
  { title: 'Get Gryt', links: [download, openInBrowser, selfHosting, cloud] },
  { title: 'Learn', links: [whyGryt, features, compared, blog, changelog] },
  { title: 'Help', links: [support, docs, developers] },
  { title: 'Community', links: [ourServer, feedback, sponsor] },
]

/** The small print. Never in the nav, always at the very bottom. */
export const legal: SiteLink[] = [
  { label: 'Privacy', href: '/privacy', route: true },
  { label: 'Terms of use', href: '/terms', route: true },
  { label: 'Guidelines', href: '/community-guidelines', route: true },
  { label: 'Security', href: '/security', route: true },
  { label: 'AI policy', href: 'https://docs.gryt.chat/docs/about/ai' },
]

/** Four links and one button (Download). Everything else lives in the footer. */
export const navBar: SiteLink[] = [features, selfHosting, cloud, developers, blog]

/** The two the whole site is for. Buttons, never text links. */
export const actions = {
  openApp: { label: 'Open in browser', href: 'https://app.gryt.chat' } satisfies SiteLink,
  download: { label: 'Download', href: '#download' } satisfies SiteLink,
}
