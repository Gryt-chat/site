/**
 * What /features lists. Release lines name the minor version only; the dates and the
 * changelog link are read from content/changelog/releases.ts so they can't drift.
 */

export const FEATURE_AREAS = {
  voice: 'Voice and video',
  chat: 'Chat',
  servers: 'Servers',
  privacy: 'Privacy',
  you: 'You and friends',
  hosting: 'Hosting',
  phone: 'Phone',
} as const

export type FeatureArea = keyof typeof FEATURE_AREAS

export interface UpcomingFeature {
  area: FeatureArea
  status: 'In progress' | 'Planned'
  title: string
  text: string
}

export interface Feature {
  area: FeatureArea
  /** When it reached a stable release, as "Oct 2026". */
  month: string
  title: string
  text: string
  /** A blog post slug. Its image becomes the card's picture. */
  post?: string
}

export interface FeatureLine {
  /** The minor line, "1.13". */
  version: string
  features: Feature[]
}

export interface Milestone {
  date: string
  title: string
  text: string
  post?: string
}

/** In progress first, then planned. No dates, on purpose. */
export const upcoming: UpcomingFeature[] = [
  { area: 'phone', status: 'In progress', title: 'Phone apps in the stores', text: 'Public on the App Store and Google Play, not just for testers.' },
  { area: 'servers', status: 'In progress', title: 'Move from Discord', text: 'An import bot and a bridge, so a community can move without losing its history.' },
  { area: 'privacy', status: 'Planned', title: 'Encrypted private channels', text: 'The same encryption as direct messages, for small private groups.' },
  { area: 'chat', status: 'Planned', title: 'Message search', text: 'Search a channel or a whole server.' },
  { area: 'servers', status: 'Planned', title: 'Events', text: 'Schedule a game night and let people say they’re coming.' },
  { area: 'hosting', status: 'Planned', title: 'Official hosting partners', text: 'Rent a Gryt server from a host we know, if you’d rather not run one.' },
]

