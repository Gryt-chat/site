import { useEffect, useMemo, useState } from "react";
import { FaAndroid, FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { Alert, Button, Spinner } from "@gryt/ui";

import { CaretIcon, CheckIcon, DownloadIcon, FileIcon, GlobeIcon, TerminalIcon } from "./icons";
import { Snippet } from "./Snippet";
import { StoreBadge } from "./StoreBadge";
import styles from "./Download.module.css";
import { dayMonthYear } from "../lib/formatDate";
import {
  categorizeAssets,
  fetchLatestRelease,
  FILE_ANCHOR,
  formatsFor,
  formatSize,
  isDesktop,
  liveCommands,
  liveStore,
  updatesItself,
  OS_NAMES,
  primaryOption,
  type DesktopOS,
  type Release,
} from "../lib/releases";
import { useDetectedArch } from "../lib/useDetectedArch";
import { useDetectedOS } from "../lib/useDetectedOS";

const LATEST_URL = "https://github.com/Gryt-chat/gryt/releases/latest";
const WEB_APP_URL = "https://app.gryt.chat";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/6sckEEFx";
const PLAY_GROUP_URL = "https://groups.google.com/g/gryt-testers";
const PLAY_OPT_IN_URL = "https://play.google.com/apps/testing/chat.gryt.mobile";
const PLAY_URL = "https://play.google.com/store/apps/details?id=chat.gryt.mobile";

type Pick = DesktopOS | "ios" | "android" | "web";

const PICKS: { id: Pick; name: string; icon: typeof FaWindows }[] = [
  { id: "windows", name: "Windows", icon: FaWindows },
  { id: "macos", name: "macOS", icon: FaApple },
  { id: "linux", name: "Linux", icon: FaLinux },
  { id: "ios", name: "iPhone", icon: FaApple },
  { id: "android", name: "Android", icon: FaAndroid },
  { id: "web", name: "Browser", icon: GlobeIcon },
];

const ANDROID_STEPS = [
  { title: "Join the testers group", action: "Join", url: PLAY_GROUP_URL },
  { title: "Opt in", action: "Opt in", url: PLAY_OPT_IN_URL },
  { title: "Install from Play", action: "Install", url: PLAY_URL },
];

/** Pick your system, press the one button. Your system is picked already. */
export function Download() {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [chosen, setChosen] = useState<Pick | null>(null);

  /* Null until hydration is over, so the prerender and the first client render agree. */
  const detected = useDetectedOS();
  const arch = useDetectedArch();
  const pick: Pick = chosen ?? detected ?? "windows";
  const os = pick !== "web" && isDesktop(pick) ? pick : null;

  /* The steps only render on a phone's pick, so the link has to open that pick. */
  useEffect(() => {
    if (window.location.hash !== "#phone-test") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the prerender has no hash, so it can't be initial state
    setChosen((current) => current ?? (detected === "ios" ? "ios" : "android"));
  }, [detected]);

  useEffect(() => {
    fetchLatestRelease()
      .then(setRelease)
      .catch(() => setError(true));
  }, []);

  const grouped = useMemo(() => (release ? categorizeAssets(release.assets) : null), [release]);
  const formats = os && grouped ? formatsFor(grouped[os], os) : [];
  const primaryPick = os && grouped ? primaryOption(grouped[os], os, arch) : null;
  const primary = formats.find((f) => f.label === primaryPick?.label) ?? null;
  const files = [
    ...(primary?.full ? [{ name: `${primary.label} with built-in server`, updates: true, ...primary.full }] : []),
    ...formats
      .filter((f) => f !== primary && f.slim)
      .map((f) => ({ name: f.label, updates: updatesItself(f), ...f.slim! })),
  ];
  const store = liveStore(os);
  const commands = liveCommands(os);
  const version = release?.tag_name.replace(/^v/, "");

  return (
    <section className={styles.section} id="download">
      <div className={styles.box} id="phone-test">
        <p className={styles.eyebrow}>Download</p>
        <h2 className={styles.title}>Get Gryt</h2>

        <div className={styles.picks} role="group" aria-label="Your system">
          {PICKS.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={styles.pick}
              aria-pressed={id === pick}
              onClick={() => setChosen(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {name}
            </button>
          ))}
        </div>

        <div className={styles.answer} id={FILE_ANCHOR}>
          {os && error && (
            <>
              <Alert severity="warning">The list of releases isn&rsquo;t available right now.</Alert>
              <GitHubLink />
            </>
          )}

          {os && !error && !release && (
            <p className={styles.loading}>
              <Spinner size={18} />
              Finding the latest release…
            </p>
          )}

          {os && release && !primary?.slim && (
            <>
              <p className={styles.facts}>Nothing to download for {OS_NAMES[os]} yet.</p>
              <GitHubLink />
            </>
          )}

          {os && primary?.slim && (
            <>
              <div className={styles.lead}>
                {store ? (
                  <>
                    <StoreBadge store={store} className={styles.storeBadge} />
                    {store.perks && (
                      <ul className={styles.perks}>
                        {store.perks.map((p) => (
                          <li key={p}>
                            <CheckIcon size={14} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className={styles.fallback}>
                      or{" "}
                      <a href={primary.slim.url} download>
                        download the {primary.label === "Installer" ? "installer" : primary.label}
                      </a>{" "}
                      ({formatSize(primary.slim.size)})
                    </p>
                  </>
                ) : (
                  <>
                    <Button className={styles.leadButton} render={<a href={primary.slim.url} download />} size="large">
                      <DownloadIcon size={22} />
                      Download for {OS_NAMES[os]}
                    </Button>
                    {/* The chip is the one thing a Mac download can get wrong, so it's said outright. */}
                    <p className={styles.fallback}>
                      {os === "macos" ? `${primary.description} · ` : ""}
                      {formatSize(primary.slim.size)}
                    </p>
                  </>
                )}
              </div>

              <div className={styles.folds}>
                {files.length > 0 && (
                  <details className={styles.fold}>
                    <summary>
                      <FileIcon size={18} />
                      <span className={styles.foldTitle}>Other files</span>
                      <span className={styles.foldHint}>
                        {files.length} {files.length === 1 ? "file" : "files"}
                      </span>
                      <CaretIcon size={16} />
                    </summary>
                    {files.map((f) => (
                      <a key={f.name} className={styles.fileRow} href={f.url} download>
                        <span className={styles.fileName}>{f.name}</span>
                        {!f.updates && <span className={styles.foldHint}>Doesn&rsquo;t update itself</span>}
                        <span className={styles.foldHint}>{formatSize(f.size)}</span>
                        <DownloadIcon size={18} />
                      </a>
                    ))}
                  </details>
                )}
                {commands.length > 0 && (
                  <details className={styles.fold}>
                    <summary>
                      <TerminalIcon size={18} />
                      <span className={styles.foldTitle}>Install from the terminal</span>
                      <span className={styles.foldHint}>{commands.map((c) => c.name).join(" · ")}</span>
                      <CaretIcon size={16} />
                    </summary>
                    <div className={styles.commands}>
                      {commands.map((c) => (
                        <Snippet key={c.label} label={c.label} code={c.command!} shell />
                      ))}
                    </div>
                  </details>
                )}
              </div>

              <p className={styles.facts}>
                {[version && `v${version}`, release?.published_at && dayMonthYear(release.published_at)]
                  .filter(Boolean)
                  .join(" · ")}{" "}
                ·{" "}
                <a href={LATEST_URL} target="_blank" rel="noreferrer">
                  All files on GitHub
                </a>
              </p>
            </>
          )}

          {pick === "ios" && (
            <>
              <div className={styles.buttons}>
                <Button className={styles.leadButton} render={<a href={TESTFLIGHT_URL} />} size="large">
                  <FaApple size={20} aria-hidden="true" />
                  Join the test in TestFlight
                </Button>
              </div>
              <p className={styles.facts}>
                In testing. It asks you to install TestFlight first if you don&rsquo;t have it.
              </p>
            </>
          )}

          {pick === "android" && (
            <>
              <p className={styles.stepsTitle}>Android test, three steps</p>
              <ol className={styles.steps}>
                {ANDROID_STEPS.map((step, i) => (
                  <li key={step.title} className={styles.step}>
                    <span className={styles.stepNumber} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <Button
                      className={i === 0 ? styles.stepButton : `${styles.stepButton} ${styles.stepButtonQuiet}`}
                      render={<a href={step.url} />}
                      size="small"
                      tone={i === 0 ? undefined : "neutral"}
                    >
                      {step.action}
                    </Button>
                  </li>
                ))}
              </ol>
              <p className={styles.facts}>
                Use the Google account on your phone. Gryt won&rsquo;t show up in a Play search, and the
                install link can take a few minutes after you opt in. Or{" "}
                <a href={WEB_APP_URL}>open it in the browser</a>.
              </p>
            </>
          )}

          {pick === "web" && (
            <>
              <div className={styles.buttons}>
                <Button className={styles.leadButton} render={<a href={WEB_APP_URL} />} size="large">
                  <GlobeIcon size={20} />
                  Open app.gryt.chat
                </Button>
              </div>
              <p className={styles.facts}>Nothing to install. Open it and sign in.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function GitHubLink() {
  return (
    <a className={styles.github} href={LATEST_URL} target="_blank" rel="noreferrer">
      <FaGithub size={16} aria-hidden="true" />
      All files on GitHub
    </a>
  );
}
