/**
 * What the latest release contains, and which file a given platform wants. One copy on
 * purpose: two callers disagreeing about the Windows installer sends somebody the wrong file.
 */

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  published_at: string | null;
  assets: ReleaseAsset[];
}

export type OS = "windows" | "macos" | "linux" | "ios" | "android";

export type DesktopOS = "windows" | "macos" | "linux";

/** Which chip a build runs on. Only macOS ships more than one today. */
export type Arch = "arm64" | "x64";

export const ARCH_NAMES: Record<Arch, string> = {
  arm64: "Apple silicon",
  x64: "Intel",
};

export interface DownloadOption {
  label: string;
  description: string;
  url: string;
  size: number;
  fileName: string;
  /**
   * Whether this build carries the server you can host from inside the app. Every release
   * ships each platform twice, and without this flag the two are duplicate rows.
   */
  withServer: boolean;
  /**
   * The chip this build runs on, or null where the platform ships one build. macOS is the
   * only one with two, and an arm64 app does not start on an Intel Mac at all.
   */
  arch: Arch | null;
}

/** A plain https link. `ms-windows-store://` dies quietly anywhere but Windows. */
export const MS_STORE_URL = "https://apps.microsoft.com/detail/9pkpt1c2m95q";

export const SNAP_STORE_URL = "https://snapcraft.io/gryt-chat";

/** The vendor's own badge file in public/badges, drawn as it came: never recoloured or stretched. */
export interface StoreListing {
  url: string;
  badge: string;
  alt: string;
  width: number;
  height: number;
}

/** `name` is how the store reads in a sentence, for the coming-soon line. */
export interface Store {
  os: OS;
  name: string;
  listing?: StoreListing;
}

/** A store gets a badge once it has a listing. Until then it's named in the coming-soon line. */
export const STORES: Store[] = [
  {
    os: "windows",
    name: "the Microsoft Store",
    listing: {
      url: MS_STORE_URL,
      badge: "/badges/microsoft-store.svg",
      alt: "Download from the Microsoft Store",
      width: 161,
      height: 44,
    },
  },
  {
    os: "linux",
    name: "the Snap Store",
    /* Canonical's badge, CC BY-ND 2.0 UK, from github.com/snapcore/snap-store-badges. */
    listing: {
      url: SNAP_STORE_URL,
      badge: "/badges/snap-store.svg",
      alt: "Get it from the Snap Store",
      width: 182,
      height: 56,
    },
  },
  { os: "macos", name: "the Mac App Store" },
  { os: "ios", name: "the App Store" },
  { os: "android", name: "Google Play" },
];

export interface PackageManager {
  os: OS;
  name: string;
  /** The Snippet label. */
  label: string;
  /** Only once it installs a current build. Without one it's named in the coming-soon line. */
  command?: string;
}

/** Every one of these installs the full build, with the server in it. */
export const PACKAGE_MANAGERS: PackageManager[] = [
  {
    os: "macos",
    name: "Homebrew",
    label: "Homebrew · macOS",
    command: "brew install --cask gryt-chat/tap/gryt-chat",
  },
  { os: "linux", name: "snap", label: "snap · Linux", command: "sudo snap install gryt-chat" },
  { os: "linux", name: "the AUR", label: "AUR · Arch Linux", command: "yay -S gryt-chat-bin" },
  /* Gryt.GrytChat is still an open submission to winget-pkgs. */
  { os: "windows", name: "winget", label: "winget · Windows" },
];

/** The visitor's own platform first, and otherwise the order given. */
export function forPlatform<T extends { os: OS }>(items: T[], os: OS | null): T[] {
  return [...items.filter((i) => i.os === os), ...items.filter((i) => i.os !== os)];
}