/** Newest line first. 1.4 and 1.8 never had a stable release, so they aren't here. */
export const featureLines: FeatureLine[] = [
  {
    version: '1.13',
    features: [
      { area: 'you', month: 'Oct 2026', title: 'Member cards', text: 'Colours, patterns, a banner, a bio and a status line, the same on every server.' },
      { area: 'you', month: 'Oct 2026', title: 'Game activity', text: 'Games that report to Discord report to Gryt too, with the game’s art on your card.' },
      { area: 'privacy', month: 'Sep 2026', title: 'Link a new device', text: 'Scan a QR code or type a short code, and your keys move over without a server holding them.' },
      { area: 'chat', month: 'Oct 2026', title: 'Pinned messages', text: 'Pin from the message menu, and jump to an old pin however far back it is.' },
      { area: 'voice', month: 'Oct 2026', title: 'Watch when you want to', text: 'A screen share waits until you click Watch, so nobody downloads video they didn’t ask for.' },
      { area: 'phone', month: 'Oct 2026', title: 'Private push notifications', text: 'Previews are encrypted on the server and only your phone can read them.', post: 'seven-weeks-of-gryt-on-a-phone' },
    ],
  },
  {
    version: '1.12',
    features: [
      { area: 'privacy', month: 'Sep 2026', title: 'Direct messages on MLS', text: 'A key that leaks later can’t open messages from before it leaked.', post: 'direct-messages-now-run-on-mls' },
    ],
  },
  {
    version: '1.11',
    features: [
      { area: 'you', month: 'Sep 2026', title: 'Friends', text: 'Add friends on a server, accept or decline requests, and see who’s online.' },
      { area: 'chat', month: 'Sep 2026', title: 'Mentions for everyone, roles and channels', text: 'Ping @everyone, @here, a role or a #channel. A server can turn the big pings off.' },
      { area: 'servers', month: 'Sep 2026', title: 'Spam filter', text: 'Turn it on and set how sensitive it is.' },
      { area: 'voice', month: 'Sep 2026', title: 'Video at the size you watch it', text: 'Video goes out at the size of the biggest tile anyone has open, and stops when nobody’s looking.', post: 'chasing-dropped-calls-and-a-3-fps-webcam' },
      { area: 'chat', month: 'Sep 2026', title: 'What’s new, in the app', text: 'Gryt tells you what changed the first time you open a new version.', post: 'gryt-tells-you-what-changed' },
    ],
  },
  {
    version: '1.10',
    features: [
      { area: 'chat', month: 'Sep 2026', title: 'Threads and forums', text: 'Reply in a thread without leaving the channel, or run a channel as a forum of topics.', post: 'threads-plugins-and-forty-seven-themes' },
    ],
  },
  {
    version: '1.9',
    features: [
      { area: 'servers', month: 'Sep 2026', title: 'Folders and channel permissions', text: 'Group channels in folders, and decide who sees or speaks in each.', post: 'from-four-roles-to-a-permission-system' },
      { area: 'servers', month: 'Sep 2026', title: 'Plugins', text: 'A server can run plugins, and anyone can see what it runs before joining.' },
      { area: 'privacy', month: 'Sep 2026', title: 'Blocking', text: 'Block someone and their messages and calls stop.' },
    ],
  },
  {
    version: '1.7',
    features: [
      { area: 'privacy', month: 'Aug 2026', title: 'Encrypted direct messages', text: 'Messages and their files are encrypted before they leave, so the server stores what it can’t read.', post: 'the-server-cant-read-your-direct-messages' },
    ],
  },
  {
    version: '1.6',
    features: [
      { area: 'servers', month: 'Aug 2026', title: 'Roles and permissions', text: 'Each role carries its own permissions, and some are earned over time.' },
      { area: 'servers', month: 'Aug 2026', title: 'Bots', text: 'A Bots tab, a BOT tag nobody can fake, and a switch for whether bots may knock.' },
      { area: 'voice', month: 'Aug 2026', title: 'Share the sound of one app', text: 'A screen share can carry the audio from the apps you pick, and a hotkey can be a mouse button.' },
      { area: 'you', month: 'Aug 2026', title: 'Owls', text: 'Everyone gets an owl from their name, and you can dress yours up.', post: 'designing-your-own-owl' },
      { area: 'privacy', month: 'Aug 2026', title: 'An account is optional', text: 'Join with a guest identity that fits in a password manager.', post: 'your-guest-identity-now-fits-in-a-password-manager' },
      { area: 'you', month: 'Aug 2026', title: 'Group direct messages', text: 'Talk to a few people at once, and call them from there.' },
      { area: 'phone', month: 'Aug 2026', title: 'Gryt on a phone', text: 'Chat, voice, video and screen sharing on iPhone and Android, in testing.', post: 'gryt-on-a-phone' },
    ],
  },
  {
    version: '1.5',
    features: [
      { area: 'servers', month: 'Aug 2026', title: 'Many servers at once', text: 'Join servers from inside the app, and find them on your network.', post: 'download-host-play' },
      { area: 'you', month: 'Aug 2026', title: 'Themes', text: 'Built-in themes, or build your own at ui.gryt.chat and share it as a link.', post: 'threads-plugins-and-forty-seven-themes' },
    ],
  },
  {
    version: '1.3',
    features: [
      { area: 'chat', month: 'Aug 2026', title: 'Your own emoji', text: 'Upload them, import a ZIP or pull a set from emoji.gg, animated ones too.' },
    ],
  },
  {
    version: '1.2',
    features: [
      { area: 'hosting', month: 'May 2026', title: 'A server inside the app', text: 'Create a server from the desktop app in one click, with nothing else to install.', post: 'download-host-play' },
    ],
  },
  {
    version: '1.1',
    features: [
      { area: 'voice', month: 'Mar 2026', title: 'Hardware encoding', text: 'NVENC, AMF and QuickSync do the encoding, and video is sent in layers for slow connections.', post: 'hardware-codecs-svc-and-persistent-storage' },
      { area: 'voice', month: 'Mar 2026', title: 'Native screen capture', text: 'Screens and windows captured directly, up to 4K and 240 fps.' },
      { area: 'servers', month: 'Mar 2026', title: 'Webhooks', text: 'Post into a channel from anything that can send a web request.' },
      { area: 'hosting', month: 'Mar 2026', title: 'LAN party mode', text: 'Find servers on your network and let people in without invite codes.', post: '131-users-and-a-lan-party' },
    ],
  },
  {
    version: '1.0',
    features: [
      { area: 'hosting', month: 'Mar 2026', title: 'The first public release', text: 'Desktop apps for Windows, Mac and Linux, the web client, and a server you can run with Docker or a Windows .exe.', post: 'windows-server-is-here' },
    ],
  },
]

/** Newest first, like the lines above, so the page reads as one story going back. */
export const beforeOne: Milestone[] = [
  { date: '22 Feb 2026', title: 'Open source', text: 'Every repository goes public under the AGPL, with a fresh history.', post: 'a-fresh-start-new-license-clean-history' },
  { date: 'Feb 2026', title: 'Accounts and the desktop app', text: 'Gryt accounts, the desktop app, push to talk, eSports mode and avatars.' },
  { date: '4 Oct 2025', title: 'Noise suppression', text: 'RNNoise takes keyboard and fan noise out of your microphone.' },
  { date: 'Sep 2025', title: 'Reactions and a debug overlay', text: 'Reactions in chat, switching microphones mid-call, and a live view of what the audio is doing.' },
  { date: 'Jun 2025', title: 'It gets the name Gryt', text: 'Along with a Docker setup and AFK detection.' },
  { date: '21 Nov 2024', title: 'Servers and channels', text: 'More than one server, voice channels that show who’s in them, and join sounds.', post: 'from-concept-to-reality' },
  { date: '14 Jul 2024', title: 'Voice works', text: 'The first WebRTC call that connects, and a home-made SFU a month later.', post: 'learning-webrtc-from-the-ground-up' },
  { date: '2023', title: 'Mostly in Figma', text: 'A lot of design work, and a lot of attempts that didn’t work out.', post: 'designing-gryts-identity' },
  { date: 'Dec 2022', title: 'The first login screen', text: 'A proper sign-in, and the first dashboard mock-ups.' },
  { date: '7 May 2022', title: 'Where it started', text: 'The GitHub organisation is created. The first version is a login and a friends list.', post: 'the-story-of-gryt' },
]
