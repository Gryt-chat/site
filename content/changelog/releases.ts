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

/**
 * What a change is, for the reader deciding whether to keep reading.
 *
 * `security` is the only one that changes what somebody should do about the
 * release, so it is the only one worth a separate word from `fixed`.
 */
export type ChangeKind = "new" | "fixed" | "changed" | "security";

export interface Change {
  kind: ChangeKind;
  /** One sentence, same voice as `line`. */
  text: string;
}

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
  /**
   * The same release split into what each change is, for the modal the app
   * opens after it updates itself. The line stays either way — the changelog
   * index wants one sentence, and a list of four reads badly there.
   *
   * Absent on everything before 1.10, and that is on purpose. The modal shows
   * the version you have just updated *to*, so nobody sees 1.9.5's again and
   * splitting the whole history buys nothing. Fill it in going forward.
   */
  changes?: Change[];
  /** Slug of the blog post telling this release's story, where there is one. */
  post?: string;
}

/**
 * A published security fix. The app shows owners and admins of a server older
 * than `fixedIn` a notice that links to `url`.
 */
export interface SecurityNotice {
  /** Never reused: the app remembers a dismissal by server and id. */
  id: string;
  /** The component the fix is in. The app only checks `server` so far. */
  surface: Surface;
  /** The first release with the fix, e.g. 1.2.3 or 1.2.3-beta.4. */
  fixedIn: string;
  title: string;
  /** Where to read about it. https only. */
  url: string;
  /** ISO date the notice went up. */
  published: string;
}

/** Newest first. emit-changelog-json.mjs checks each one, and a bad one fails the build. */
export const securityNotices: SecurityNotice[] = [
  {
    id: "GHSA-pwj4-mw52-f7cj",
    surface: "server",
    fixedIn: "1.10.15",
    title: "Members' sign-in tokens were sent to other members",
    url: "https://gryt.chat/blog/security-update-gryt-server-1-10-15",
    published: "2026-09-15",
  },
  {
    id: "GHSA-whvq-3x27-w5jv",
    surface: "server",
    fixedIn: "1.10.15",
    title: "Channel messages reached people who could not read the channel",
    url: "https://gryt.chat/blog/security-update-gryt-server-1-10-15",
    published: "2026-09-15",
  },
  {
    id: "GHSA-w9c7-pp72-54xg",
    surface: "server",
    fixedIn: "1.10.14",
    title: "Link previews and webhook pictures could reach the server's own network",
    url: "https://gryt.chat/blog/security-update-gryt-server-1-10-15",
    published: "2026-09-15",
  },
  {
    id: "GHSA-m3qc-p5wr-2cq9",
    surface: "server",
    fixedIn: "1.10.8",
    title: "Other members could open files from private channels and direct messages",
    url: "https://gryt.chat/blog/security-update-gryt-server-1-10-15",
    published: "2026-09-15",
  },
];

/**
 * The app: what you install. The desktop build and gryt.chat in a browser.
 *
 * Newest first, matching the order the page renders and the order the GitHub
 * releases list comes back in.
 */