/** "the App Store, Google Play and winget": stores, then commands, each led by the visitor's own. */
export function comingSoon(os: OS | null): string | null {
  const names = [
    ...forPlatform(STORES, os).filter((s) => !s.listing),
    ...forPlatform(PACKAGE_MANAGERS, os).filter((p) => !p.command),
  ].map((c) => c.name);
  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const LATEST =
  "https://api.github.com/repos/Gryt-chat/gryt/releases/latest";

/**
 * One request per page load, however many things ask. GitHub allows sixty an hour per
 * address. The promise is cached rather than the result, and a failure is not cached.
 */
let inFlight: Promise<Release> | null = null;

export function fetchLatestRelease(signal?: AbortSignal): Promise<Release> {
  if (inFlight) return inFlight;

  // Deliberately not passing `signal` to the shared fetch: one caller unmounting must not
  // cancel the request every other caller is waiting on. The abort is honoured per caller.
  inFlight = fetch(LATEST)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
      return res.json() as Promise<Release>;
    })
    .catch((err) => {
      inFlight = null;
      throw err;
    });

  if (!signal) return inFlight;

  const shared = inFlight;
  return new Promise<Release>((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener(
      "abort",
      () => reject(new DOMException("Aborted", "AbortError")),
      { once: true },
    );
    shared.then(resolve, reject);
  });
}

/** Phones first: an iPhone says "like Mac OS X", and Android says "Linux". */
export function detectOS(
  userAgent: string = navigator.userAgent,
  maxTouchPoints: number = navigator.maxTouchPoints,
): OS {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  /* An iPad asks for the desktop site and says Macintosh. Its touch points give it away. */
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return "ios";
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Mac/i.test(userAgent)) return "macos";
  return "linux";
}

/** Whether there's a file to download for it. A phone or a tablet never gets one. */
export function isDesktop(os: OS | null): os is DesktopOS {
  return os === "windows" || os === "macos" || os === "linux";
}

/** What /download fetches. `?os=` only counts on a computer, so a phone never gets a file. */
export function downloadTarget(detected: OS | null, asked: string | null): OS | null {
  if (!isDesktop(detected)) return detected;
  return parseOS(asked) ?? detected;
}

/**
 * Apple silicon or Intel, or null when the browser will not say. Nothing in the user agent
 * answers it, so the GPU is the signal; Safari says "Apple GPU" for every Mac and gets null.
 */
export function detectMacArch(): Arch | null {
  try {
    const ua = navigator.userAgent;
    if (/safari/i.test(ua) && !/chrome|chromium|crios|edg/i.test(ua)) return null;

    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return null;

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return null;

    const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "");
    if (!renderer) return null;

    return /apple/i.test(renderer) ? "arm64" : "x64";
  } catch {
    return null;
  }
}

/** Only the three the site actually serves files for. */
export function parseOS(value: string | null): OS | null {
  if (value === "windows" || value === "macos" || value === "linux") {
    return value;
  }
  return null;
}

export function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export const OS_NAMES: Record<OS, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  ios: "iOS",
  android: "Android",
};

/**
 * The file to hand somebody who asked for "the download". Ordered rather than whichever
 * asset GitHub listed first, and Linux leads with the AppImage since a browser cannot tell.
 */
const PREFERRED: Record<OS, string[]> = {
  windows: ["Installer", "Portable"],
  /* Apple silicon first because that is every Mac sold since 2020, and because
     `primaryOption` only falls back to this order when the chip is unknown. */
  macos: ["DMG (Apple silicon)", "DMG (Intel)"],
  linux: ["AppImage", "Debian / Ubuntu", "Fedora / RHEL"],
  ios: [],
  android: [],
};

