import { useEffect, useMemo, useState } from "react";
import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa";

import { DownloadIcon, ServerRackIcon } from "./icons";
import styles from "./Download.module.css";
import {
  categorizeAssets,
  detectOS,
  fetchLatestRelease,
  formatSize,
  type OS,
  type Release,
} from "../lib/releases";
import { Alert, Button, Chip, Divider, Spinner, Switch, Tabs } from "@gryt/ui";

const OS_LABELS: Record<OS, { label: string; icon: typeof FaWindows; comingSoon?: boolean }> = {
  windows: { label: "Windows", icon: FaWindows },
  macos: { label: "macOS", icon: FaApple },
  linux: { label: "Linux", icon: FaLinux },
  ios: { label: "iOS", icon: FaApple, comingSoon: true },
  android: { label: "Android", icon: FaAndroid, comingSoon: true },
};

/**
 * The platform picker is Gryt UI's `Tabs`, indicator and all.
 *
 * It was a row of hand-rolled buttons toggling `aria-pressed`, which is the
 * wrong control twice over: a set of buttons where one is "on" is a tab list
 * wearing a disguise, and it meant no arrow-key navigation and none of the
 * sliding indicator the library already draws.
 */
const OS_ORDER = ["windows", "macos", "linux", "ios", "android"] as const;

function OSTabs({
  value,
  onChange,
}: {
  value: OS;
  onChange: (os: OS) => void;
}) {
  return (
    <Tabs
      className={styles.osTabs}
      value={value}
      onValueChange={(next) => onChange(next as OS)}
    >
      <Tabs.List aria-label="Platform">
        {OS_ORDER.map((os) => {
          const { label, icon: Icon, comingSoon } = OS_LABELS[os];
          return (
            <Tabs.Tab className={styles.osTab} key={os} value={os}>
              <Icon size={16} />
              {label}
              {comingSoon && <Chip label="In dev" tone="neutral" />}
            </Tabs.Tab>
          );
        })}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs>
  );
}


