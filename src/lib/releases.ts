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
  assets: ReleaseAsset[];
}

export type OS = "windows" | "macos" | "linux" | "ios" | "android";

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
  /**
   * A place to send people rather than a file to hand them. The Microsoft Store is the only
   * one: the button is a plain link, not a `download`, and there is no size to show.
   */
  external?: boolean;
}

/**
 * The Microsoft Store listing, which is Windows' recommended download: signed, and updated
 * through the Store. A plain https link — `ms-windows-store://` dies quietly elsewhere.
 */
export const MS_STORE_URL = "https://apps.microsoft.com/detail/9pkpt1c2m95q";

export function storeOption(): DownloadOption {
  return {
    label: "Microsoft Store",
    description: "Signed by Microsoft, installs and updates through the Store.",
    url: MS_STORE_URL,
    size: 0,
    fileName: "",
    withServer: true,
    arch: null,
    external: true,
  };
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

export function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  return "linux";
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
  linux: ["AppImage", "Debian / Ubuntu", "Fedora / RHEL", "Snap"],
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
        result.linux.push(option("AppImage", "Portable, works on most distros. It's the app itself, so put it somewhere it can stay. Updates replace this file in place."));
      } else if (name.endsWith(".deb")) {
        result.linux.push(option("Debian / Ubuntu", ".deb package for Debian, Ubuntu and other apt-based distros."));
      } else if (name.endsWith(".rpm")) {
        result.linux.push(option("Fedora / RHEL", ".rpm package for Fedora, RHEL, openSUSE and other dnf-based distros."));
      } else if (name.endsWith(".snap")) {
        /* No pointer to snapcraft.io yet. The Store served 1.5.10 while releases went to
           1.9.x, because nothing put the revisions on a channel. Fixed in GRYT-971. */
        result.linux.push(option("Snap", "Snap package, for any distro running snapd."));
      }
    }
  }

  return result;
}