export function primaryOption(
  options: DownloadOption[],
  os: OS,
  arch?: Arch | null,
): DownloadOption | null {
  /* An arm64 app does not start on an Intel Mac, so the chip decides before the format does.
     Narrowed rather than filtered: a release missing one arch still hands over the other. */
  if (arch) {
    const forArch = options.filter((o) => o.arch === null || o.arch === arch);
    if (forArch.length > 0) options = forArch;
  }

  for (const label of PREFERRED[os]) {
    // Each label exists twice, full and slim. Slim by intent rather than by `find`, which
    // took whatever GitHub listed first — upload order would otherwise pick the default.
    const matches = options.filter((o) => o.label === label);
    if (matches.length > 0) {
      return matches.find((o) => !o.withServer) ?? matches[0];
    }
  }
  return options[0] ?? null;
}

/** One file per format in the order above, full or slim, and the other build where one is missing. */
export function filesFor(
  options: DownloadOption[],
  os: OS,
  withServer: boolean,
): DownloadOption[] {
  const labels = [...new Set([...PREFERRED[os], ...options.map((o) => o.label)])];
  return labels.flatMap((label) => {
    const matches = options.filter((o) => o.label === label);
    const pick = matches.find((o) => o.withServer === withServer) ?? matches[0];
    return pick ? [pick] : [];
  });
}

export function categorizeAssets(
  assets: ReleaseAsset[],
): Record<OS, DownloadOption[]> {
  const result: Record<OS, DownloadOption[]> = {
    windows: [],
    macos: [],
    linux: [],
    ios: [],
    android: [],
  };

  for (const asset of assets) {
    const name = asset.name.toLowerCase();

    if (name.endsWith(".blockmap") || name.endsWith(".yml") || name.endsWith(".yaml")) {
      continue;
    }

    // electron-builder names the slim artifacts, so the file name is the only
    // thing that says which build this is.
    const withServer = !name.includes("-slim");

    /* From the file name, the same way the variant is: `-mac-x64-slim.dmg` and
       `-mac-arm64.dmg` are the two shapes, and every other platform ships x64 only. */
    const arch: Arch | null = name.includes("-arm64")
      ? "arm64"
      : name.includes("-x64") || name.includes("-x86_64") || name.includes("-amd64")
        ? "x64"
        : null;

    const option = (label: string, description: string): DownloadOption => ({
      label,
      description,
      withServer,
      arch,
      url: asset.browser_download_url,
      size: asset.size,
      fileName: asset.name,
    });

    if (name.includes("-win-") || name.includes("-win32-")) {
      if (name.includes("portable")) {
        result.windows.push(option("Portable", "Runs from anywhere, nothing to install. Does not update itself."));
      } else if (name.endsWith(".exe")) {
        result.windows.push(option("Installer", "Standard Windows installer (NSIS)"));
      }
    } else if (name.includes("-mac-")) {
      if (name.endsWith(".dmg")) {
        /* The chip is in the label, not only in `arch`, because the page groups its format
           tabs by label. Two rows both reading "DMG" collapsed into one. */
        result.macos.push(
          arch === "x64"
            ? option("DMG (Intel)", "Disk image for Intel Macs")
            : option("DMG (Apple silicon)", "Disk image for Apple silicon Macs"),
        );
      }

      /* The .zip is deliberately not offered: Squirrel.Mac can only update from a zip, so
         it is the updater's payload rather than a way to install. */
    } else if (name.includes("-linux-")) {
      /* All three update themselves, so no description may imply otherwise: electron-updater
         reads resources/package-type, and the AppImage gets AppImageUpdater. */
      if (name.endsWith(".appimage")) {
        result.linux.push(option("AppImage", "Portable, works on most distros. It’s the app itself, so put it somewhere it can stay. Updates replace this file in place."));
      } else if (name.endsWith(".deb")) {
        result.linux.push(option("Debian / Ubuntu", ".deb package for Debian, Ubuntu and other apt-based distros."));
      } else if (name.endsWith(".rpm")) {
        result.linux.push(option("Fedora / RHEL", ".rpm package for Fedora, RHEL, openSUSE and other dnf-based distros."));
      }

      /* The .snap is deliberately not offered: a snap installed from a file never updates.
         Download.tsx gives the Snap Store command instead. */
    }
  }

  return result;
}
