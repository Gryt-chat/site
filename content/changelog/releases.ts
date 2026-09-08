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
 * The server, voice and images have cut 72, 28 and 12 releases between them and
 * nobody has ever written a line for one.
 *
 * They are empty rather than absent so the page can say that out loud. A tab
 * that renders "no lines written yet" is a truthful answer to somebody asking
 * what changed in the server; leaving the tab out would imply the server has
 * not been released, which is the opposite of true.
 */
export const server: ReleaseLine[] = [];
export const voice: ReleaseLine[] = [];
export const images: ReleaseLine[] = [];