export const app: ReleaseLine[] = [
  {
    version: "1.11.28-beta.2",
    date: "2026-09-19",
    channel: "beta",
    line: "Settings are grouped around what you are trying to change, so server, chat, voice, appearance and app controls are easier to find.",
    changes: [
      {
        kind: "changed",
        text: "User settings is reorganized into clearer sections: Account & security, Servers, Chat & notifications, Voice & video, Appearance, App and About.",
      },
      {
        kind: "changed",
        text: "My servers, adding-server preferences and server identities now live together under Servers. Manage server and settings search open the new locations.",
      },
      {
        kind: "changed",
        text: "Chat and notifications now share a section, AFK timeout sits with Voice, and keeping server sign-in tokens between launches sits under Security.",
      },
      {
        kind: "changed",
        text: "Support Gryt stays pinned at the bottom of settings and uses Gryt's accent across the row, so it reads as a support action rather than a warning.",
      },
    ],
  },
  {
    version: "1.11.28-beta.1",
    date: "2026-09-19",
    channel: "beta",
    line: "Webcams recover without leaving a waiting tile, huge chat pastes become text files, screen shares show when they are starting, and voice recovers more cleanly after a brief disconnect.",
    changes: [
      {
        kind: "fixed",
        text: "A camera could be publishing normally while everyone else stayed on a waiting tile after Gryt reacquired the device. Gryt keeps advertising the WebRTC stream ID the call is actually sending now.",
      },
      {
        kind: "fixed",
        text: "Pasting more than 4,000 characters into chat could freeze or crash the client before you could remove it. Gryt keeps the paste out of the editor and attaches the full text as pasted-text.txt instead.",
      },
      {
        kind: "changed",
        text: "Starting a screen share now shows a loading state, and other people see who is starting a share instead of a generic connecting message. If it still has not arrived after 15 seconds, the tile says whose screen is not coming through.",
      },
      {
        kind: "fixed",
        text: "A call recovering from a brief disconnect keeps using the server the call is actually on, even if you are browsing another server, and the server gives reconnecting voice time to reappear before removing it.",
      },
      {
        kind: "fixed",
        text: "Changing microphones while one is still opening no longer lets the old request win, and the native app starts the platform default microphone correctly again.",
      },
      {
        kind: "fixed",
        text: "Tall dialogs stay inside a short browser window and scroll vertically instead of putting controls outside the viewport.",
      },
      {
        kind: "changed",
        text: "The video debug overlay shows more bandwidth, sender, candidate-path and RTCP details, making camera and screen-share problems easier to diagnose.",
      },
    ],
  },
  {
    version: "1.11.27",
    date: "2026-09-18",
    line: "Camera and screen shares no longer get stranded when voice signaling blips, and menus and pickers stay inside small windows.",
    changes: [
      {
        kind: "fixed",
        text: "Starting a camera or screen share while the voice signaling connection was briefly unavailable could leave the video missing for other people until you toggled it or rejoined. Gryt keeps that publish request and sends it as soon as signaling is ready.",
      },
      {
        kind: "fixed",
        text: "Selects, menus, context menus, comboboxes and autocomplete lists could run past the edge of a short or narrow window. They stay on screen and scroll now.",
      },
    ],
  },
  {
    version: "1.11.26",
    date: "2026-09-16",
    line: "Gryt asks you to agree to its terms before your first message, and joining voice no longer sometimes waits 20 seconds to connect.",
    changes: [
      {
        kind: "new",
        text: "The first time you send a message, Gryt asks you to agree to the Terms of Use and the Community Guidelines. Not now keeps your draft, and you're only asked again if the terms change.",
      },
      {
        kind: "fixed",
        text: "Joining voice could sit on connecting for about 20 seconds when the voice server's connection details arrived before its call setup. Gryt holds them until the call is ready now.",
      },
      {
        kind: "changed",
        text: "The activity field in your profile asks \"What are you up to?\" instead of showing an example status.",
      },
    ],
  },
  {
    version: "1.11.25",
    date: "2026-09-15",
    line: "The server built into the desktop app gets this week's security fixes, owners are told when a server needs a security update, and files saved from encrypted messages come out readable.",
    changes: [
      {
        kind: "security",
        text: "The server built into the desktop app is updated to 1.10.15, which keeps channel messages and sign-in tokens from reaching people who should not have them. Update if you host a server from the app.",
      },
      {
        kind: "new",
        text: "Owners and admins see a notice when the server they are on has a known security issue, with the version that fixes it.",
      },
      {
        kind: "fixed",
        text: "Save As, Copy Image and Download on a file in an encrypted conversation saved the encrypted copy. They save the real file now.",
      },
      {
        kind: "fixed",
        text: "With Automatic updates off, Check for Updates and starting at login still downloaded updates. They only tell you about them now.",
      },
      {
        kind: "changed",
        text: "Moving a guest to your account works when your account is already on the server, and saying no switches this device to your account there.",
      },
      {
        kind: "fixed",
        text: "Messages that arrived before a conversation was opened showed above the older ones.",
      },
      {
        kind: "fixed",
        text: "Adding a server you were already in from another address added it a second time.",
      },
      {
        kind: "fixed",
        text: "User settings cut off its pages in a narrow window, and a server you start from the app reconnects as soon as it is running.",
      },
    ],
  },
  {
    version: "1.11.24",
    date: "2026-09-15",
    line: "A server you host from the desktop app only accepts voice server registration from the same computer.",
    changes: [
      {
        kind: "security",
        text: "The voice server built into the desktop app took server registrations from anyone on your network. It only listens for them on the computer itself now, and calls from your network work as before.",
      },
    ],
  },
  {
    version: "1.11.23",
    date: "2026-09-15",
    line: "The desktop app clears out old copies of its built-in server, updates land on the newest release, Enter sends on the first press, and servers you host get a Manage server item.",
    changes: [
      {
        kind: "fixed",
        text: "The desktop app kept a full copy of its built-in server for every version it had ever run, which could add up to several gigabytes. It removes the old ones now and keeps the current one and the two before it.",
      },
      {
        kind: "fixed",
        text: "If a newer release came out while an update was waiting, pressing update installed the older one and then offered the newer one. It checks first and installs the newest.",
      },
      {
        kind: "fixed",
        text: "After pasting a link with a port, such as http://192.168.50.196:3000, the first Enter added a new line instead of sending. Times like 12:30 are no longer turned into emoji either.",
      },
      {
        kind: "new",
        text: "A server this app hosts has Manage server in its menu, which opens its card in My servers with Start and Stop.",
      },
      {
        kind: "fixed",
        text: "Two Gryt apps hosting servers on one computer could end up sharing one voice server. Each gets its own ports now.",
      },
      {
        kind: "fixed",
        text: "Dialogs ran off narrow windows and pushed their buttons out of view. The prompt about moving a guest to your account is also clearer about what each choice does.",
      },
      {
        kind: "fixed",
        text: "Deleting a server you host left its entry in the server list when you had joined it by a LAN address or a .local name.",
      },
      {
        kind: "changed",
        text: "What's new shows a label on every change instead of one per group.",
      },
      {
        kind: "fixed",
        text: "A long selected option no longer stretches a dropdown past its space, and About Gryt gives the copyright as 2022 to 2026.",
      },
    ],
  },
  {
    version: "1.11.22",
    date: "2026-09-15",
    line: "Encrypted videos wait for you to press play, Check for updates says when GitHub did not answer, a server you host shows as starting during a call, and webhook avatars are resized.",
    changes: [
      {
        kind: "security",
        text: "The server built into the desktop app is updated to 1.10.14, which stops link previews and webhook pictures from reaching addresses inside your network. Update if you host a server from the app.",
      },
      {
        kind: "fixed",
        text: "When GitHub did not answer a check for updates, Gryt said there were no published versions. It says GitHub could not be reached now, and when to try again if GitHub gave a time.",
      },
      {
        kind: "fixed",
        text: "A server you host from the app showed as reconnecting while it started if you were in a call anywhere. It shows as starting.",
      },
      {
        kind: "fixed",
        text: "The Linux packages listed the gryt:// link type up to five times in their desktop entry. They list it once.",
      },
      {
        kind: "changed",
        text: "A webhook's avatar is resized when you pick it, like a member avatar. On a server that has not updated yet, Gryt says the server needs an update first.",
      },
      {
        kind: "changed",
        text: "Videos in encrypted direct messages download and decrypt when you press play, instead of when the conversation opens.",
      },
      {
        kind: "fixed",
        text: "A video in the reports panel no longer restarts when Gryt renews its sign-in token, and the moderation buttons stay inside the dialog.",
      },
    ],
  },
  {
    version: "1.11.21",
    date: "2026-09-15",
    line: "On a narrow window, Server settings shows the server, voice and image versions under the page picker again.",
    changes: [
      {
        kind: "fixed",
        text: "The server, voice server and image worker versions went missing from Server settings on narrow windows. They sit under the page picker now.",
      },
    ],
  },
  {
    version: "1.11.20",
    date: "2026-09-15",
    line: "Server settings fit the window at every width, and on a phone you pick a settings page from a list instead of a squeezed sidebar.",
    changes: [
      {
        kind: "fixed",
        text: "Webhook rows ran past the edge of Server settings and cut off Create webhook. Every settings page now fits the dialog.",
      },
      {
        kind: "changed",
        text: "On a narrow window, Server settings shows a list to pick the page from instead of a sidebar that left almost no room for the page itself.",
      },
    ],
  },
  {
    version: "1.11.19",
    date: "2026-09-15",
    line: "Webhooks can post cards, and pictures load on a server you joined from Add a server without joining again.",
    changes: [
      {
        kind: "new",
        text: "Messages from a webhook can carry cards with a title, description, fields, images, an author and a footer.",
      },
      {
        kind: "fixed",
        text: "Joining a server from Add a server did not keep the key pictures need, so every picture on it failed to load until you joined again.",
      },
      {
        kind: "fixed",
        text: "A webhook posting under a different name was grouped under the name above it.",
      },
    ],
  },
  {
    version: "1.11.18",
    date: "2026-09-15",
    line: "A webhook's avatar saves when you pick one, instead of the settings saying it was updated when nothing changed.",
    changes: [
      {
        kind: "fixed",
        text: "Picking an avatar for a webhook said Avatar updated and never saved it. It saves now, and the message only shows once it has.",
      },
    ],
  },
  {
    version: "1.11.17",
    date: "2026-09-15",
    line: "Picking a picture for a group no longer changes your own avatar to it.",
    changes: [
      {
        kind: "fixed",
        text: "Choosing a picture for a group also made it your avatar on that server. The group gets the picture now and your avatar stays as it was. On a server that has not updated yet, Gryt says the server needs an update instead.",
      },
    ],
  },
  {
    version: "1.11.16",
    date: "2026-09-14",
    line: "If Gryt could not reach accounts when it started, it signs you back in once they answer again, without a restart.",
    changes: [
      {
        kind: "security",
        text: "The server built into the desktop app is updated to 1.10.8, so a file posted in a private channel or a direct message only opens for people who can see that conversation. Update if you host a server from the app.",
      },
      {
        kind: "fixed",
        text: "Opening Gryt while accounts were down left you signed out until you restarted it. Gryt now tries again in the background and signs you back in once accounts answer, on the desktop app and in the browser.",
      },
    ],
  },
  {
    version: "1.11.15",
    date: "2026-09-14",
    line: "Videos in chat play in Gryt's own player, and Gryt tells you when it cannot reach accounts instead of only saying it is taking a while.",
    changes: [
      {
        kind: "new",
        text: "Videos in chat and in link previews play in Gryt's own player, with the file name, size and time on top and volume that follows your chat media setting.",
      },
      {
        kind: "fixed",
        text: "If a video's link has gone stale, the player picks up a fresh one and carries on from the same spot instead of showing an error.",
      },
      {
        kind: "fixed",
        text: "Opening Gryt while accounts were down only said it was taking longer than it should. It now says it cannot reach Gryt accounts, or that you are offline, and a banner stays up until accounts answer again.",
      },
    ],
  },
  {
    version: "1.11.14",
    date: "2026-09-14",
    line: "Videos in chat wait for you to press play, the members list drops its grey boxes, and Check for updates stops calling being up to date an error.",
    changes: [
      {
        kind: "changed",
        text: "Videos in chat and in link previews show their thumbnail and a play button. Nothing downloads until you press it.",
      },
      {
        kind: "fixed",
        text: "A playing video no longer starts loading again when Gryt renews its sign-in token in the background.",
      },
      {
        kind: "changed",
        text: "Names in the members list sit straight on the sidebar. A row turns grey only when you hover it or focus it with the keyboard.",
      },
      {
        kind: "fixed",
        text: "On the beta channel, Check for updates said there were no published versions when you were already on the newest one. It says Gryt is up to date now.",
      },
      {
        kind: "changed",
        text: "Each server renews its token on its own schedule, instead of every server renewing at the same moment every four minutes.",
      },
    ],
  },
  {
    version: "1.11.13",
    date: "2026-09-14",
    line: "If the sound for a screen share stops being captured partway through, Gryt drops the audio track, so the people watching are not left with a silent one.",
    changes: [
      {
        kind: "fixed",
        text: "When the sound for a screen share stopped being captured, the people watching kept getting a silent audio track. Gryt drops that track now.",
      },
    ],
  },
  {
    version: "1.11.12",
    date: "2026-09-14",
    line: "What's new now covers every release since the version you last used, screen sharing on macOS sends its sound, and Show me around starts the tour.",
    changes: [
      {
        kind: "new",
        text: "What's new lists every release since the version you last used, newest first. Before, it only showed the version you were on.",
      },
      {
        kind: "fixed",
        text: "Sharing your screen on macOS sent no sound, even with something playing. It does now, and if the sound cannot be captured, Gryt tells you.",
      },
      {
        kind: "fixed",
        text: "Show me around on the welcome screen did nothing. It starts the tour now.",
      },
      {
        kind: "changed",
        text: "The addresses in the advanced latency panel stay hidden until you choose to show them.",
      },
    ],
  },
  {
    version: "1.11.11",
    date: "2026-09-14",
    line: "Direct messages keep the newest conversation at the top and show each server's own icon. Hovering a server or your voice tile no longer shows an address.",
    changes: [
      {
        kind: "fixed",
        text: "A conversation moves to the top of the list whenever a new message arrives. Before, only its first message did that.",
      },
      {
        kind: "fixed",
        text: "Each conversation shows its server's own icon instead of a generic planet.",
      },
      {
        kind: "fixed",
        text: "An empty conversation you had open drops out of the list when you open another one.",
      },
      {
        kind: "changed",
        text: "Hovering a server in the sidebar, or the latency on your own voice tile, no longer shows the server's address.",
      },
    ],
  },
  {
    version: "1.11.10",
    date: "2026-09-14",
    line: "Link previews and X posts that fail to load try again instead of disappearing.",
    changes: [
      {
        kind: "fixed",
        text: "A link preview that ran into the server's limit stayed hidden until you restarted Gryt. It now waits and then loads.",
      },
      {
        kind: "fixed",
        text: "A link preview or an X post that failed because of a hiccup on the server's side disappeared. It now tries again a couple of times first.",
      },
    ],
  },
  {
    version: "1.11.9",
    date: "2026-09-10",
    line: "The messages button now takes you back to where you were, so you can check your direct messages and come straight back.",
    changes: [
      {
        kind: "new",
        text: "Clicking the messages button while you are in your direct messages takes you back to the server and channel you came from.",
      },
      {
        kind: "fixed",
        text: "If you opened a conversation with no messages in it, going back to your direct messages later showed it again, even though it was gone from the list. Your most recent conversation opens instead.",
      },
      {
        kind: "fixed",
        text: "The Servers on your network button did nothing while your direct messages were open.",
      },
    ],
  },
  {
    version: "1.11.8",
    date: "2026-09-10",
    line: "Direct messages and servers each keep to their own view now, and opening direct messages takes you straight to your latest conversation.",
    changes: [
      {
        kind: "fixed",
        text: "Direct messages no longer show a server's channel, and a server no longer shows your direct messages. On 1.11.7 one could turn up in the other's place, so a conversation looked like it belonged to a server.",
      },
      {
        kind: "changed",
        text: "Opening direct messages opens your most recent conversation, instead of an empty view.",
      },
    ],
  },
  {
    version: "1.11.7",
    date: "2026-09-10",
    line: "Direct messages work like a place of their own now, and Gryt opens back up on the page you left it on.",
    changes: [
      {
        kind: "changed",
        text: "Direct messages are a place you go, like a server. The button beside the servers opens them, and picking a server takes you back.",
      },
      {
        kind: "changed",
        text: "Clicking somebody in the member list takes you to your conversation with them in direct messages.",
      },
      {
        kind: "changed",
        text: "A conversation nobody has written in only shows in the list while you are looking at it. Click somebody else, or go anywhere else, and it drops out until one of you writes.",
      },
      {
        kind: "new",
        text: "Gryt remembers where you were. Moving between a server and your direct messages puts you back where you left each one.",
      },
      {
        kind: "new",
        text: "Gryt opens on the page you closed it on, instead of the top server in the list.",
      },
    ],
  },
  {
    version: "1.11.6",
    date: "2026-09-10",
    line: "The note you are reading this in scrolls now, and closes when you click away. A direct message marks one badge instead of two, and on a phone the direct messages redesign finally arrives.",
    changes: [
      {
        kind: "fixed",
        text: "This note scrolls when it is longer than your screen. It used to grow past the top and the bottom of the window, taking the greeting and the Done button with it.",
      },
      {
        kind: "changed",
        text: "Clicking outside this note closes it, and you can open it again from Settings under About.",
      },
      {
        kind: "fixed",
        text: "A direct message marks one badge instead of two. It counted on the direct messages button and on the server icon it arrived at, so reading it changed both.",
      },
      {
        kind: "changed",
        text: "On a phone, tapping somebody in the member list opens your conversation with them, and direct messages have their own space reached from the channels panel. The desktop got this last release and the phone did not.",
      },
    ],
  },
  {
    version: "1.11.5",
    date: "2026-09-09",
    line: "Direct messages have a space of their own, reached from a button above the servers. Gryt always says when you are in a voice call, and it stops retrying a server that is never going to answer.",
    changes: [
      {
        kind: "new",
        text: "Direct messages have a space of their own, on a button above the servers. It holds every conversation you have, across every server you are on, and unread ones count on that button.",
      },
      {
        kind: "changed",
        text: "Clicking somebody in the member list opens your conversation with them. Direct messages are no longer a category in the channel list, and one you have not read shows on that person's row.",
      },
      {
        kind: "fixed",
        text: "The app always says when you are in a voice call. A call could get stuck reading as still connecting, and while that lasted the microphone mark on the server and the controls above your picture were both hidden. The call was up and your microphone was open the whole time.",
      },
      {
        kind: "changed",
        text: "The microphone mark on a server says whether sound is leaving your machine, and appears for a call that is still connecting rather than only one that is up.",
      },
      {
        kind: "changed",
        text: "Gryt gives up on a server that is not answering after about two minutes and says it is unreachable, with a button to try again. It used to retry for as long as the app was open.",
      },
      {
        kind: "changed",
        text: "The notice that Gryt is reconnecting to a server can be dismissed, and goes on its own after six seconds.",
      },
      {
        kind: "fixed",
        text: "Menus open where they should when the interface is scaled. The desktop app scales with Chromium's own zoom now rather than with CSS.",
      },
      {
        kind: "fixed",
        text: "A server you create keeps the name you gave it.",
      },
      {
        kind: "security",
        text: "Gryt warns you before a second device breaks encryption with the people you talk to, and offers to carry your message key across instead.",
      },
      {
        kind: "changed",
        text: "A message with a link no longer loads the preview until you ask for it. Reading a channel used to fetch pages from whatever sites had been linked in it.",
      },
      {
        kind: "fixed",
        text: "A direct conversation with nothing in it no longer says the server can read it, directly under a banner saying it cannot.",
      },
      {
        kind: "fixed",
        text: "A message arriving in a direct conversation no longer makes it jump, or turns the messages already on screen back into unreadable text.",
      },
      {
        kind: "fixed",
        text: "Gryt says when the other person's app is sending in the clear.",
      },
      {
        kind: "changed",
        text: "A channel with something unread is visible in the sidebar, on a colour of its own rather than the red Gryt uses for deleting things.",
      },
      {
        kind: "fixed",
        text: "Gryt stops announcing the servers on your network as new every time it starts. Which ones this machine has already looked at is remembered on the device now, rather than against whoever was signed in at the moment you looked.",
      },
    ],
  },
  {
    version: "1.11.4",
    date: "2026-09-09",
    line: "Gryt no longer pulls its window in front of a game to show you something, and the notice about what changed tries again when the first answer is empty.",
    changes: [
      {
        kind: "fixed",
        text: "Gryt no longer puts its window above everything else when it has something to show you. An update notice while you were in a game pulled the app in front of it.",
      },
      {
        kind: "fixed",
        text: "The notice about what changed asks the site again when the first answer has nothing in it, and asks for a fresh copy rather than the one it already had. On 1.11.3 an app that updated before the site had rebuilt saw nothing.",
      },
    ],
  },
  {
    version: "1.11.3",
    date: "2026-09-09",
    line: "The login service going down no longer signs you out, because a refresh that cannot reach it now waits and tries again.",
    changes: [
      {
        kind: "fixed",
        text: "The login service going down no longer signs you out. A refresh that cannot reach it waits and tries again, and only a token the service has actually turned down ends your session.",
      },
    ],
  },
  {
    version: "1.11.2",
    date: "2026-09-09",
    line: "The notice about what changed now appears, instead of reading your settings too early and deciding every time that you were a new install.",
    changes: [
      {
        kind: "fixed",
        text: "The notice about what changed now appears. It had been reading your settings before they had loaded, so every launch decided you were a new install and said nothing.",
      },
    ],
  },
  {
    version: "1.11.1",
    date: "2026-09-09",
    line: "Nothing changed in the app. We bumped the version to test the notice you are reading this in.",
  },
  {
    version: "1.11.0",
    date: "2026-09-09",
    line: "Gryt says what changed the first time you open a new version. Voice no longer sends your microphone twice when a connection rebuilds, and messages in a thread sit in from the panel edge. Links are underlined wherever they appear.",
    changes: [
      {
        kind: "new",
        text: "Gryt says what changed the first time you open a new version, sorted into what is new, what is fixed and anything about security.",
      },
      {
        kind: "fixed",
        text: "Voice no longer sends your microphone twice when a connection rebuilds.",
      },
      {
        kind: "fixed",
        text: "Messages in a thread sit in from the panel edge instead of against it.",
      },
      {
        kind: "changed",
        text: "Links are underlined wherever they appear, rather than only under the pointer.",
      },
    ],
    post: "gryt-tells-you-what-changed",
  },
  {
    version: "1.10.3",
    date: "2026-09-08",
    line: "Joining voice waits for a slow microphone instead of giving up after six seconds and telling you it is unavailable. A role on the hover card shows its name rather than its id, and the role everybody starts with no longer takes a pill of its own.",
    changes: [
      {
        kind: "fixed",
        text: "Joining voice waits for a slow microphone instead of giving up after six seconds and telling you it is unavailable.",
      },
      {
        kind: "fixed",
        text: "A role on the hover card shows its name rather than its id, and the role everybody starts with no longer takes a pill of its own.",
      },
    ],
  },
  {
    version: "1.10.2",
    date: "2026-09-08",
    line: "A message Gryt cannot encrypt is no longer sent in the clear. Gryt asks before reading your process list now, and on a tiling window manager it draws no titlebar at all.",
    changes: [
      {
        kind: "security",
        text: "A message Gryt cannot encrypt is no longer sent in the clear.",
      },
      { kind: "security", text: "Gryt asks before reading your process list now." },
      {
        kind: "fixed",
        text: "On a tiling window manager it draws no titlebar at all.",
      },
    ],
  },
  {
    version: "1.10.1",
    date: "2026-09-08",
    line: "Reply and edit inside a thread, scroll back through a long one, and see what it has unread without opening it. Mark a channel, a folder or a whole server as read, and install on an Intel Mac or from an RPM.",
    changes: [
      {
        kind: "new",
        text: "Reply and edit inside a thread, scroll back through a long one, and see what it has unread without opening it.",
      },
      { kind: "new", text: "Mark a channel, a folder or a whole server as read." },
      { kind: "new", text: "Install on an Intel Mac or from an RPM." },
    ],
  },
  {
    version: "1.10.0-beta.1",
    date: "2026-09-08",
    channel: "beta",
    line: "The first build with mark-as-read, the Intel Mac download and the RPM in it.",
    changes: [
      { kind: "new", text: "Mark a channel, a folder or a whole server as read." },
      { kind: "new", text: "Install on an Intel Mac or from an RPM." },
    ],
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
    version: "1.10.16",
    date: "2026-09-16",
    line: "The Windows and Linux server bundles keep their voice server's registration and metrics ports to the machine they run on, where anyone on the same network could reach them before.",
    changes: [
      {
        kind: "security",
        text: "The self-hosted bundles set SFU_CONTROL_HOST and SFU_METRICS_HOST to 127.0.0.1, so other machines on your network can't register a server with your voice server or read its metrics. They also set METRICS_PORT=0, so the server's own metrics can't take that port instead. A config.env you copy over from an older bundle needs those three lines added.",
      },
    ],
  },
  {
    version: "1.10.15",
    date: "2026-09-15",
    line: "Security release: channel messages only reach members who can read the channel, no member's sign-in token is sent to other members, and sign-in tokens issued before this version stop working once so clients sign in again by themselves. Update every server you run.",
    changes: [
      {
        kind: "security",
        text: "New channel messages, edits and reactions only reach people who can read the channel. Before, a connection that had not joined the server got them too, and so did members without permission to see the channel.",
      },
      {
        kind: "security",
        text: "Members no longer receive each other's sign-in tokens with the list of who is connected. Before, any member could use one to act as another member who was online, the owner included.",
      },
      {
        kind: "changed",
        text: "Sign-in tokens issued before this version stop working the first time it starts, so a copied one is useless. Apps get a new token by themselves, and people may see one reconnect.",
      },
      {
        kind: "fixed",
        text: "Saying yes to moving a guest to your account works when your account is already a member of the server. It used to move nothing.",
      },
    ],
  },
  {
    version: "1.10.14",
    date: "2026-09-15",
    line: "Link previews, image measuring and webhook pictures refuse every address inside the server's own network, however the address is written or wherever a redirect points, and webhook avatars are resized like member avatars. Update if you run a server.",
    changes: [
      {
        kind: "security",
        text: "Link previews, image measuring and webhook pictures refuse every address inside the server's own network, however the address is written or wherever a redirect points. Before, some of those addresses got through.",
      },
      {
        kind: "fixed",
        text: "Webhook avatars are resized like member avatars. They used to be stored at full size.",
      },
    ],
  },
  {
    version: "1.10.13",
    date: "2026-09-15",
    line: "Renaming an emoji, importing from BTTV and creating or editing a webhook accept request bodies up to 100 KB, the limit those routes always meant to have.",
  },
  {
    version: "1.10.12",
    date: "2026-09-15",
    line: "A request with broken JSON gets a 400 and one that is too big gets a 413, where both used to get a 500, and webhook messages are held to their 256 KB limit.",
  },
  {
    version: "1.10.11",
    date: "2026-09-15",
    line: "Webhooks can post up to 10 cards, with their pictures fetched once and stored on the server, and a webhook message keeps its name and avatar after a reload.",
  },
  {
    version: "1.10.10",
    date: "2026-09-15",
    line: "The media cleanup keeps webhook avatars. It used to delete them about half an hour after upload.",
  },
  {
    version: "1.10.9",
    date: "2026-09-15",
    line: "Group pictures get their own upload, so setting one no longer replaces the uploader's avatar, and the media cleanup keeps them.",
  },
  {
    version: "1.10.8",
    date: "2026-09-14",
    line: "A file posted in a private channel or a direct message can only be opened by people who can see that conversation. Before, any member with the file's link could open it.",
    changes: [
      {
        kind: "security",
        text: "A file posted in a private channel or a direct message only opens for people who can see that conversation. Before, any member with the file's link could open it.",
      },
    ],
  },
  {
    version: "1.10.7",
    date: "2026-09-14",
    line: "Asking for part of an uploaded file past its end gets the part that exists, so videos no longer fail to play when a browser asks for more than the file holds.",
  },
  {
    version: "1.10.6",
    date: "2026-09-14",
    line: "Renewing a sign-in token no longer makes the server check the member again and reload the whole member list, unless something about that member changed.",
  },
  {
    version: "1.10.5",
    date: "2026-09-14",
    line: "A client held back by a rate limit is told the real wait before it can try again. The self-hosted downloads report the SFU and image worker versions they contain.",
  },
  {
    version: "1.10.4",
    date: "2026-09-14",
    line: "MakerWorld links get a preview again, and a preview that failed is tried again after a few minutes instead of an hour. A client that hits a rate limit is told how long it really has to wait.",
  },
  {
    version: "1.10.3",
    date: "2026-09-14",
    line: "Opening a channel full of links no longer uses up your link preview limit, because previews the server already has do not count. A slow site no longer makes its preview fail outright. When a site stops answering, you get the last preview it gave.",
  },
  {
    version: "1.10.2",
    date: "2026-09-10",
    line: "Nothing changed that you would notice. It brings the image worker it ships with up to date.",
  },
  {
    version: "1.10.1",
    date: "2026-09-10",
    line: "Opening somebody's conversation no longer puts an empty one in their list. It waits until somebody writes in it.",
  },
  {
    version: "1.10.0",
    date: "2026-09-09",
    line: "The name you give a server when you create it saves properly now, and after an SFU upgrade the server works out where to register on its own instead of needing a config change.",
  },
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
    version: "1.0.68",
    date: "2026-09-15",
    line: "SFU_METRICS_HOST sets the address the metrics port listens on, the same way SFU_CONTROL_HOST does for registration. It listens on every address when unset, as before.",
  },
  {
    version: "1.0.67",
    date: "2026-09-15",
    line: "SFU_CONTROL_HOST sets the address the registration port listens on. It listens on every address when unset, as before.",
  },
  {
    version: "1.0.66",
    date: "2026-09-15",
    line: "An SFU that cannot bind its control port refuses to start, instead of running and sending the servers it turns away to whatever else holds that port.",
  },
  {
    version: "1.0.65",
    date: "2026-09-09",
    line: "Registration moves off the SFU's public port, so a stranger can no longer point their own server at yours and use it to carry their calls, and the servers already using it keep working without a config change.",
  },
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
    version: "1.2.6",
    date: "2026-09-10",
    line: "Housekeeping only.",
  },
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
