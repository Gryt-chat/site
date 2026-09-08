/**
 * Every release, and one line saying what it did.
 *
 * The changelog is the record; the blog is the story. A release that carried a
 * whole feature links to the post about it rather than growing a longer note,
 * because a feature does not land in one release — threads is part of 1.9.8,
 * four more merges that have not shipped, and a server half that went out in
 * 1.9.14. No single release note tells that honestly.
 *
 * The `.mdx` files beside this one are the releases that have real prose. Those
 * two sets are joined by version in `src/lib/changelog.ts`, so a release can
 * have a line, a note, both, or a line and a link to a post.
 *
 * **Lines are written, not generated.** The commit range says what changed and
 * the line says it from the reader's side. Generating one gives you the first
 * commit subject, which for 1.9.14 is "Cut the comments in the auth path" out
 * of twenty-two commits, and for a reader that is worse than nothing.
 *
 * Where the facts come from: `.release/manifest.json` is committed on every
 * release tag and names the exact commit each component shipped at. Diff two
 * manifests, read that range per component, write from it. Never from memory —
 * writing the 1.4.0 notes that way caught two things that felt certain and were
 * not in the range.
 */

export type Surface = "app" | "server" | "voice" | "images";

export interface ReleaseLine {
  /** The version, which is also the URL when there is a note. */
  version: string;
  /** ISO date the release was published. */
  date: string;
  /** Omitted for stable, as in the note frontmatter. */
  channel?: "beta";
  /**
   * One sentence, present tense, from the reader's side.
   *
   * A release that carried nothing but packaging says so. That is a real
   * answer to "did I miss anything", and padding it out would not be.
   */
  line: string;
  /** Slug of the blog post telling this release's story, where there is one. */
  post?: string;
}

/**
 * The app: what you install. The desktop build and gryt.chat in a browser.
 *
 * Newest first, matching the order the page renders and the order the GitHub
 * releases list comes back in.
 */
