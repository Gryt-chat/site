import { useEffect, useMemo, useState } from "react";
import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa";

import { DownloadIcon, GlobeIcon, ServerRackIcon } from "./icons";
import styles from "./Download.module.css";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

type OS = "windows" | "macos" | "linux" | "ios" | "android";

interface DownloadOption {
  label: string;
  description: string;
  url: string;
  size: number;
  fileName: string;
}

const OS_LABELS: Record<OS, { label: string; icon: typeof FaWindows; comingSoon?: boolean }> = {
  windows: { label: "Windows", icon: FaWindows },
  macos: { label: "macOS", icon: FaApple },
  linux: { label: "Linux", icon: FaLinux },
  ios: { label: "iOS", icon: FaApple, comingSoon: true },
  android: { label: "Android", icon: FaAndroid, comingSoon: true },
};

function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  return "linux";
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function categorizeAssets(assets: ReleaseAsset[]): Record<OS, DownloadOption[]> {
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
          description: "No installation needed — run from anywhere",
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
          description: "Portable — works on most distros",
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

function OSTab({ os, active, onClick }: { os: OS; active: boolean; onClick: () => void }) {
  const { label, icon: Icon, comingSoon } = OS_LABELS[os];
  return (
    <button
      className={`${styles.osTab} ${active ? styles.osTabActive : ""}`}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} />
      {label}
      {comingSoon && <span className={styles.comingSoon}>Soon</span>}
    </button>
  );
}

function DownloadCard({ option }: { option: DownloadOption }) {
  return (
    <a href={option.url} className={styles.downloadCard} download>
      <div className={styles.cardInfo}>
        <span className={styles.cardLabel}>{option.label}</span>
        <span className={styles.cardDesc}>{option.description}</span>
      </div>
      <div className={styles.cardAction}>
        <span className={styles.cardSize}>{formatSize(option.size)}</span>
        <span className={styles.cardBtn}>
          <DownloadIcon size={14} />
          Download
        </span>
      </div>
    </a>
  );
}

export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS>(detectOS);

  useEffect(() => {
    fetch("https://api.github.com/repos/Gryt-chat/gryt/releases/latest")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<Release>;
      })
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(
    () => (release ? categorizeAssets(release.assets) : null),
    [release],
  );

  const options = grouped?.[selectedOS] ?? [];
  const version = release?.tag_name?.replace(/^v/, "");

  return (
    <section className="section border-top" id="download">
      <div className={styles.box}>
        <div className={styles.glow} />
        <div className="section-label">Get Started</div>
        <h2 className="section-title">Download Gryt</h2>
        <p className={`section-desc ${styles.desc}`}>
          Grab the desktop client for the full experience, or try Gryt right in
          your browser — no account required.
        </p>

        <div className={styles.osTabs}>
          {(["windows", "macos", "linux", "ios", "android"] as const).map((os) => (
            <OSTab
              key={os}
              os={os}
              active={selectedOS === os}
              onClick={() => setSelectedOS(os)}
            />
          ))}
        </div>

        {OS_LABELS[selectedOS].comingSoon && (
          <div className={styles.comingSoonPanel}>
            <p className={styles.comingSoonTitle}>
              {OS_LABELS[selectedOS].label} app is coming soon
            </p>
            <p className={styles.comingSoonDesc}>
              We're working on native mobile apps. In the meantime, you can use
              Gryt in your mobile browser at{" "}
              <a href="https://app.gryt.chat" target="_blank" rel="noreferrer">
                app.gryt.chat
              </a>
            </p>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && error && (
          <div className={styles.fallback}>
            <p>Could not load releases.</p>
            <a
              href="https://github.com/Gryt-chat/gryt/releases"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              <DownloadIcon size={16} />
              View on GitHub
            </a>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && !error && !release && (
          <div className={styles.loading}>Loading releases…</div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && !error && release && options.length > 0 && (
          <div className={styles.downloadList}>
            {options.map((opt) => (
              <DownloadCard key={opt.fileName} option={opt} />
            ))}
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && !error && release && options.length === 0 && (
          <div className={styles.fallback}>
            <p>No downloads available for {OS_LABELS[selectedOS].label} yet.</p>
            <a
              href="https://github.com/Gryt-chat/gryt/releases"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              <DownloadIcon size={16} />
              View all releases on GitHub
            </a>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && version && (
          <p className={styles.versionNote}>
            Latest: v{version} ·{" "}
            <a
              href="https://github.com/Gryt-chat/gryt/releases"
              target="_blank"
              rel="noreferrer"
            >
              All releases
            </a>
          </p>
        )}

        <div className={styles.divider} />

        <div className={styles.altActions}>
          <a
            href="https://app.gryt.chat"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <GlobeIcon size={16} />
            Try in Browser
          </a>
          <a
            href="https://docs.gryt.chat/docs/guide/quick-start"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <ServerRackIcon size={16} />
            Self-Host a Server
          </a>
        </div>

        <p className={styles.note}>
          No download required — works in Chrome, Firefox, Edge, and Safari.
          Some features like global push-to-talk are desktop-only.
        </p>
      </div>
    </section>
  );
}