export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS>(detectOS);

  /*
   * Off by default, so the smaller build is what somebody gets without reading
   * anything. Most people join servers rather than run one, and the server is
   * 30 to 50MB depending on the format — the whole reason both builds exist.
   *
   * Nobody is stuck either way: this is a checkbox on the page, not a decision
   * about the install, and the other build is one tick and one download away.
   */
  const [withServer, setWithServer] = useState(false);

  /* Which package format, within the platform. Windows has an installer and a
     portable; macOS a disk image and a zip; Linux three. Before this the page
     drew a button per format per build, so Windows was four stacked Download
     buttons and Linux six. */
  const [format, setFormat] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(
    () => (release ? categorizeAssets(release.assets) : null),
    [release],
  );

  const all = grouped?.[selectedOS] ?? [];

  /*
   * Falls back to whatever the platform has when the chosen build is not on the
   * release. A release built before the slim ones existed only has full
   * artifacts, and a platform whose slim leg failed only has full ones — in
   * both cases an empty list would read as "no download for your OS".
   */
  const matching = all.filter((opt) => opt.withServer === withServer);
  const options = matching.length > 0 ? matching : all;
  const hasBothBuilds = all.some((o) => o.withServer) && all.some((o) => !o.withServer);

  /* Ordered here rather than taken from the release, whose assets arrive
     alphabetically — which puts the portable build first on Windows and makes
     it the default. It should not be: a portable build cannot update itself,
     because there is no install for electron-updater to replace. */
  const FORMAT_ORDER = [
    "Installer",
    "Portable",
    "DMG",
    "ZIP",
    "AppImage",
    "Debian / Ubuntu",
    "Snap",
  ];

  const formats = [...new Set(options.map((o) => o.label))].sort(
    (a, b) => FORMAT_ORDER.indexOf(a) - FORMAT_ORDER.indexOf(b),
  );

  const ordered = formats
    .map((name) => options.find((o) => o.label === name))
    .filter((o): o is (typeof options)[number] => Boolean(o));

  const chosen =
    ordered.find((o) => o.label === format) ?? ordered[0] ?? null;
  const version = release?.tag_name?.replace(/^v/, "");

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <h2 className={styles.title}>Download Gryt.</h2>
        <OSTabs value={selectedOS} onChange={setSelectedOS} />

        {!OS_LABELS[selectedOS].comingSoon && hasBothBuilds && (
          <div className={styles.serverToggle}>
            <Switch
              checked={withServer}
              onCheckedChange={(next) => setWithServer(next === true)}
            />
            {/* Clickable, because the label became a span when the tooltip
                arrived and a span is not a label. Not a real <label> wrapping
                the row: the "?" sits in that row too, and hovering it to read
                the explanation should not flip the switch. */}
            <span
              className={styles.serverToggleLabel}
              onClick={() => setWithServer((on) => !on)}
            >
              Include built in server?
            </span>
            {/* A card rather than @gryt/ui's Tooltip. That one draws a single
                narrow line, which on a large screen is small type running the
                width of the viewport — the two things that make a sentence hard
                to read. This one has a width, so it wraps. */}
            <span className={styles.serverToggleHintWrap}>
              <span
                className={styles.serverToggleHint}
                tabIndex={0}
                role="button"
                aria-label="What the built in server is"
              >
                ?
              </span>
              <span className={styles.serverToggleCard} role="note">
                Lets you host a server from inside the app, so friends can join
                yours. Adds about 35&nbsp;MB.
                <br />
                <br />
                You can still join other people&rsquo;s servers without it.
              </span>
            </span>
          </div>
        )}

        {OS_LABELS[selectedOS].comingSoon && (
          <div className={styles.comingSoonPanel}>
            <p className={styles.comingSoonTitle}>
              The {OS_LABELS[selectedOS].label} app isn&rsquo;t ready yet
            </p>
            <p className={styles.comingSoonDesc}>
              It&rsquo;s being built right now, so there&rsquo;s nothing to
              download. Until there is, Gryt runs in your phone&rsquo;s browser
              at{" "}
              <a href="https://app.gryt.chat" target="_blank" rel="noreferrer">
                app.gryt.chat
              </a>
            </p>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && error && (
          <div className={styles.fallback}>
            <Alert severity="warning">
              Couldn&rsquo;t reach GitHub for the list of releases.
            </Alert>
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
          <div className={styles.loading}>
            <Spinner size={18} />
            Finding the latest release…
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && !error && release && chosen && (
          <div className={styles.picker}>
            {formats.length > 1 && (
              <Tabs
                className={styles.formatTabs}
                value={chosen.label}
                onValueChange={(next) => setFormat(String(next))}
              >
                <Tabs.List aria-label="Package format">
                  {formats.map((name) => (
                    <Tabs.Tab className={styles.formatTab} key={name} value={name}>
                      {name}
                    </Tabs.Tab>
                  ))}
                  <Tabs.Indicator />
                </Tabs.List>
              </Tabs>
            )}

            <p className={styles.formatDesc}>{chosen.description}</p>

            <Button
              className={styles.downloadBtn}
              render={<a href={chosen.url} download />}
              size="large"
            >
              <DownloadIcon size={18} />
              Download
              <span className={styles.downloadBtnSize}>
                {formatSize(chosen.size)}
              </span>
            </Button>
          </div>
        )}

        {!OS_LABELS[selectedOS].comingSoon && !error && release && options.length === 0 && (
          <div className={styles.fallback}>
            <p>Nothing to download for {OS_LABELS[selectedOS].label} yet.</p>
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

        {/* One secondary action, and it is a different intent from the
            buttons above: somebody who came to download may also want to run a
            server. "Try in Browser" used to sit beside it and is the same
            action as "Open in browser" in the navbar, three lines up the page. */}
        <div className={styles.altActions}>
          <Button
            render={<a href="https://docs.gryt.chat/docs/guide/quick-start" target="_blank" rel="noreferrer" />}
            tone="neutral"
          >
            <ServerRackIcon size={16} />
            Self-Host a Server
          </Button>
        </div>
      </div>
    </section>
  );
}