export const app: ReleaseLine[] = [
  {
    version: "1.10.3",
    date: "2026-09-08",
    line: "Joining voice waits for a slow microphone instead of giving up after six seconds and telling you it is unavailable. A role on the hover card shows its name rather than its id, and the role everybody starts with no longer takes a pill of its own.",
  },
  {
    version: "1.10.2",
    date: "2026-09-08",
    line: "A message Gryt cannot encrypt is no longer sent in the clear. Gryt asks before reading your process list now, and on a tiling window manager it draws no titlebar at all.",
  },
  {
    version: "1.10.1",
    date: "2026-09-08",
    line: "Reply and edit inside a thread, scroll back through a long one, and see what it has unread without opening it. Mark a channel, a folder or a whole server as read, and install on an Intel Mac or from an RPM.",
  },
  {
    version: "1.10.0-beta.1",
    date: "2026-09-08",
    channel: "beta",
    line: "The first build with mark-as-read, the Intel Mac download and the RPM in it.",
  },
  {
    version: "1.9.24",
    date: "2026-09-07",
    line: "Servers can run plugins, and you can see what a server runs before you join.",
  },
  {
    version: "1.9.22-beta.1",
    date: "2026-09-07",
    channel: "beta",
    line: "Packaging only. Nothing changed in the app.",
  },
  {
    version: "1.9.21",
    date: "2026-09-06",
    line: "Your most-used reactions sit on the hover bar, and names in chat are coloured by role the way the member list already was.",
  },
  {
    version: "1.9.20",
    date: "2026-09-06",
    line: "Signing in through a browser comes back to the app on the Linux AppImage. It had nowhere to return to.",
  },
  {
    version: "1.9.19",
    date: "2026-09-05",
    line: "A sidebar folder reads as a heading instead of looking like another channel.",
  },
  {
    version: "1.9.18",
    date: "2026-09-05",
    line: "Folders in the sidebar, with channels you drag into them. Muting somebody now stops them typing as well as talking.",
  },
  {
    version: "1.9.17",
    date: "2026-09-05",
    line: "Styling the release before this one dropped is back, and switching identity says what happens to the old one first.",
  },
  {
    version: "1.9.16",
    date: "2026-09-04",
    line: "Packaging only. Nothing changed in the app.",
  },
  {
    version: "1.9.15",
    date: "2026-09-04",
    line: "22MB of unused WASM out of the download, and the owner can give the owner role a colour.",
  },
  {
    version: "1.9.14",
    date: "2026-09-04",
    line: "An invite code can carry a role, so somebody arrives already holding it.",
  },
  {
    version: "1.9.12",
    date: "2026-09-03",
    line: "Packaging only. Nothing changed in the app.",
  },
  {
    version: "1.9.11",
    date: "2026-09-03",
    line: "A voice room you cannot enter looks like one, and the reports list stops spinning when the answer is never coming.",
  },
  {
    version: "1.9.10",
    date: "2026-09-03",
    line: "Mentions are kept on the server, so they follow you between devices. A member can hold more than one role.",
  },
  {
    version: "1.9.9",
    date: "2026-09-03",
    line: "A channel badges you when you are named in it, and roles are ordered by dragging rather than by typing a number.",
  },
  {
    version: "1.9.8",
    date: "2026-09-02",
    line: "The owl you designed on one server can be the one you have on all of them.",
  },
  {
    version: "1.9.7",
    date: "2026-09-02",
    line: "An avatar copied from one server to another is re-encoded rather than passed along as it was.",
  },
  {
    version: "1.9.6",
    date: "2026-09-02",
    line: "One server's owl can be your owl everywhere, and the Windows tiles, signing check and updater work.",
  },
  {
    version: "1.9.5",
    date: "2026-09-02",
    line: "The member list groups by role and colours names by it. The Windows binaries are signed.",
  },
  {
    version: "1.9.2",
    date: "2026-09-02",
    line: "You can report a person from the member list, not only a message.",
  },
  {
    version: "1.9.1",
    date: "2026-09-02",
    line: "You can block somebody, and a voice token that does not grant speak is refused the microphone rather than muted after the fact.",
  },
  {
    version: "1.9.0",
    date: "2026-09-01",
    line: "Your messages can follow you to a second device, and denying a permission on a channel finally does something.",
  },
  {
    version: "1.7.3",
    date: "2026-08-31",
    line: "A channel you cannot see stops lighting up, and the direct-message key warning stops crying wolf.",
  },
  {
    version: "1.7.2",
    date: "2026-08-31",
    line: "Direct messages and their attachments are encrypted before they leave, so a server stores what it cannot read.",
  },
  {
    version: "1.6.52",
    date: "2026-08-29",
    line: "Voice stops announcing a failure it is still recovering from, and Gryt behind a proxy works again.",
  },
  {
    version: "1.6.51",
    date: "2026-08-27",
    line: "The update you were told about downloads itself, and voice comes back properly after a reconnect.",
  },
  {
    version: "1.6.43",
    date: "2026-08-26",
    line: "Push to talk works again, and a screen share sends only the audio you meant to send.",
  },
  {
    version: "1.6.42",
    date: "2026-08-25",
    line: "A voice tile takes its colour from the owl on it rather than from a picture of one.",
  },
  {
    version: "1.6.41",
    date: "2026-08-25",
    line: "Gryt learns a server's scheme once instead of guessing it every time.",
  },
  {
    version: "1.6.40",
    date: "2026-08-25",
    line: "The UI scale reaches dialogs, menus and tooltips, which it had been leaving behind.",
  },
  {
    version: "1.6.39",
    date: "2026-08-25",
    line: "The new Gryt mark, and an owl you can save to a file.",
  },
  {
    version: "1.6.38",
    date: "2026-08-25",
    line: "The owl somebody designed is drawn as itself rather than as a picture of one.",
  },
  {
    version: "1.6.37",
    date: "2026-08-25",
    line: "You choose what kind of avatar you want, and design the owl when that is the one.",
  },
  {
    version: "1.6.36",
    date: "2026-08-24",
    line: "People are drawn as owls, and the renderer stops throttling itself while a call is running.",
  },
  {
    version: "1.6.34",
    date: "2026-08-23",
    line: "A screen share can send audio from the applications you pick, and a hotkey can be a mouse button.",
  },
  {
    version: "1.6.33",
    date: "2026-08-23",
    line: "A wrong clock on your machine stops making a server unjoinable, and says that is what happened.",
  },
  {
    version: "1.6.32",
    date: "2026-08-23",
    line: "The confirmation after sending a report waits to be dismissed instead of vanishing.",
  },
  {
    version: "1.6.31",
    date: "2026-08-22",
    line: "A report sends your log only when you ask it to, and shows you what it is sending.",
  },
  {
    version: "1.6.30",
    date: "2026-08-22",
    line: "The report form matches the one on the phone.",
  },
  {
    version: "1.6.29",
    date: "2026-08-22",
    line: "Give feedback and Report a bug open the form. They had been doing nothing.",
  },
  {
    version: "1.6.28",
    date: "2026-08-22",
    line: "A session that has expired says so instead of loading forever.",
  },
  {
    version: "1.6.27",
    date: "2026-08-22",
    line: "A video tile that failed says so instead of connecting forever.",
  },
  {
    version: "1.6.26",
    date: "2026-08-22",
    line: "Clicking a stream focuses it without taking over the app, and the camera preview shows the resolution actually being sent.",
  },
  {
    version: "1.6.25",
    date: "2026-08-21",
    line: "A Doctor that places a real call and tells you which hop is broken.",
  },
  {
    version: "1.6.24",
    date: "2026-08-21",
    line: "Packaging only. Nothing changed in the app.",
  },
  {
    version: "1.6.23",
    date: "2026-08-21",
    line: "A Bots tab, a BOT tag nobody can fake, and a switch for whether bots may knock.",
  },
  {
    version: "1.6.22",
    date: "2026-08-21",
    line: "Roles and permissions, with an editor. Voice moved to one UDP port for media instead of a range.",
  },
  {
    version: "1.6.19",
    date: "2026-08-18",
    line: "Channel rows have room to scale into.",
  },
  {
    version: "1.6.18",
    date: "2026-08-17",
    line: "Popups draw above dialogs, and the camera stops on every way out of a call.",
  },
  {
    version: "1.6.17",
    date: "2026-08-17",
    line: "A server you have asked to join is kept while you wait for the answer.",
  },
  {
    version: "1.6.14",
    date: "2026-08-16",
    line: "The uninstaller 1.5.10 shipped broken is fixed.",
  },
  {
    version: "1.6.10",
    date: "2026-08-15",
    line: "The themed titlebar and identity settings work again.",
  },
  {
    version: "1.6.9",
    date: "2026-08-14",
    line: "The empty channel state is redrawn, and older desktop updaters can cross to the new one.",
  },
  {
    version: "1.6.7",
    date: "2026-08-14",
    line: "The desktop update handoff does the same thing every time.",
  },
  {
    version: "1.6.5",
    date: "2026-08-14",
    line: "Gryt says which clock is wrong and links to how to fix it, and stops guessing https from the shape of an address.",
  },
  {
    version: "1.5.10",
    date: "2026-08-13",
    line: "Gryt can wear a theme you paste in, and leaving a server actually forgets it.",
  },
  {
    version: "1.5.8",
    date: "2026-08-13",
    line: "Fixes for what a right-click, a look and a message turned up.",
  },
  {
    version: "1.5.7",
    date: "2026-08-13",
    line: "Import a theme from a link, and the library's own presets are offered as built-in ones.",
  },
  {
    version: "1.5.6",
    date: "2026-08-13",
    line: "Leaving a server forgets it.",
  },
  {
    version: "1.5.5",
    date: "2026-08-13",
    line: "More than one server from inside the app, a reworked way of adding one, and discovery with a home of its own.",
  },
  {
    version: "1.3.1",
    date: "2026-08-05",
    line: "The volume sliders stop lying about what they do, and the noise gate keeps working when you look away.",
  },
  {
    version: "1.2.12",
    date: "2026-05-28",
    line: "The app can run a server itself, and reaches it on your own machine.",
  },
  {
    version: "1.1.24",
    date: "2026-03-10",
    line: "Screen sharing connects, and hardware screen capture works.",
  },
  {
    version: "1.1.20",
    date: "2026-03-09",
    line: "Camera settings gain a frame rate and a codec to pick.",
  },
  {
    version: "1.1.17",
    date: "2026-03-09",
    line: "Nothing you can see. An import order fix.",
  },
  {
    version: "1.1.16",
    date: "2026-03-09",
    line: "Gryt finds servers running on your own network.",
  },
  {
    version: "1.1.15",
    date: "2026-03-09",
    line: "A server says when there is an update to take.",
  },
  {
    version: "1.1.14",
    date: "2026-03-09",
    line: "Addons can be managed, and the tray icon shows up on macOS.",
  },
  {
    version: "1.1.12",
    date: "2026-03-08",
    line: "The microphone and camera work on macOS, and server settings are checked before they save.",
  },
  {
    version: "1.1.11",
    date: "2026-03-08",
    line: "You can cancel a sign-in part way through, and the noise gate has a release control.",
  },
  {
    version: "1.1.9",
    date: "2026-03-05",
    line: "The sign-in button stops taking a second press while it is already working.",
  },
  {
    version: "1.1.8",
    date: "2026-03-03",
    line: "Native screen capture, and webhooks in a server's settings.",
  },
  {
    version: "1.1.7",
    date: "2026-03-03",
    line: "A stream cleans itself up when the call ends.",
  },
  {
    version: "1.1.5",
    date: "2026-03-03",
    line: "A Support tab in settings, and the typing indicator stops getting stuck.",
  },
  {
    version: "1.1.4",
    date: "2026-03-02",
    line: "Voice recovers on its own, and always-on-top knows which window it means.",
  },
  {
    version: "1.1.1",
    date: "2026-03-02",
    line: "Screen sharing stops leaving a track behind when it ends.",
  },
  {
    version: "1.1.0",
    date: "2026-03-02",
    line: "Audio capture reports what it is doing, and the splash screen behaves in development.",
  },
  {
    version: "1.0.138",
    date: "2026-03-01",
    line: "The loopback test in audio settings works, and the sidebar responds properly.",
  },
  {
    version: "1.0.137",
    date: "2026-03-01",
    line: "The oldest release still published. There is no earlier tag to compare it against, so this is what it is rather than what it changed.",
  },
];

