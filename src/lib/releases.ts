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
}

const LATEST =
  "https://api.github.com/repos/Gryt-chat/gryt/releases/latest";

export function fetchLatestRelease(signal?: AbortSignal): Promise<Release> {
  return fetch(LATEST, { signal }).then((res) => {
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    return res.json() as Promise<Release>;
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

    if (name.includes("-win-") || name.includes("-win32-")) {
      if (name.includes("portable")) {
        result.windows.push({
          label: "Portable",
          description: "Runs from anywhere, nothing to install",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      } else if (name.endsWith(".exe")) {
        result.windows.push({
          label: "Installer",
          description: "Standard Windows installer (NSIS)",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      }
    } else if (name.includes("-mac-")) {
      if (name.endsWith(".dmg")) {
        result.macos.push({
          label: "DMG",
          description: "Standard macOS disk image",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      } else if (name.endsWith(".zip")) {
        result.macos.push({
          label: "ZIP",
          description: "Compressed app bundle",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      }
    } else if (name.includes("-linux-")) {
      if (name.endsWith(".appimage")) {
        result.linux.push({
          label: "AppImage",
          description: "Portable, works on most distros",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      } else if (name.endsWith(".deb")) {
        result.linux.push({
          label: "Debian / Ubuntu",
          description: ".deb package for apt-based distros",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      } else if (name.endsWith(".snap")) {
        result.linux.push({
          label: "Snap",
          description: "Snap package (also on snapcraft.io)",
          url: asset.browser_download_url,
          size: asset.size,
          fileName: asset.name,
        });
      }
    }
  }

  return result;
}
