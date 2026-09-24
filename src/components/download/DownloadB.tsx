import { useId, useState } from "react";
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { Button, Switch, Tabs } from "@gryt/ui";

import { DownloadIcon, GlobeIcon } from "../icons";
import { Snippet } from "../Snippet";
import { StoreBadge } from "../StoreBadge";
import { formatSize, isDesktop, type DesktopOS } from "../../lib/releases";
import {
  formatsFor,
  LATEST_URL,
  openCommands,
  openStores,
  useDownloadData,
  WEB_APP_URL,
} from "./shared";
import styles from "./DownloadB.module.css";

/* Direction B: a tab per platform. Each tab holds only what's out today. */

type TabId = DesktopOS | "web" | "phone";

const TABS: { id: TabId; name: string; icon: typeof FaWindows }[] = [
  { id: "windows", name: "Windows", icon: FaWindows },
  { id: "macos", name: "macOS", icon: FaApple },
  { id: "linux", name: "Linux", icon: FaLinux },
  { id: "web", name: "Browser", icon: GlobeIcon },
  { id: "phone", name: "Phone", icon: MdPhoneIphone },
];

export function DownloadB() {
  const { grouped, version, detected, phone, primaryFor } = useDownloadData();
  const [chosen, setChosen] = useState<TabId | null>(null);
  const [withServer, setWithServer] = useState(false);
  const switchId = useId();
  const helpId = useId();
  const tab: TabId = chosen ?? (phone ? "phone" : isDesktop(detected) ? detected : "windows");

  const desktopPanel = (os: DesktopOS) => {
    const formats = grouped ? formatsFor(grouped[os], os) : [];
    const primary = primaryFor(os);
    const ordered = primary ? [primary, ...formats.filter((f) => f.label !== primary.label)] : formats;
    const stores = openStores(os);
    const commands = openCommands(os);
    const sample = primary?.slim && primary.full ? primary : null;

    return (
      <div className={styles.panelGrid}>
        <div className={styles.filesCol}>
          <div className={styles.colHead}>
            <h3 className={styles.colTitle}>Files</h3>
            {sample && (
              <label className={styles.switchRow} id={switchId}>
                <Switch
                  checked={withServer}
                  onCheckedChange={(next) => setWithServer(next === true)}
                  aria-labelledby={switchId}
                  aria-describedby={helpId}
                />
                Include the server
              </label>
            )}
          </div>
          {sample && (
            <p className={styles.help} id={helpId}>
              Turn it on for the build that can host a server from inside the app, so
              friends can join yours. You don&rsquo;t need it to join someone else&rsquo;s. It adds{" "}
              {formatSize(sample.full!.size - sample.slim!.size)}.
            </p>
          )}
          <ul className={styles.rows}>
            {ordered.map((f, i) => {
              const file = (withServer ? f.full : f.slim) ?? f.slim ?? f.full;
              if (!file) return null;
              return (
                <li className={styles.row} key={f.label}>
                  <div className={styles.rowText}>
                    <span className={styles.rowName}>{f.label}</span>
                    <span className={styles.rowNote}>{f.description}</span>
                  </div>
                  <Button
                    className={styles.rowButton}
                    render={<a href={file.url} download />}
                    tone={i === 0 ? undefined : "neutral"}
                  >
                    <DownloadIcon size={17} />
                    {formatSize(file.size)}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {(stores.length > 0 || commands.length > 0) && (
          <div className={styles.sideCol}>
            <h3 className={styles.colTitle}>Store or terminal</h3>
            <p className={styles.help}>These always include the server.</p>
            {stores.map((s) => (
              <StoreBadge key={s.badge.src} store={s} className={styles.badge} />
            ))}
            {commands.map((c) => (
              <Snippet key={c.label} label={c.label} code={c.command!} shell />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>Download</p>
          <h2 className={styles.title}>Pick your system</h2>
          <p className={styles.sub}>
            We&rsquo;ve opened the tab for the one you&rsquo;re on.
            {version && <> Everything here is version {version}.</>}
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setChosen(v as TabId)}>
          <Tabs.List className={styles.tabList} aria-label="Platform">
            {TABS.map(({ id, name, icon: Icon }) => (
              <Tabs.Tab className={styles.tab} value={id} key={id}>
                <Icon size={16} aria-hidden="true" />
                <span>{name}</span>
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className={styles.indicator} />
          </Tabs.List>

          {(["windows", "macos", "linux"] as const).map((os) => (
            <Tabs.Panel className={styles.panel} value={os} key={os}>
              {desktopPanel(os)}
            </Tabs.Panel>
          ))}

          <Tabs.Panel className={styles.panel} value="web">
            <div className={styles.single}>
              <h3 className={styles.colTitle}>Nothing to install</h3>
              <p className={styles.help}>
                Gryt runs in the browser too, so there&rsquo;s nothing to install or update.
              </p>
              <Button render={<a href={WEB_APP_URL} />} size="large">
                <GlobeIcon size={18} />
                Open app.gryt.chat
              </Button>
            </div>
          </Tabs.Panel>

          <Tabs.Panel className={styles.panel} value="phone">
            <div className={styles.single}>
              <h3 className={styles.colTitle}>The phone app is in testing</h3>
              <p className={styles.help}>
                It isn&rsquo;t in the App Store or on Google Play yet. Until it is, Gryt
                works in your phone&rsquo;s browser.
              </p>
              <Button render={<a href={WEB_APP_URL} />} size="large">
                <GlobeIcon size={18} />
                Open app.gryt.chat
              </Button>
            </div>
          </Tabs.Panel>
        </Tabs>

        <p className={styles.github}>
          Looking for something else, or a checksum? It&rsquo;s all on the{" "}
          <a className={styles.githubLink} href={LATEST_URL} target="_blank" rel="noreferrer">
            <FaGithub size={17} aria-hidden="true" />
            GitHub release page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