/**
 * The server: what somebody runs to host a Gryt server.
 *
 * The app's version and the server's are unrelated — the app you install ships
 * with a server embedded, and a server you join was released on its own clock.
 * So a reader here is usually somebody deciding whether to pull a new image.
 */
export const server: ReleaseLine[] = [
  {
    version: "1.9.0",
    date: "2026-09-08",
    line: "Sign out of your other devices without signing out of the one in your hand. A thread keeps its own typing line, its own mentions and its whole history, and leaving a server takes your picture with it.",
  },
  {
    version: "1.8.16-beta.1",
    date: "2026-09-08",
    channel: "beta",
    line: "The first build with per-device sign-out in it.",
  },
  {
    version: "1.8.15",
    date: "2026-09-07",
    line: "Packaging only.",
  },
  {
    version: "1.8.14",
    date: "2026-09-07",
    line: "Threads and forum channels, server side. A server can also load plugins, and every member can see which ones it runs.",
  },
  {
    version: "1.8.13",
    date: "2026-09-06",
    line: "An emoji import stops hiding every other emoji, and one request answers how each member got in.",
  },
  {
    version: "1.8.12",
    date: "2026-09-05",
    line: "A sidebar row can be a folder holding other rows.",
  },
  {
    version: "1.8.11",
    date: "2026-09-05",
    line: "A mute stops somebody typing as well as talking, and link previews follow every redirect hop before fetching.",
  },
  {
    version: "1.8.10",
    date: "2026-09-04",
    line: "The owner can set the owner role's colour.",
  },
  {
    version: "1.8.9",
    date: "2026-09-03",
    line: "An invite code can carry a role, and callers' addresses are no longer written to the log.",
  },
  {
    version: "1.8.8",
    date: "2026-09-03",
    line: "Packaging only.",
  },
  {
    version: "1.8.7",
    date: "2026-09-03",
    line: "The server says which voice rooms a member may enter, and which channel templates exist.",
  },
  {
    version: "1.8.6",
    date: "2026-09-03",
    line: "The server says which channels a member may post in.",
  },
  {
    version: "1.8.5",
    date: "2026-09-03",
    line: "Mentions are stored server-side, a member can hold more than one role, and reading an upload needs a token.",
  },
  {
    version: "1.8.4-beta.1",
    date: "2026-09-02",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.8.3",
    date: "2026-09-02",
    line: "A person can be reported, not only a message, and the SFU signing key is generated instead of left empty.",
  },
  {
    version: "1.8.2",
    date: "2026-09-02",
    line: "One member can block another.",
  },
  {
    version: "1.8.1-beta.1",
    date: "2026-09-01",
    channel: "beta",
    line: "The voice token carries whether you may speak, so the SFU can refuse a microphone.",
  },
  {
    version: "1.8.0",
    date: "2026-09-01",
    line: "Per-channel permissions, by role, with templates.",
  },
  {
    version: "1.7.0",
    date: "2026-08-31",
    line: "A server can be set to admit people by request, and an upload's token is checked before anything is buffered.",
  },
  {
    version: "1.6.21",
    date: "2026-08-31",
    line: "A busy metrics port no longer stops the server starting.",
  },
  {
    version: "1.6.20-beta.1",
    date: "2026-08-31",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.6.19",
    date: "2026-08-31",
    line: "The HTTP surface is rate-limited, metrics move to a port the world cannot reach, and an attachment travels with its message.",
  },
  {
    version: "1.6.18-beta.1",
    date: "2026-08-31",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.6.17",
    date: "2026-08-31",
    line: "A channel can require a rank to post in, and the SFU's shared secret stops being handed to every browser.",
  },
  {
    version: "1.6.16-beta.1",
    date: "2026-08-30",
    channel: "beta",
    line: "A direct message and an upload are both stored without the server being able to read either, and it ships the certificate authority's keys instead of fetching them.",
  },
  {
    version: "1.6.15-beta.1",
    date: "2026-08-29",
    channel: "beta",
    line: "Starting a call is its own permission.",
  },
  {
    version: "1.6.14-beta.1",
    date: "2026-08-29",
    channel: "beta",
    line: "Group direct messages, and you can ring somebody in one. SVG is skipped when an emoji ZIP is imported.",
  },
  {
    version: "1.6.13-beta.1",
    date: "2026-08-29",
    channel: "beta",
    line: "Direct messages, server side, with a cap on how long a message can be.",
  },
  {
    version: "1.6.12",
    date: "2026-08-27",
    line: "A reconnecting socket is told to retry rather than that it is forbidden.",
  },
  {
    version: "1.6.11",
    date: "2026-08-27",
    line: "The log says who dropped and from where.",
  },
  {
    version: "1.6.10",
    date: "2026-08-25",
    line: "The SFU decides who is in voice.",
  },
  {
    version: "1.6.9",
    date: "2026-08-25",
    line: "The stuck-updater reminder points at a download rather than at GitHub.",
  },
  {
    version: "1.6.8",
    date: "2026-08-25",
    line: "A member's designed look is kept beside their nickname.",
  },
  {
    version: "1.6.7",
    date: "2026-08-24",
    line: "Packaging only.",
  },
  {
    version: "1.6.6",
    date: "2026-08-23",
    line: "Packaging only.",
  },
  {
    version: "1.6.5",
    date: "2026-08-23",
    line: "A wrong clock on somebody's machine no longer makes the server unjoinable.",
  },
  {
    version: "1.6.4",
    date: "2026-08-22",
    line: "Stranded clients are sent to the release download rather than to a pending folder.",
  },
  {
    version: "1.6.3",
    date: "2026-08-22",
    line: "An animated server icon has its frames capped, and every upload decode carries a pixel ceiling.",
  },
  {
    version: "1.6.2",
    date: "2026-08-21",
    line: "The update reminder names the version, because the pattern it used matched a broken one.",
  },
  {
    version: "1.6.1",
    date: "2026-08-21",
    line: "The server says which addresses it answers on, and can hold a room of one so the Doctor can prove voice works.",
  },
  {
    version: "1.6.0-beta.1",
    date: "2026-08-21",
    channel: "beta",
    line: "Roles carry permissions rather than a rung on a ladder, and some grant themselves over time. Bots are their own tier and knock before they are let in.",
  },
  {
    version: "1.5.1",
    date: "2026-08-21",
    line: "A proxy's address stops counting as proof of being on the LAN, and voice seats stop being derived from a port range.",
  },
  {
    version: "1.5.0",
    date: "2026-08-21",
    line: "A local management API for the settings that live in the database, and a native client's own-host origin gets through CORS.",
  },
  {
    version: "1.4.6",
    date: "2026-08-18",
    line: "A version it cannot parse is refused rather than compared.",
  },
  {
    version: "1.4.5",
    date: "2026-08-17",
    line: "A purged user's files are deleted at the moment they are purged.",
  },
  {
    version: "1.4.3",
    date: "2026-08-16",
    line: "First-time setup is only required of a new owner, not of everybody joining.",
  },
  {
    version: "1.4.2",
    date: "2026-08-14",
    line: "Packaging only.",
  },
  {
    version: "1.4.2-beta.1",
    date: "2026-08-14",
    channel: "beta",
    line: "GRYT_AUTH_MODE is renamed to what it actually does.",
  },
  {
    version: "1.4.1-beta.1",
    date: "2026-08-14",
    channel: "beta",
    line: "A user id is qualified by the certificate authority that issued it.",
  },
  {
    version: "1.4.0",
    date: "2026-08-13",
    line: "Packaging only.",
  },
  {
    version: "1.4.0-beta.1",
    date: "2026-08-12",
    channel: "beta",
    line: "A server can admit people by request, cap how many one invite brings in per hour, and close the door a banned user came through. One key can speak for several devices.",
  },
  {
    version: "1.3.1-beta.1",
    date: "2026-08-10",
    channel: "beta",
    line: "Kick, ban, mute and permissions do what they say.",
  },
  {
    version: "1.3.0-beta.5",
    date: "2026-08-10",
    channel: "beta",
    line: "The server relays where a speaker's face is in their camera frame.",
  },
  {
    version: "1.3.0-beta.4",
    date: "2026-08-09",
    channel: "beta",
    line: "Uploads stream to disk, and the cap that was never the operator's is gone.",
  },
  {
    version: "1.3.0-beta.3",
    date: "2026-08-08",
    channel: "beta",
    line: "Emoji import from emoji.gg, SVG accepted again for avatars, icons and chat, and clearing a server icon actually clears it.",
  },
  {
    version: "1.3.0-beta.2",
    date: "2026-08-08",
    channel: "beta",
    line: "better-sqlite3 is replaced by node:sqlite, so there is no native rebuild on Windows.",
  },
  {
    version: "1.3.0-beta.1",
    date: "2026-08-07",
    channel: "beta",
    line: "SVG uploads are refused. An SVG can carry scripts, and the server was serving them from its own address. The server also has an identity key now, and proves it on connect rather than on join.",
  },
  {
    version: "1.2.0-beta.1",
    date: "2026-08-05",
    channel: "beta",
    line: "A hand-started server is reachable from the dev client, and warns when it binds to loopback.",
  },
  {
    version: "1.1.5",
    date: "2026-05-28",
    line: "Packaging only.",
  },
  {
    version: "1.1.5-beta.2",
    date: "2026-05-28",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.1.5-beta.1",
    date: "2026-05-28",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.0.76",
    date: "2026-05-27",
    line: "Packaging only. The release workflow was being sorted out.",
  },
  {
    version: "1.0.75",
    date: "2026-05-25",
    line: "LAN discovery works better, and the embedded server starts.",
  },
  {
    version: "1.0.73",
    date: "2026-03-10",
    line: "An invite can have a code you choose.",
  },
  {
    version: "1.0.72",
    date: "2026-03-09",
    line: "mDNS advertising through an avahi service file.",
  },
  {
    version: "1.0.71",
    date: "2026-03-09",
    line: "mDNS can bind to a named network interface.",
  },
  {
    version: "1.0.70",
    date: "2026-03-09",
    line: "mDNS advertising can pick which interface it uses.",
  },
  {
    version: "1.0.69",
    date: "2026-03-03",
    line: "Webhooks.",
  },
  {
    version: "1.0.68",
    date: "2026-03-03",
    line: "A server can be set discoverable, and it relays who is typing.",
  },
  {
    version: "1.0.66",
    date: "2026-03-02",
    line: "Voice survives a brief disconnect instead of dropping you, and link previews can match a theme.",
  },
  {
    version: "1.0.65",
    date: "2026-03-01",
    line: "A server can be opened to the LAN.",
  },
  {
    version: "1.0.63",
    date: "2026-03-01",
    line: "Packaging only.",
  },
  {
    version: "1.0.62",
    date: "2026-03-01",
    line: "Packaging only.",
  },
  {
    version: "1.0.61",
    date: "2026-03-01",
    line: "Packaging only.",
  },
];

