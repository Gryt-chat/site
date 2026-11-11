import { useEffect, useMemo, useState } from "react";
import { FaAndroid, FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { Alert, Button, Spinner } from "@gryt/ui";

import { CheckIcon, DownloadIcon, GlobeIcon } from "./icons";
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
  OS_NAMES,
  primaryOption,
  type DesktopOS,
  type Release,
} from "../lib/releases";
import { useDetectedArch } from "../lib/useDetectedArch";
import { useDetectedOS } from "../lib/useDetectedOS";

const LATEST_URL = "https://github.com/Gryt-chat/gryt/releases/latest";
const RELEASES_URL = "https://github.com/Gryt-chat/gryt/releases";
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

const INSTALLING: Record<DesktopOS, string> = {
  macos: "Open the disk image and drag Gryt into Applications. It updates itself after that.",
  windows:
    "Run the installer. It updates itself after that. The portable build runs from any folder, but it doesn’t update itself.",
  linux:
    "The AppImage is the app itself: make it executable and run it. The packages install like anything else on your system. All of them update themselves apart from the Flatpak.",
};

const ANDROID_STEPS = [
  { title: "Join the testers group", action: "Join", url: PLAY_GROUP_URL },
  { title: "Opt in", action: "Opt in", url: PLAY_OPT_IN_URL },
  { title: "Install from Play", action: "Install", url: PLAY_URL },
];

/** One system per page, the way Godot does it: two builds up top, every file below, other systems last. */
export function Download({ initial = null }: { initial?: Pick | null } = {}) {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState(false);
  const [chosen, setChosen] = useState<Pick | null>(initial);

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
  const store = liveStore(os);
  const commands = liveCommands(os);
  const version = release?.tag_name.replace(/^v/, "");

  return (
    <section className={styles.section} id="download">
      <div className={styles.box} id="phone-test">
        <p className={styles.eyebrow}>Download</p>
        <h1 className={styles.title}>
          {pick === "web" ? "Gryt in the browser" : `Gryt for ${PICKS.find((p) => p.id === pick)!.name}`}
        </h1>

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
              <p className={styles.facts}>
                {[version && `Version ${version}`, release?.published_at && `out ${dayMonthYear(release.published_at)}`]
                  .filter(Boolean)
                  .join(", ")}
                .{os === "macos" && ` ${primary.description}. On the other chip? Its files are in the list below.`}
              </p>

              <div className={styles.cards}>
                <div className={`${styles.card} ${styles.cardLead}`}>
                  <p className={styles.cardTitle}>
                    Gryt<span className={styles.cardVersion}>{version}</span>
                  </p>
                  <p className={styles.cardText}>For joining servers. {formatSize(primary.slim.size)}</p>
                  <Button render={<a href={primary.slim.url} download />}>
                    <DownloadIcon size={18} />
                    Download
                  </Button>
                </div>
                {primary.full && (
                  <div className={styles.card}>
                    <p className={styles.cardTitle}>
                      Gryt with a server<span className={styles.cardVersion}>{version}</span>
                    </p>
                    <p className={styles.cardText}>
                      Host a server right from the app. {formatSize(primary.full.size)}
                    </p>
                    <Button render={<a href={primary.full.url} download />} tone="neutral">
                      <DownloadIcon size={18} />
                      Download with a server
                    </Button>
                  </div>
                )}
              </div>

              <p className={styles.callout}>
                Need an older version, or a beta?{" "}
                <a href={RELEASES_URL} target="_blank" rel="noreferrer">
                  Every release is on GitHub
                </a>
                .
              </p>

              <h2 className={styles.h2}>Installing</h2>
              <p className={styles.facts}>{INSTALLING[os]}</p>

              <h2 className={styles.h2}>All {OS_NAMES[os]} downloads</h2>
              {formats.map((f) => (
                <div key={f.label} className={styles.group}>
                  <p className={styles.groupTitle}>{f.label}</p>
                  {[
                    f.slim && { name: "App only", ...f.slim },
                    f.full && { name: "With a server", ...f.full },
                  ]
                    .filter((x) => !!x)
                    .map((x) => (
                      <a key={x.url} className={styles.fileRow} href={x.url} download>
                        <span className={styles.fileName}>{x.name}</span>
                        <span className={styles.fileFile}>{x.fileName}</span>
                        <span className={styles.foldHint}>{formatSize(x.size)}</span>
                        <DownloadIcon size={18} />
                      </a>
                    ))}
                </div>
              ))}
              <p className={styles.facts}>
                <a href={LATEST_URL} target="_blank" rel="noreferrer">
                  Release notes and checksums on GitHub
                </a>
              </p>

              {commands.length > 0 && (
                <>
                  <h2 className={styles.h2}>From the terminal</h2>
                  <div className={styles.commands}>
                    {commands.map((c) => (
                      <Snippet key={c.label} label={c.label} code={c.command!} shell />
                    ))}
                  </div>
                </>
              )}

              {store && (
                <>
                  <h2 className={styles.h2}>From a store</h2>
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
                </>
              )}
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

          <h2 className={styles.h2}>Other systems</h2>
          <div className={styles.picks} role="group" aria-label="Other systems">
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
