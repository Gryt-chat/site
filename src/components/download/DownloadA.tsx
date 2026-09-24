import { useState } from "react";
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { Button } from "@gryt/ui";

import { DownloadIcon, GlobeIcon } from "../icons";
import { Snippet } from "../Snippet";
import { StoreBadge } from "../StoreBadge";
import { dayMonthYear } from "../../lib/formatDate";
import { formatSize, isDesktop, OS_NAMES, type DesktopOS } from "../../lib/releases";
import {
  formatsFor,
  LATEST_URL,
  listJoin,
  notYet,
  openCommands,
  openStores,
  updatesItself,
  useDownloadData,
  WEB_APP_URL,
} from "./shared";
import styles from "./DownloadA.module.css";

/* Direction A: one clear answer. Your platform's file, big; everything else a row under it. */

type Pick = DesktopOS | "web" | "phone";

const PICKS: { id: Pick; name: string; icon: typeof FaWindows }[] = [
  { id: "windows", name: "Windows", icon: FaWindows },
  { id: "macos", name: "macOS", icon: FaApple },
  { id: "linux", name: "Linux", icon: FaLinux },
  { id: "web", name: "Browser", icon: GlobeIcon },
  { id: "phone", name: "Phone", icon: MdPhoneIphone },
];

export function DownloadA() {
  const { release, grouped, version, detected, phone, primaryFor } = useDownloadData();
  const [chosen, setChosen] = useState<Pick | null>(null);
  const pick: Pick = chosen ?? (phone ? "phone" : isDesktop(detected) ? detected : "windows");
  const desktop = pick !== "web" && pick !== "phone" ? pick : null;

  const primary = desktop ? primaryFor(desktop) : null;
  const others =
    desktop && grouped
      ? formatsFor(grouped[desktop], desktop).filter((f) => f.label !== primary?.label)
      : [];
  const stores = desktop ? openStores(desktop) : [];
  const commands = desktop ? openCommands(desktop) : [];
  const soon = notYet();

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <p className={styles.eyebrow}>Download</p>

        <div className={styles.grid}>
          <div className={styles.main}>
            {desktop && (
              <>
                <h2 className={styles.title}>Gryt for {OS_NAMES[desktop]}</h2>
                {version && (
                  <p className={styles.sub}>
                    Version {version}
                    {release?.published_at && <>, out {dayMonthYear(release.published_at)}</>}.
                    It updates itself.
                  </p>
                )}
                {primary?.slim && (
                  <div className={styles.action}>
                    <Button render={<a href={primary.slim.url} download />} size="large">
                      <DownloadIcon size={20} />
                      Download for {OS_NAMES[desktop]}
                      <span className={styles.size}>{formatSize(primary.slim.size)}</span>
                    </Button>
                    <p className={styles.fileName}>{primary.slim.fileName}</p>
                    {desktop !== "windows" && <p className={styles.note}>{primary.description}</p>}
                  </div>
                )}
                {primary?.full && (
                  <p className={styles.server}>
                    Want to host a server for friends from inside the app?{" "}
                    <a href={primary.full.url} download>
                      Get the build with the server in it
                    </a>{" "}
                    ({formatSize(primary.full.size)}). You don&rsquo;t need it to join
                    someone else&rsquo;s.
                  </p>
                )}
              </>
            )}

            {pick === "web" && (
              <>
                <h2 className={styles.title}>Gryt in your browser</h2>
                <p className={styles.sub}>Nothing to install. Open it and sign in.</p>
                <div className={styles.action}>
                  <Button render={<a href={WEB_APP_URL} />} size="large">
                    <GlobeIcon size={20} />
                    Open app.gryt.chat
                  </Button>
                </div>
              </>
            )}

            {pick === "phone" && (
              <>
                <h2 className={styles.title}>Gryt on your phone</h2>
                <p className={styles.sub}>
                  The phone app is in testing, so it isn&rsquo;t in the App Store or on
                  Google Play yet. Until it is, Gryt works in your phone&rsquo;s browser.
                </p>
                <div className={styles.action}>
                  <Button render={<a href={WEB_APP_URL} />} size="large">
                    <GlobeIcon size={20} />
                    Open app.gryt.chat
                  </Button>
                </div>
              </>
            )}
          </div>

          {desktop && (stores.length > 0 || commands.length > 0 || others.length > 0) && (
            <aside className={styles.aside} aria-label={`Other ways to get it on ${OS_NAMES[desktop]}`}>
              <h3 className={styles.asideTitle}>Other ways on {OS_NAMES[desktop]}</h3>
              {stores.length > 0 && (
                <div className={styles.stores}>
                  {stores.map((s) => (
                    <StoreBadge key={s.badge.src} store={s} className={styles.badge} />
                  ))}
                </div>
              )}
              {commands.map((c) => (
                <Snippet key={c.label} label={c.label} code={c.command!} shell />
              ))}
              {others.length > 0 && (
                <ul className={styles.files}>
                  {others.map((f) =>
                    f.slim ? (
                      <li key={f.label}>
                        <a className={styles.fileLink} href={f.slim.url} download>
                          <DownloadIcon size={16} aria-hidden="true" />
                          <span>{f.label}</span>
                          {!updatesItself(f) && (
                            <span className={styles.fileNote}>won&rsquo;t update itself</span>
                          )}
                          <span className={styles.fileSize}>{formatSize(f.slim.size)}</span>
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </aside>
          )}
        </div>

        <div className={styles.foot}>
          <nav className={styles.picks} aria-label="Other platforms">
            <span className={styles.picksLabel}>
              {desktop ? <>Not on {OS_NAMES[desktop]}?</> : <>On a computer?</>}
            </span>
            {PICKS.filter((p) => p.id !== pick).map(({ id, name, icon: Icon }) => (
              <button key={id} type="button" className={styles.pick} onClick={() => setChosen(id)}>
                <Icon size={16} aria-hidden="true" />
                {name}
              </button>
            ))}
          </nav>

          <p className={styles.soon}>Coming later: {listJoin(soon)}.</p>

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
