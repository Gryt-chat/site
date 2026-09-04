/**
 * What the latest release contains, and which file a given platform wants.
 *
 * This lived inside `components/Download.tsx` until `/download` needed the same
 * answers without the page around them. It is one copy on purpose: the two
 * callers disagreeing about which file is the Windows installer is exactly the
 * kind of drift that does not fail, it just sends somebody the wrong binary.
 */

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

export type OS = "windows" | "macos" | "linux" | "ios" | "android";

export interface DownloadOption {
  label: string;
  description: string;
  url: string;
  size: number;
  fileName: string;
  /**
   * Whether this build carries the server you can host from inside the app.
   *
   * Every release ships each platform twice: the full build, and a slim one
   * without that server, which is 30 to 50MB smaller depending on the format.
   * Both are the same app otherwise. Without this flag the two land in the list
   * as duplicate rows with identical labels, which is what happened the first
   * release that published them.
   */
  withServer: boolean;
}

const LATEST =
  "https://api.github.com/repos/Gryt-chat/gryt/releases/latest";

/**
 * One request per page load, however many things ask for it.
 *
 * GitHub allows sixty unauthenticated calls an hour per address. The front page
 * asks twice — the navbar's download button and the download section — and
 * `/download` asks again, so without this a visitor who looks at two pages has
 * spent four of their sixty, and an office behind one address burns through
 * them in an afternoon. We hit the limit ourselves while building this, which
 * is how it was found: the section rendered "Could not load releases" on a
 * machine with a perfectly good internet connection.
 *
 * The promise is cached rather than the result, so callers that arrive while
 * the first request is still open wait on it instead of starting a second. A
 * failure is not cached: the next caller gets a fresh attempt, because the
 * usual reason for failure is a rate limit that expires.
 */
let inFlight: Promise<Release> | null = null;

export function fetchLatestRelease(signal?: AbortSignal): Promise<Release> {
  if (inFlight) return inFlight;

  // Deliberately not passing `signal` to the shared fetch. One caller
  // unmounting must not cancel the request every other caller is waiting on;
  // the abort is honoured below, per caller, instead.
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

export function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  return "linux";
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
 * The file to hand somebody who asked for "the download" and nothing more.
 *
 * Ordered rather than "whichever asset GitHub listed first", because the API
 * returns them in upload order and a release that happened to upload the
 * portable build first would silently change what /download hands out.
 *
 * The choice per platform is the one that installs: the NSIS installer on
 * Windows, the disk image on macOS, the AppImage on Linux, which runs without a
 * package manager and therefore without knowing the distribution.
 */
const PREFERRED: Record<OS, string[]> = {
  windows: ["Installer", "Portable"],
  macos: ["DMG", "ZIP"],
  linux: ["AppImage", "Debian / Ubuntu", "Snap"],
  ios: [],
  android: [],
};

export function primaryOption(
  options: DownloadOption[],
  os: OS,
): DownloadOption | null {
  for (const label of PREFERRED[os]) {
    const match = options.find((o) => o.label === label);
    if (match) return match;
  }
  return options[0] ?? null;
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

    const option = (label: string, description: string): DownloadOption => ({
      label,
      description,
      withServer,
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
        result.macos.push(option("DMG", "Standard macOS disk image"));
      } else if (name.endsWith(".zip")) {
        result.macos.push(option("ZIP", "Compressed app bundle"));
      }
    } else if (name.includes("-linux-")) {
      if (name.endsWith(".appimage")) {
        result.linux.push(option("AppImage", "Portable, works on most distros"));
      } else if (name.endsWith(".deb")) {
        result.linux.push(option("Debian / Ubuntu", ".deb package for apt-based distros"));
      } else if (name.endsWith(".snap")) {
        result.linux.push(option("Snap", "Snap package (also on snapcraft.io)"));
      }
    }
  }

  return result;
}
