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
    date: "2026-09-01",
    line: "You can report a person from the member list, not only a message.",
  },
  {
    version: "1.9.1",
    date: "2026-09-01",
    line: "You can block somebody, and a voice token that does not grant speak is refused the microphone rather than muted after the fact.",
  },
  {
    version: "1.9.0",
    date: "2026-09-01",
    line: "Your messages can follow you to a second device, and denying a permission on a channel finally does something.",
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