/**
 * Voice: the SFU, which every call goes through.
 *
 * It is the one component with no user interface at all, so a line here is
 * about calls connecting, staying up, or costing less to carry.
 */
export const voice: ReleaseLine[] = [
  {
    version: "1.0.64",
    date: "2026-09-06",
    line: "Housekeeping only. Nothing changed in how voice works.",
  },
  {
    version: "1.0.63",
    date: "2026-09-03",
    line: "Addresses nobody advertised are no longer offered while a call is being set up.",
  },
  {
    version: "1.0.62",
    date: "2026-09-02",
    channel: "beta",
    line: "Packaging only.",
  },
  {
    version: "1.0.61",
    date: "2026-09-02",
    line: "An empty signing secret is refused at startup.",
  },
  {
    version: "1.0.60",
    date: "2026-09-01",
    channel: "beta",
    line: "A token that does not grant speak is refused the microphone, rather than muted after the fact.",
  },
  {
    version: "1.0.59",
    date: "2026-08-31",
    line: "Metrics move to a port the internet cannot reach.",
  },
  {
    version: "1.0.58",
    date: "2026-08-31",
    line: "Each person gets their own voice token instead of the password every browser had. A call somebody has been sitting in alone ends itself.",
  },
  {
    version: "1.0.57",
    date: "2026-08-29",
    channel: "beta",
    line: "Patched pion and x/crypto releases.",
  },
  {
    version: "1.0.56",
    date: "2026-08-25",
    line: "A connection that stops answering is dropped instead of held open.",
  },
  {
    version: "1.0.55",
    date: "2026-08-24",
    line: "It says why before hanging up, instead of dropping the connection without a word.",
  },
  {
    version: "1.0.54",
    date: "2026-08-23",
    line: "Link-local addresses are left out of what gets offered for a call.",
  },
  {
    version: "1.0.53",
    date: "2026-08-23",
    line: "A track whose sender has gone stops being forwarded.",
  },
  {
    version: "1.0.52",
    date: "2026-08-22",
    line: "A renegotiation request is never dropped, so turning a camera on mid-call arrives.",
  },
  {
    version: "1.0.51",
    date: "2026-08-21",
    line: "The log says which addresses each listener answers on.",
  },
  {
    version: "1.0.50",
    date: "2026-08-21",
    line: "Media takes one UDP port instead of a range, so the firewall rule is one line.",
  },
  {
    version: "1.0.49",
    date: "2026-08-13",
    line: "Packaging only.",
  },
  {
    version: "1.0.48",
    date: "2026-08-08",
    channel: "beta",
    line: "Release plumbing only.",
  },
  {
    version: "1.0.47",
    date: "2026-05-28",
    line: "Packaging only.",
  },
  {
    version: "1.0.46",
    date: "2026-05-25",
    channel: "beta",
    line: "A frozen picture recovers sooner.",
  },
  {
    version: "1.0.45",
    date: "2026-03-09",
    channel: "beta",
    line: "The health check tests UDP, not only that the process is up.",
  },
  {
    version: "1.0.44",
    date: "2026-03-05",
    channel: "beta",
    line: "The log names the codec on each track.",
  },
  {
    version: "1.0.43",
    date: "2026-03-03",
    channel: "beta",
    line: "Housekeeping only.",
  },
  {
    version: "1.0.42",
    date: "2026-03-03",
    channel: "beta",
    line: "H.264 is preferred over the other codecs.",
  },
  {
    version: "1.0.41",
    date: "2026-03-03",
    channel: "beta",
    line: "Video is forwarded a layer at a time, so a slow connection gets a smaller picture.",
  },
  {
    version: "1.0.40",
    date: "2026-03-01",
    line: "A connection caught mid-negotiation no longer wedges.",
  },
  {
    version: "1.0.39",
    date: "2026-03-01",
    line: "Documentation only.",
  },
  {
    version: "1.0.38",
    date: "2026-03-01",
    line: "Configuration loading is fixed.",
  },
  {
    version: "1.0.37",
    date: "2026-03-01",
    line: "A stale connection is evicted when the same person joins again.",
  },
];

