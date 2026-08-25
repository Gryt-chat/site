import { useEffect, useMemo, useState } from "react";
import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa";

import { DownloadIcon, GlobeIcon, ServerRackIcon } from "./icons";
import styles from "./Download.module.css";
import {
  categorizeAssets,
  detectOS,
  fetchLatestRelease,
  formatSize,
  type DownloadOption,
  type OS,
  type Release,
} from "../lib/releases";
import { Button, Divider } from "@gryt/ui";

const OS_LABELS: Record<OS, { label: string; icon: typeof FaWindows; comingSoon?: boolean }> = {
  windows: { label: "Windows", icon: FaWindows },
  macos: { label: "macOS", icon: FaApple },
  linux: { label: "Linux", icon: FaLinux },
  ios: { label: "iOS", icon: FaApple, comingSoon: true },
  android: { label: "Android", icon: FaAndroid, comingSoon: true },
};

function OSTab({ os, active, onClick }: { os: OS; active: boolean; onClick: () => void }) {
  const { label, icon: Icon, comingSoon } = OS_LABELS[os];
  return (
    <Button
      aria-pressed={active}
      className={styles.osTab}
      onClick={onClick}
      tone={active ? "primary" : "ghost"}
    >
      <Icon size={16} />
      {label}
      {comingSoon && <span className={styles.comingSoon}>In dev</span>}
    </Button>
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
        {/* A Button rendered as a span, not a button. The whole card is the
            link — that is the bigger target and the one a keyboard reaches —
            so this is the affordance inside it, and a real button nested in an
            anchor is invalid markup as well as a second tab stop. What it is
            here for is the look: the six other actions on this page are Gryt
            UI Buttons, and this one used to be drawn by hand with its own
            corner. */}
        <Button className={styles.cardBtn} render={<span />} size="small" tabIndex={-1}>
          <DownloadIcon size={14} />
          Download
        </Button>
      </div>
    </a>
  );
}

export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS>(detectOS);

  useEffect(() => {
    fetchLatestRelease()
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
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <h2 className={styles.title}>Get it and go.</h2>
        <p className={styles.desc}>
          The desktop app gives you global push-to-talk and the rest of it. The
          browser gives you a call in about ten seconds.
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
              The {OS_LABELS[selectedOS].label} app is in development
            </p>
            <p className={styles.comingSoonDesc}>
              It is being built and made stable right now, so there is nothing to
              download yet. Until there is, Gryt runs in your mobile browser at{" "}
              <a href="https://app.gryt.chat" target="_blank" rel="noreferrer">
                app.gryt.chat
              </a>
            </p>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && error && (
          <div className={styles.fallback}>
            <p>Could not load releases.</p>
            <Button
              render={<a href="https://github.com/Gryt-chat/gryt/releases" target="_blank" rel="noreferrer" />}
              tone="neutral"
            >
              <DownloadIcon size={16} />
              View on GitHub
            </Button>
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
            <Button
              render={<a href="https://github.com/Gryt-chat/gryt/releases" target="_blank" rel="noreferrer" />}
              tone="neutral"
            >
              <DownloadIcon size={16} />
              View all releases on GitHub
            </Button>
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

        <Divider className={styles.divider} />

        <div className={styles.altActions}>
          <Button
            render={<a href="https://app.gryt.chat" target="_blank" rel="noreferrer" />}
            tone="primary"
          >
            <GlobeIcon size={16} />
            Try in Browser
          </Button>
          <Button
            render={<a href="https://docs.gryt.chat/docs/guide/quick-start" target="_blank" rel="noreferrer" />}
            tone="neutral"
          >
            <ServerRackIcon size={16} />
            Self-Host a Server
          </Button>
        </div>

        <p className={styles.note}>
          No download required. Works in Chrome, Firefox, Edge, and Safari.
          Some features like global push-to-talk are desktop-only.
        </p>
      </div>
    </section>
  );
}
