import { useEffect, useId, useMemo, useState } from "react";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { Alert, Button, Spinner, Switch } from "@gryt/ui";

import { DownloadIcon, GlobeIcon } from "./icons";
import { Snippet } from "./Snippet";
import { StoreBadge } from "./StoreBadge";
import styles from "./Download.module.css";
import { dayMonthYear } from "../lib/formatDate";
import {
  ARCH_NAMES,
  categorizeAssets,
  fetchLatestRelease,
  filesFor,
  formatSize,
  isDesktop,
  OS_NAMES,
  PACKAGE_MANAGERS,
  packageManagersFor,
  primaryOption,
  STORES,
  storesFor,
  type DesktopOS,
  type Release,
} from "../lib/releases";
import { useDetectedArch } from "../lib/useDetectedArch";
import { useDetectedOS } from "../lib/useDetectedOS";

const RELEASES_URL = "https://github.com/Gryt-chat/gryt/releases";
const WEB_APP_URL = "https://app.gryt.chat";

const FILE_GROUPS: { os: DesktopOS; icon: typeof FaWindows }[] = [
  { os: "windows", icon: FaWindows },
  { os: "macos", icon: FaApple },
  { os: "linux", icon: FaLinux },
];

export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [withServer, setWithServer] = useState(false);
  const switchLabelId = useId();
  const switchHelpId = useId();

  /* Null until hydration is over, so the prerender and the first client render agree. */
  const detected = useDetectedOS();
  const arch = useDetectedArch();
  const os = detected ?? "windows";
  const phone = detected !== null && !isDesktop(detected);
  const fileOS: DesktopOS = isDesktop(os) ? os : "windows";

  useEffect(() => {
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(
    () => (release ? categorizeAssets(release.assets) : null),
    [release],
  );

  const ownStore = STORES.some((s) => s.os === os && s.url);
  /* A phone whose store isn't open yet gets that badge, faded, and the browser instead. */
  const phoneStore = phone && !ownStore ? STORES.find((s) => s.os === os) : undefined;
  /* The row leaves out the badge that's already above it on a phone. */
  const stores = storesFor(os).filter((s) => s !== phoneStore);
  const packageManagers = packageManagersFor(os);
  /* A Mac has no store open yet, so Homebrew leads there. */
  const terminalFirst = !ownStore && PACKAGE_MANAGERS.some((p) => p.os === os && p.command);

  const options = grouped?.[fileOS] ?? [];
  const primary = primaryOption(options, fileOS, arch);
  const pair = primary ? options.filter((o) => o.label === primary.label) : [];
  const full = pair.find((o) => o.withServer);
  const slim = pair.find((o) => !o.withServer);
  const chosen = (withServer ? full : slim) ?? primary;
  const version = release?.tag_name.replace(/^v/, "");

  const storeColumn = (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>From a store</h3>
      <ul className={styles.badges}>
        {stores.map((store) => (
          <li className={styles.badgeItem} key={store.badge.src}>
            <StoreBadge store={store} className={styles.badge} />
            <span className={styles.badgeCaption}>
              {OS_NAMES[store.os]}
              {!store.url && <> · Coming very soon</>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const terminalColumn = (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>From a terminal</h3>
      <div className={styles.commands}>
        {packageManagers.map(({ label, command }) =>
          command ? (
            <Snippet key={label} label={label} code={command} shell />
          ) : (
            <div className={styles.pending} key={label}>
              <p className={styles.pendingCard}>{label}</p>
              <p className={styles.badgeCaption}>Coming very soon</p>
            </div>
          ),
        )}
      </div>
    </div>
  );

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>Download</p>
          <h2 className={styles.title}>
            Install it the way you install everything else.
          </h2>
          <p className={styles.sub}>
            A store or a package manager keeps Gryt updated along with your
            other apps.
            {!phone && <> If you&rsquo;d rather have the file, it&rsquo;s at the bottom.</>}
          </p>
        </div>

        {phoneStore && (
          <div className={styles.phone}>
            <StoreBadge store={phoneStore} className={styles.phoneBadge} />
            <p className={styles.phoneSoon}>Coming very soon</p>
            <p className={styles.phoneNote}>Until then, Gryt works in your browser.</p>
            <Button render={<a href={WEB_APP_URL} />} size="large">
              <GlobeIcon size={18} />
              Open app.gryt.chat
            </Button>
          </div>
        )}

        <div
          className={styles.channels}
          data-lead={terminalFirst ? "terminal" : "store"}
        >
          {terminalFirst ? terminalColumn : storeColumn}
          {terminalFirst ? storeColumn : terminalColumn}
        </div>

        {!phone && (
          <div className={styles.file}>
            <h3 className={styles.columnTitle}>Or download the file</h3>

            {error && (
              <div className={styles.fallback}>
                <Alert severity="warning">
                  Couldn&rsquo;t reach GitHub for the list of releases.
                </Alert>
                <Button
                  render={<a href={RELEASES_URL} target="_blank" rel="noreferrer" />}
                  tone="neutral"
                >
                  <DownloadIcon size={16} />
                  View on GitHub
                </Button>
              </div>
            )}

            {!error && !release && (
              <div className={styles.loading}>
                <Spinner size={18} />
                Finding the latest release…
              </div>
            )}

            {!error && release && !chosen && (
              <div className={styles.fallback}>
                <p>Nothing to download for {OS_NAMES[fileOS]} yet.</p>
                <Button
                  render={<a href={RELEASES_URL} target="_blank" rel="noreferrer" />}
                  tone="neutral"
                >
                  <DownloadIcon size={16} />
                  View all releases on GitHub
                </Button>
              </div>
            )}

            {!error && release && chosen && grouped && (
              <>
                <div className={styles.fileRow}>
                  <div className={styles.fileMain}>
                    <Button
                      className={styles.fileButton}
                      render={<a href={chosen.url} download />}
                      size="large"
                      tone="neutral"
                    >
                      <DownloadIcon size={18} />
                      Download for {OS_NAMES[fileOS]}
                      <span className={styles.size}>{formatSize(chosen.size)}</span>
                    </Button>
                    <p className={styles.fileName}>{chosen.fileName}</p>
                    {/* The chip on a Mac and the format on Linux need saying. A Windows installer doesn't. */}
                    {fileOS !== "windows" && (
                      <p className={styles.fileNote}>{chosen.description}</p>
                    )}
                  </div>

                  {full && slim && (
                    <div className={styles.server}>
                      <label className={styles.switchRow} id={switchLabelId}>
                        <Switch
                          checked={withServer}
                          onCheckedChange={(next) => setWithServer(next === true)}
                          aria-labelledby={switchLabelId}
                          aria-describedby={switchHelpId}
                        />
                        Include the built-in server
                      </label>
                      <p className={styles.switchHelp} id={switchHelpId}>
                        It lets you host a server from inside the app, so
                        friends can join yours. You don&rsquo;t need it to join
                        someone else&rsquo;s. It adds{" "}
                        {formatSize(full.size - slim.size)}. Stores and package
                        managers always include it.
                      </p>
                    </div>
                  )}
                </div>

                <details className={styles.all}>
                  <summary className={styles.allSummary}>
                    <MdExpandMore className={styles.chevron} size={20} aria-hidden="true" />
                    All files in v{version}
                  </summary>
                  <div className={styles.groups}>
                    {FILE_GROUPS.map(({ os: groupOS, icon: Icon }) => (
                      <div className={styles.group} key={groupOS}>
                        <h4 className={styles.groupName}>
                          <Icon size={15} aria-hidden="true" />
                          {OS_NAMES[groupOS]}
                        </h4>
                        <ul className={styles.fileList}>
                          {filesFor(grouped[groupOS], groupOS, withServer).map((file) => (
                            <li key={file.fileName}>
                              <a className={styles.fileLink} href={file.url} download>
                                <DownloadIcon size={16} aria-hidden="true" />
                                <span className={styles.fileLinkName}>
                                  <span className="sr-only">{OS_NAMES[groupOS]} </span>
                                  {groupOS === "macos" && file.arch
                                    ? ARCH_NAMES[file.arch]
                                    : file.label}
                                </span>
                                <span className={styles.fileLinkSize}>
                                  {formatSize(file.size)}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              </>
            )}

            <p className={styles.browser}>
              Or skip installing and <a href={WEB_APP_URL}>open app.gryt.chat</a>{" "}
              in a browser.
            </p>

            {version && (
              <p className={styles.meta}>
                v{version}
                {release?.published_at && <> · released {dayMonthYear(release.published_at)}</>}
                {" · "}
                <a href={RELEASES_URL} target="_blank" rel="noreferrer">
                  All releases on GitHub
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
