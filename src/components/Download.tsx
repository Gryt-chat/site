import { useEffect, useMemo, useState } from "react";
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { Alert, Button, Spinner } from "@gryt/ui";

import { DownloadIcon, GlobeIcon } from "./icons";
import { Snippet } from "./Snippet";
import { StoreBadge } from "./StoreBadge";
import styles from "./Download.module.css";
import { dayMonthYear } from "../lib/formatDate";
import {
  categorizeAssets,
  comingLater,
  fetchLatestRelease,
  FILE_ANCHOR,
  formatsFor,
  formatSize,
  isDesktop,
  liveCommands,
  liveStore,
  OS_NAMES,
  primaryOption,
  standInFor,
  updatesItself,
  type DesktopOS,
  type Format,
  type Release,
} from "../lib/releases";
import { useDetectedArch } from "../lib/useDetectedArch";
import { useDetectedOS } from "../lib/useDetectedOS";

const LATEST_URL = "https://github.com/Gryt-chat/gryt/releases/latest";
const WEB_APP_URL = "https://app.gryt.chat";

type Pick = DesktopOS | "web" | "phone";

const PICKS: { id: Pick; name: string; icon: typeof FaWindows }[] = [
  { id: "windows", name: "Windows", icon: FaWindows },
  { id: "macos", name: "macOS", icon: FaApple },
  { id: "linux", name: "Linux", icon: FaLinux },
  { id: "web", name: "Browser", icon: GlobeIcon },
  { id: "phone", name: "Phone", icon: MdPhoneIphone },
];

/* What the button calls the file when a store leads and the file is the second choice. */
const FILE_NAMES: Record<string, string> = {
  Installer: "the installer",
  AppImage: "the AppImage",
};

const listJoin = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/**
 * One answer for your platform: its store where one is open, the file beside it, and the
 * rest a row further down. Anything that isn't out yet gets its name on one line and no more.
 */
