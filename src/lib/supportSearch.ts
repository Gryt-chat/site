/** One hit from the docs search endpoint. */
export interface DocsHit {
  type: "page" | "heading" | "text";
  content: string;
  url: string;
}

export interface SupportResult {
  name: string;
  /** The docs page the section is on. */
  page: string;
  /** Empty when the match was the heading itself. */
  detail: string;
  href: string;
}

/** The first five are the cards on /support; everything after them is listed below the cards. */
export const SUPPORT_PAGES: { title: string; href: string; detail: string; kind: "problem" | "guide"; words: string[] }[] = [
  {
    title: "I can't invite a friend",
    href: "/support/invite-a-friend",
    detail: "Links that only work on your network, refused codes and missing permissions.",
    kind: "problem",
    words: ["invite", "invitation", "link", "code", "friend", "join", "refused", "expired", "uses"],
  },
  {
    title: "Nobody can hear anyone",
    href: "/support/nobody-can-hear-anyone",
    detail: "Chat works, but voice doesn't.",
    kind: "problem",
    words: ["hear", "sound", "audio", "voice", "silent", "port", "ports", "udp", "nobody"],
  },
  {
    title: "My mic doesn't work",
    href: "/support/microphone",
    detail: "Mute, your input device, permissions and the noise gate.",
    kind: "problem",
    words: ["mic", "microphone", "mute", "muted", "echo", "quiet", "input", "noise", "headset"],
  },
  {
    title: "I can't connect to a server",
    href: "/support/cant-connect",
    detail: "Wrong addresses, servers that are down and error messages.",
    kind: "problem",
    words: ["connect", "connecting", "connection", "error", "offline", "identity", "clock", "timeout", "down", "address"],
  },
  {
    title: "The app won't install or open",
    href: "/support/install",
    detail: "Warnings on Windows and macOS, and Linux AppImages.",
    kind: "problem",
    words: ["install", "installer", "download", "open", "smartscreen", "windows", "macos", "mac", "linux", "appimage", "launch"],
  },
  {
    title: "Joining voice hangs, then blames my network",
    href: "/support/voice-wont-start",
    detail: "Nothing happens for 15 seconds, then a message about your network.",
    kind: "problem",
    words: ["hang", "hangs", "stuck", "seconds", "network", "join", "joining", "stun", "dns", "adguard", "pihole", "nextdns", "voice"],
  },
  {
    title: "Voice sounds bad",
    href: "/support/sound-problems",
    detail: "Echo, cut-off words, pumping volume or audio dropping out.",
    kind: "problem",
    words: ["echo", "bad", "quality", "cut", "cuts", "cutting", "robotic", "pump", "volume", "loud", "drop", "dropping", "feedback"],
  },
  {
    title: "People hear themselves when I share my screen",
    href: "/support/screen-share-echo",
    detail: "Your screen share is picking up Gryt's own audio.",
    kind: "problem",
    words: ["screen", "share", "screenshare", "sharing", "themselves", "twice", "double", "own", "voice"],
  },
  {
    title: "It says the server's clock is wrong",
    href: "/support/server-clock",
    detail: "The server's clock is off by more than a minute.",
    kind: "problem",
    words: ["clock", "time", "ntp", "wrong", "timedatectl", "chrony"],
  },
  {
    title: "It says Server identity not recognised",
    href: "/support/server-identity",
    detail: "The server has a different key than when you first joined.",
    kind: "problem",
    words: ["identity", "recognised", "recognized", "key", "pinned", "fingerprint", "blocked", "unblock"],
  },
  {
    title: "The server restarted and things look odd",
    href: "/support/after-server-restart",
    detail: "A reconnect message and a short blip in voice are normal.",
    kind: "problem",
    words: ["restart", "restarted", "reconnect", "reconnecting", "unknown", "member", "list", "stale", "blip"],
  },
  {
    title: "My own server won't start or nobody can reach it",
    href: "/support/my-server-wont-start",
    detail: "Checks for a server in Docker or Kubernetes.",
    kind: "problem",
    words: ["docker", "kubernetes", "k8s", "container", "containers", "pod", "pods", "compose", "websocket", "sfu", "cors", "health", "logs", "memory"],
  },
  {
    title: "The app won't update or forgets my profile",
    href: "/support/app-updates",
    detail: "Old Windows versions need one manual install.",
    kind: "problem",
    words: ["update", "updates", "updating", "upgrade", "version", "profile", "resets", "forgets", "settings", "stuck"],
  },
  {
    title: "Host a server from the app",
    href: "/support/host-a-server",
    detail: "The app is also a server. Make one in under a minute.",
    kind: "guide",
    words: ["host", "hosting", "create", "make", "own", "new", "server", "start", "lan", "party", "run"],
  },
  {
    title: "Join a server",
    href: "/support/join-a-server",
    detail: "Use an invite link, or add a server by its address.",
    kind: "guide",
    words: ["join", "joining", "add", "enter", "address", "friend", "link", "first", "get", "started"],
  },
  {
    title: "Make an invite",
    href: "/support/make-an-invite",
    detail: "Create a link, limit its uses, or open up to your network.",
    kind: "guide",
    words: ["invite", "invites", "create", "make", "code", "share", "link", "lan", "limit", "revoke", "expiry"],
  },
  {
    title: "Do I need an account?",
    href: "/support/account-or-guest",
    detail: "Not to try it. Here's how to choose between guest and account.",
    kind: "guide",
    words: ["account", "guest", "sign", "signup", "login", "email", "password", "register", "identity", "device", "lost"],
  },
];

/** Our own pages answer in everyday words, which the docs search can miss: "no sound" finds nothing useful there. */
export function matchSupportPages(query: string): SupportResult[] {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return SUPPORT_PAGES.map((page) => ({
    page,
    score: terms.filter((term) => page.words.includes(term)).length,
  }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ page }) => ({ name: page.title, page: "Support", detail: page.detail, href: page.href }));
}

const DOCS_ORIGIN = "https://docs.gryt.chat";
const MAX_RESULTS = 8;

export const DOCS_SEARCH_URL = `${DOCS_ORIGIN}/api/search`;

function sectionName(url: string): string {
  const [path, hash] = url.split("#");
  const slug = hash || path.split("/").pop() || "Docs";
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function plainText(content: string): string {
  // The endpoint wraps matched words in <mark>.
  return content.replace(/<\/?mark>/g, "").replace(/[`*_]/g, "").replace(/\s+/g, " ").trim();
}

/** Help for people using or hosting Gryt first. The API reference answers a different question. */
export function toSupportResults(hits: DocsHit[]): SupportResult[] {
  const seen = new Set<string>();
  const sections = new Set(hits.filter((hit) => hit.url.includes("#")).map((hit) => hit.url.split("#")[0]));
  const unique = hits.filter((hit) => {
    if (seen.has(hit.url) || hit.url.startsWith("/docs/build") || sections.has(hit.url)) return false;
    seen.add(hit.url);
    return true;
  });

  const rank = (hit: DocsHit) => (hit.url.startsWith("/docs/use") ? 0 : 1);
  return unique
    .map((hit, index) => ({ hit, index }))
    .sort((a, b) => rank(a.hit) - rank(b.hit) || a.index - b.index)
    .slice(0, MAX_RESULTS)
    .map(({ hit }) => {
      const text = plainText(hit.content);
      return {
        name: hit.type === "text" ? sectionName(hit.url) : text,
        page: sectionName(hit.url.split("#")[0]),
        detail: hit.type === "text" ? text : "",
        href: `${DOCS_ORIGIN}${hit.url}`,
      };
    });
}