/**
 * Images: the worker that resizes an upload and makes its thumbnail.
 *
 * It is also the thing that decodes files strangers uploaded, which is why a
 * dependency bump gets a line here and would not elsewhere.
 */
export const images: ReleaseLine[] = [
  {
    version: "1.2.5",
    date: "2026-09-04",
    line: "Packaging only.",
  },
  {
    version: "1.2.4",
    date: "2026-09-04",
    channel: "beta",
    line: "Housekeeping only.",
  },
  {
    version: "1.2.3",
    date: "2026-08-29",
    channel: "beta",
    line: "sharp 0.35, and one fewer dependency parsing files strangers uploaded.",
  },
  {
    version: "1.2.2",
    date: "2026-08-13",
    line: "Packaging only.",
  },
  {
    version: "1.2.1",
    date: "2026-08-08",
    channel: "beta",
    line: "It says which version it is, so the server can tell.",
  },
  {
    version: "1.2.0",
    date: "2026-08-08",
    channel: "beta",
    line: "node:sqlite instead of better-sqlite3, so there is no native rebuild.",
  },
  {
    version: "1.1.0",
    date: "2026-08-07",
    channel: "beta",
    line: "Every upload has its dominant colour worked out while the thumbnail is made, and avatar thumbnails that came out too small are rebuilt.",
  },
  {
    version: "1.0.6",
    date: "2026-03-09",
    channel: "beta",
    line: "A smaller image, with the native build toolchain taken out of it.",
  },
  {
    version: "1.0.5",
    date: "2026-03-01",
    line: "Object storage is set up asynchronously, and its errors are reported.",
  },
  {
    version: "1.0.4",
    date: "2026-02-28",
    line: "Release plumbing only.",
  },
  {
    version: "1.0.3",
    date: "2026-02-28",
    line: "The health check works, and the data directory is created with the permissions it needs.",
  },
  {
    version: "1.0.2",
    date: "2026-02-28",
    line: "The first build: thumbnails and avatar compression, on amd64 and arm64.",
  },
];
