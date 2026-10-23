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
  /** A blog post slug. Its image is the card's picture unless `image` is set. */
  post?: string
  /** A screenshot under public/features, taken from the app as it is today. */
  image?: string
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
  { area: 'servers', status: 'Planned', title: 'Events', text: 'Schedule a game night and let people say they’re coming.' },
  { area: 'hosting', status: 'Planned', title: 'Official hosting partners', text: 'Rent a Gryt server from a host we know, if you’d rather not run one.' },
  { area: 'servers', status: 'Planned', title: 'A plugin store', text: 'Browse plugins from the app, see what each one asks to do, and install one on your server without a restart.' },
  { area: 'you', status: 'Planned', title: 'Now Playing', text: 'Show what you’re listening to, from your computer or by connecting Spotify.' },
  { area: 'servers', status: 'Planned', title: 'Bots in their own list', text: 'Bots sit in a section of their own at the bottom of the member list, online or offline.' },
]

/** Newest line first. 1.4 and 1.8 never had a stable release, so they aren't here. */
export const featureLines: FeatureLine[] = [
  {
    version: '1.14',
    features: [
      { area: 'chat', month: 'Oct 2026', title: 'A space for direct messages', text: 'Every conversation from every server in one list, with the person’s card beside it. Pin the people you talk to most.', post: 'direct-messages-redrawn' },
      { area: 'chat', month: 'Oct 2026', title: 'Message search', text: 'Ctrl+K searches messages and file names across a server, narrowed by who, where, when or what’s in them.' },
      { area: 'chat', month: 'Oct 2026', title: 'Drafts that wait for you', text: 'Each channel and DM keeps what you were typing, pictures included.' },
      { area: 'chat', month: 'Oct 2026', title: 'A picture gallery and viewer', text: 'Several pictures sit in a gallery, and the viewer opens out of the one you clicked.' },
      { area: 'privacy', month: 'Oct 2026', title: 'Previews through your server', text: 'Link previews get their picture from your server, so the linked site never sees your IP address.' },
      { area: 'you', month: 'Oct 2026', title: 'Named devices', text: 'Each device has a name and says when it was last used, and old ones go in one click.' },
    ],
  },
  {
    version: '1.13',
    features: [
      { area: 'chat', month: 'Oct 2026', title: 'Polls', text: 'Ask a question with up to ten answers, one or several, anonymous if you like, and pick which roles can answer.' },
      { area: 'chat', month: 'Oct 2026', title: 'Lines, compact or bubbles', text: 'Pick how messages look, and which side your own sit on.' },
      { area: 'chat', month: 'Oct 2026', title: 'Pictures in a grid', text: 'Several pictures arrive as one grid, and you can drag files into order before sending.' },
      { area: 'chat', month: 'Oct 2026', title: 'Emoji from your other servers', text: 'Use a custom emoji from any server you’re on, where the server allows it.' },
      { area: 'chat', month: 'Oct 2026', title: 'Back to where you were', text: 'Jump to the present from anywhere, with a line marking what came in while you scrolled.' },
      { area: 'you', month: 'Oct 2026', title: 'Video avatars and banners', text: 'Pick a short video as your avatar or banner. Where it can’t play, a still stands in.' },
      { area: 'privacy', month: 'Oct 2026', title: 'Ask before loading other sites', text: 'Pictures and files from other sites wait for you to say yes, so a link can’t tell anyone you looked.' },
      { area: 'you', month: 'Oct 2026', title: 'Member cards', text: 'Colours, patterns, a banner, a bio and a status line, the same on every server.', image: '/features/member-card.webp' },
      { area: 'you', month: 'Oct 2026', title: 'Game activity', text: 'Games that report to Discord report to Gryt too, and Gryt can spot the rest, and apps like Figma, by their program. It asks before showing each one.', image: '/features/game-activity.webp' },
      { area: 'privacy', month: 'Sep 2026', title: 'Link a new device', text: 'Scan a QR code or type a short code, and your keys move over without a server holding them.', image: '/features/link-device.webp' },
      { area: 'chat', month: 'Oct 2026', title: 'Pinned messages', text: 'Pin from the message menu, and jump to an old pin however far back it is.', image: '/features/pinned-messages.webp' },
      { area: 'voice', month: 'Oct 2026', title: 'Watch when you want to', text: 'A screen share waits until you click Watch, so nobody downloads video they didn’t ask for.', image: '/features/watch.webp' },
      { area: 'phone', month: 'Oct 2026', title: 'Private push notifications', text: 'Previews are encrypted on the server and only your phone can read them.', post: 'seven-weeks-of-gryt-on-a-phone', image: '/features/push.webp' },
    ],
  },
  {
    version: '1.12',
    features: [
      { area: 'phone', month: 'Sep 2026', title: 'Most of the desktop on a phone', text: 'Threads, forums, friends, themes, unread counts and server settings, on iPhone and Android.' },
      { area: 'privacy', month: 'Sep 2026', title: 'Direct messages on MLS', text: 'A key that leaks later can’t open messages from before it leaked.', post: 'direct-messages-now-run-on-mls' },
    ],
  },
  {
    version: '1.11',
    features: [
      { area: 'privacy', month: 'Sep 2026', title: 'Who can message or call you', text: 'Anyone on the server, friends, or nobody, for messages and calls apart, and the server holds to it too.' },
      { area: 'you', month: 'Sep 2026', title: 'Friends', text: 'Add friends on a server, accept or decline requests, and see who’s online.', image: '/features/friends.webp' },
      { area: 'chat', month: 'Sep 2026', title: 'Mentions for everyone, roles and channels', text: 'Ping @everyone, @here, a role or a #channel. A server can turn the big pings off.', image: '/features/mentions.webp' },
      { area: 'servers', month: 'Sep 2026', title: 'Spam filter', text: 'Turn it on and set how sensitive it is.', image: '/features/spam-filter.webp' },
      { area: 'voice', month: 'Sep 2026', title: 'Video at the size you watch it', text: 'Video goes out at the size of the biggest tile anyone has open, and stops when nobody’s looking.', post: 'chasing-dropped-calls-and-a-3-fps-webcam' },
      { area: 'chat', month: 'Sep 2026', title: 'What’s new, in the app', text: 'Gryt tells you what changed the first time you open a new version.', post: 'gryt-tells-you-what-changed' },
    ],
  },
  {
    version: '1.10',
    features: [
      { area: 'chat', month: 'Sep 2026', title: 'Mini mode', text: 'Make the window small and it turns into one channel’s chat, to keep beside a game.', image: '/features/mini-mode.webp' },
      { area: 'chat', month: 'Sep 2026', title: 'Threads and forums', text: 'Reply in a thread without leaving the channel, or run a channel as a forum of topics.', post: 'threads-plugins-and-forty-seven-themes', image: '/features/threads.webp' },
    ],
  },
  {
    version: '1.9',
    features: [
      { area: 'chat', month: 'Sep 2026', title: 'Notifications your way', text: 'Desktop notifications, and how loud each server, folder and channel is, down to muted and hidden.' },
      { area: 'servers', month: 'Sep 2026', title: 'Reports to your moderators', text: 'Report a message or a person, and a server’s moderators see it in their own settings.' },
      { area: 'servers', month: 'Sep 2026', title: 'Roles that come with an invite', text: 'Tie a role to an invite link, so whoever uses it starts with that role.' },
      { area: 'servers', month: 'Sep 2026', title: 'Folders and channel permissions', text: 'Group channels in folders, and decide who sees or speaks in each.', post: 'from-four-roles-to-a-permission-system', image: '/features/folders.webp' },
      { area: 'servers', month: 'Sep 2026', title: 'Plugins', text: 'A server can run plugins, and anyone can see what it runs before joining.', image: '/features/plugins.webp' },
      { area: 'privacy', month: 'Sep 2026', title: 'Blocking', text: 'Block someone and their messages and calls stop.', image: '/features/blocking.webp' },
    ],
  },
  {
    version: '1.7',
    features: [
      { area: 'privacy', month: 'Aug 2026', title: 'Encrypted direct messages', text: 'Messages and their files are encrypted before they leave, so the server stores what it can’t read.', post: 'the-server-cant-read-your-direct-messages', image: '/features/encrypted-dm.webp' },
    ],
  },
  {
    version: '1.6',
    features: [
      { area: 'servers', month: 'Aug 2026', title: 'Roles and permissions', text: 'Each role carries its own permissions, and some are earned over time.', image: '/features/roles.webp' },
      { area: 'servers', month: 'Aug 2026', title: 'Bots', text: 'A Bots tab, a BOT tag nobody can fake, and a switch for whether bots may knock.', image: '/features/bots.webp' },
      { area: 'voice', month: 'Aug 2026', title: 'Share the sound of one app', text: 'A screen share can carry the audio from the apps you pick, and a hotkey can be a mouse button.', image: '/features/hotkeys.webp' },
      { area: 'you', month: 'Aug 2026', title: 'Owls', text: 'Everyone gets an owl from their name, and you can dress yours up.', post: 'designing-your-own-owl' },
      { area: 'privacy', month: 'Aug 2026', title: 'An account is optional', text: 'Join with a guest identity that fits in a password manager.', post: 'your-guest-identity-now-fits-in-a-password-manager' },
      { area: 'you', month: 'Aug 2026', title: 'Group direct messages', text: 'Talk to a few people at once, and call them from there.', image: '/features/group-dms.webp' },
      { area: 'phone', month: 'Aug 2026', title: 'Gryt on a phone', text: 'Chat, voice, video and screen sharing on iPhone and Android, in testing.', post: 'gryt-on-a-phone' },
    ],
  },
  {
    version: '1.5',
    features: [
      { area: 'servers', month: 'Aug 2026', title: 'Moderation', text: 'Kick, ban and mute, a mute that stops typing too, and removing everything somebody posted.' },
      { area: 'servers', month: 'Aug 2026', title: 'Who can join', text: 'Open to anyone, by invite, or by asking, with a moderator answering each request.' },
      { area: 'privacy', month: 'Aug 2026', title: 'Servers prove who they are', text: 'Gryt remembers each server’s key and refuses one that changes, so nobody can stand in for it.' },
      { area: 'voice', month: 'Aug 2026', title: 'A camera that follows your face', text: 'Center my face keeps you in the middle of your tile, done on your own computer.' },
      { area: 'servers', month: 'Aug 2026', title: 'Many servers at once', text: 'Join servers from inside the app, and find them on your network.', post: 'download-host-play', image: '/blog/gryt-server-browser.webp' },
      { area: 'you', month: 'Aug 2026', title: 'Themes', text: 'Built-in themes, or build your own at ui.gryt.chat and share it as a link.', post: 'threads-plugins-and-forty-seven-themes' },
    ],
  },
  {
    version: '1.3',
    features: [
      { area: 'chat', month: 'Aug 2026', title: 'Your own emoji', text: 'Upload them, import a ZIP or pull a set from emoji.gg, animated ones too.', image: '/features/custom-emoji.webp' },
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
      { area: 'voice', month: 'Mar 2026', title: 'Native screen capture', text: 'Screens and windows captured directly, up to 4K and 240 fps.', image: '/features/native-capture.webp' },
      { area: 'servers', month: 'Mar 2026', title: 'Webhooks', text: 'Post into a channel from anything that can send a web request.', image: '/features/webhooks.webp' },
      { area: 'hosting', month: 'Mar 2026', title: 'LAN party mode', text: 'Find servers on your network and let people in without invite codes.', post: '131-users-and-a-lan-party' },
    ],
  },
  {
    version: '1.0',
    features: [
      { area: 'hosting', month: 'Mar 2026', title: 'The first public release', text: 'Desktop apps for Windows, Mac and Linux, the web client, and a server you can run with Docker or a Windows .exe. The server already capped how fast anyone could send messages.', post: 'windows-server-is-here' },
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