export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [chosen, setChosen] = useState<Pick | null>(null);

  /* Null until hydration is over, so the prerender and the first client render agree. */
  const detected = useDetectedOS();
  const arch = useDetectedArch();
  const phone = detected !== null && !isDesktop(detected);
  const pick: Pick = chosen ?? (phone ? "phone" : isDesktop(detected) ? detected : "windows");
  const os = pick === "web" || pick === "phone" ? null : pick;

  useEffect(() => {
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(
    () => (release ? categorizeAssets(release.assets) : null),
    [release],
  );

  const formats = os && grouped ? formatsFor(grouped[os], os) : [];
  const primaryPick = os && grouped ? primaryOption(grouped[os], os, arch) : null;
  const primary = formats.find((f) => f.label === primaryPick?.label) ?? null;
  const store = liveStore(os);
  const commands = liveCommands(os);
  /* Flathub isn't open, so the release's .flatpak sits under the Snap Store until it is. */
  const standInLabel = standInFor(os);
  const standInFormat = formats.find((f) => f.label === standInLabel) ?? null;
  const standIn = standInFormat?.slim ?? null;
  /* With no store open, a package manager is the second choice beside the file. */
  const second = store ? null : (commands[0] ?? null);
  const moreCommands = commands.filter((c) => c !== second);
  const moreFiles = formats.filter((f) => f !== primary && f.label !== standInLabel);
  const version = release?.tag_name.replace(/^v/, "");

  const fileBlock = os && (
    <div className={styles.choice} id={FILE_ANCHOR}>
      {store && <h3 className={styles.choiceTitle}>Or download the file</h3>}

      {error && (
        <div className={styles.fallback}>
          <Alert severity="warning">
            The list of releases isn&rsquo;t available right now.
          </Alert>
          <GitHubButton />
        </div>
      )}

      {!error && !release && (
        <p className={styles.loading}>
          <Spinner size={18} />
          Finding the latest release…
        </p>
      )}

      {!error && release && !primary?.slim && (
        <div className={styles.fallback}>
          <p>Nothing to download for {OS_NAMES[os]} yet.</p>
          <GitHubButton />
        </div>
      )}

      {!error && primary?.slim && (
        <>
          <Button
            className={store ? styles.secondButton : styles.leadButton}
            render={<a href={primary.slim.url} download />}
            size="large"
            tone={store ? "neutral" : undefined}
          >
            <DownloadIcon size={20} />
            {store
              ? `Download ${FILE_NAMES[primary.label] ?? primary.label}`
              : `Download for ${OS_NAMES[os]}`}
            <span className={styles.size}>{formatSize(primary.slim.size)}</span>
          </Button>
          <p className={styles.fileName}>{primary.slim.fileName}</p>
          {/* The chip on a Mac and the format on Linux need saying. A Windows installer doesn't. */}
          {os !== "windows" && <p className={styles.note}>{primary.description}</p>}
          {primary.full && (
            <p className={styles.server}>
              Want to host a server for friends from inside the app?{" "}
              <a href={primary.full.url} download>
                Get the build with the server in it
              </a>{" "}
              ({formatSize(primary.full.size)}).
              {store && <> The {store.name} version already has it.</>}
            </p>
          )}
        </>
      )}
    </div>
  );

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        {/* A phone has no file, so a link asking for one lands on the top of the section. */}
        <div className={styles.head} id={os ? undefined : FILE_ANCHOR}>
          <p className={styles.eyebrow}>Download</p>
          <h2 className={styles.title}>
            {os ? `Gryt for ${OS_NAMES[os]}` : pick === "web" ? "Gryt in your browser" : "Gryt on your phone"}
          </h2>
          {os && version && (
            <p className={styles.sub}>
              Version {version}
              {release?.published_at && <>, out {dayMonthYear(release.published_at)}</>}.
            </p>
          )}
          {pick === "web" && <p className={styles.sub}>Nothing to install. Open it and sign in.</p>}
          {pick === "phone" && (
            <p className={styles.sub}>
              The phone app is in testing, so it isn&rsquo;t in the App Store or on Google
              Play yet. Until it is, Gryt works in your phone&rsquo;s browser.
            </p>
          )}
        </div>

        {os ? (
          <div className={styles.lead}>
            {store ? (
              <div className={styles.choice}>
                <StoreBadge store={store} className={styles.leadBadge} />
                {store.why && <p className={styles.why}>{store.why}</p>}
                {standIn && (
                  <div className={styles.standIn}>
                    <p className={styles.note}>
                      Prefer Flatpak? Gryt isn&rsquo;t on Flathub yet, so for now
                      there&rsquo;s a{" "}
                      <a href={standIn.url} download>
                        Flatpak file
                      </a>{" "}
                      ({formatSize(standIn.size)}). It won&rsquo;t update itself.
                    </p>
                    <Snippet
                      label="Flatpak · Linux"
                      code={`flatpak install --user ~/Downloads/${standIn.fileName}`}
                      shell
                    />
                    {standInFormat?.full && (
                      <p className={styles.note}>
                        Want the server in it too?{" "}
                        <a href={standInFormat.full.url} download>
                          Get the full Flatpak
                        </a>{" "}
                        ({formatSize(standInFormat.full.size)}).
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              fileBlock
            )}

            {store
              ? fileBlock
              : second?.command && (
                  <div className={styles.choice}>
                    <h3 className={styles.choiceTitle}>Or use {second.name}</h3>
                    <Snippet label={second.label} code={second.command} shell />
                    <p className={styles.note}>
                      {second.name} gives you the build with the server in it.
                    </p>
                  </div>
                )}
          </div>
        ) : (
          <div className={styles.lead}>
            <Button render={<a href={WEB_APP_URL} />} size="large" className={styles.leadButton}>
              <GlobeIcon size={20} />
              Open app.gryt.chat
            </Button>
          </div>
        )}

        {os && (moreCommands.length > 0 || moreFiles.length > 0) && (
          <div className={styles.more}>
            <h3 className={styles.choiceTitle}>More ways on {OS_NAMES[os]}</h3>
            <div className={styles.moreGrid}>
              {moreFiles.length > 0 && <FileList formats={moreFiles} os={os} />}
              {moreCommands.length > 0 && (
                <div className={styles.commands}>
                  {moreCommands.map((c) => (
                    <Snippet key={c.label} label={c.label} code={c.command!} shell />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.foot}>
          <nav className={styles.picks} aria-label="Other platforms">
            <span className={styles.picksLabel}>
              {os ? `Not on ${OS_NAMES[os]}?` : "On a computer?"}
            </span>
            {PICKS.filter((p) => p.id !== pick).map(({ id, name, icon: Icon }) => (
              <button key={id} type="button" className={styles.pick} onClick={() => setChosen(id)}>
                <Icon size={16} aria-hidden="true" />
                {name}
              </button>
            ))}
          </nav>

          <p className={styles.soon}>Coming later: {listJoin(comingLater())}.</p>

          <p className={styles.github}>
            Can&rsquo;t find what you need? Every file is on the{" "}
            <a className={styles.githubLink} href={LATEST_URL} target="_blank" rel="noreferrer">
              <FaGithub size={17} aria-hidden="true" />
              GitHub release page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function FileList({ formats, os }: { formats: Format[]; os: DesktopOS }) {
  return (
    <ul className={styles.files}>
      {formats.map((f) =>
        f.slim ? (
          <li key={f.label}>
            <a className={styles.fileLink} href={f.slim.url} download>
              <DownloadIcon size={16} aria-hidden="true" />
              <span className={styles.fileLabel}>
                <span className="sr-only">{OS_NAMES[os]} </span>
                {f.label}
              </span>
              {!updatesItself(f) && <span className={styles.fileNote}>won&rsquo;t update itself</span>}
              <span className={styles.fileSize}>{formatSize(f.slim.size)}</span>
            </a>
          </li>
        ) : null,
      )}
    </ul>
  );
}

function GitHubButton() {
  return (
    <Button render={<a href={LATEST_URL} target="_blank" rel="noreferrer" />} tone="neutral">
      <FaGithub size={16} />
      View on GitHub
    </Button>
  );
}
