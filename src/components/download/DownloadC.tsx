import type { ReactNode } from "react";
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";

import { DownloadIcon, GlobeIcon } from "../icons";
import { StoreBadge } from "../StoreBadge";
import { useCopy } from "../../lib/useCopy";
import { formatSize, isDesktop, OS_NAMES, type DesktopOS, type DownloadOption } from "../../lib/releases";
import {
  formatsFor,
  LATEST_URL,
  openCommands,
  openStores,
  storeName,
  useDownloadData,
  WEB_APP_URL,
} from "./shared";
import styles from "./DownloadC.module.css";

/* Direction C: one table of everything that's out. Nothing faded, nothing "coming". */

type Group = DesktopOS | "web" | "phone";

const GROUPS: { id: Group; name: string; icon: typeof FaWindows }[] = [
  { id: "windows", name: "Windows", icon: FaWindows },
  { id: "macos", name: "macOS", icon: FaApple },
  { id: "linux", name: "Linux", icon: FaLinux },
  { id: "web", name: "Browser", icon: GlobeIcon },
  { id: "phone", name: "Phone", icon: MdPhoneIphone },
];

interface Row {
  key: string;
  name: string;
  /** Either two files, app and app-with-server, or one cell spanning both. */
  slim?: DownloadOption;
  full?: DownloadOption;
  span?: ReactNode;
}

function FileCell({ file, label }: { file?: DownloadOption; label: string }) {
  if (!file) return <td className={styles.cell} data-label={label}>—</td>;
  return (
    <td className={styles.cell} data-label={label}>
      <a className={styles.file} href={file.url} download>
        <DownloadIcon size={16} aria-hidden="true" />
        {formatSize(file.size)}
      </a>
    </td>
  );
}

/** One line of shell with a copy button, sized to sit in a table row. */
function Command({ code }: { code: string }) {
  const [copied, copy] = useCopy(code);
  return (
    <span className={styles.command}>
      <code className={styles.code}>
        <span aria-hidden="true" className={styles.prompt}>$ </span>
        {code}
      </code>
      <button type="button" className={styles.copy} onClick={copy}>
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </span>
  );
}

export function DownloadC() {
  const { grouped, version, detected, phone } = useDownloadData();
  const mine: Group = phone ? "phone" : isDesktop(detected) ? detected : "windows";
  const order = [...GROUPS].sort((a, b) => Number(b.id === mine) - Number(a.id === mine));

  const rowsFor = (group: Group): Row[] => {
    if (group === "web") {
      return [{
        key: "web",
        name: "app.gryt.chat",
        span: <a href={WEB_APP_URL}>Runs in the browser, nothing to install</a>,
      }];
    }
    if (group === "phone") {
      return [{
        key: "phone",
        name: "App Store, Google Play",
        span: (
          <span className={styles.dim}>
            In testing, not out yet. Use <a href={WEB_APP_URL}>app.gryt.chat</a> in your
            phone&rsquo;s browser until then.
          </span>
        ),
      }];
    }
    const files: Row[] = grouped
      ? formatsFor(grouped[group], group).map((f) => ({
          key: f.label,
          name: f.label,
          slim: f.slim,
          full: f.full,
        }))
      : [];
    const stores: Row[] = openStores(group).map((s) => ({
      key: s.badge.src,
      name: storeName(s),
      span: <StoreBadge store={s} className={styles.badge} />,
    }));
    const commands: Row[] = openCommands(group).map((c) => ({
      key: c.label,
      name: c.label.split(" · ")[0],
      span: <Command code={c.command!} />,
    }));
    return [...files, ...stores, ...commands];
  };

  return (
    <section className={styles.section} id="download">
      <div className={styles.box}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>Download</p>
          <h2 className={styles.title}>Every way to install Gryt</h2>
          <p className={styles.sub}>
            {version ? <>All of it is version {version}. </> : null}
            Yours is at the top.
          </p>
        </div>

        <table className={styles.table}>
          <caption className={styles.caption}>
            Each file comes in two builds. The one <strong>with server</strong> can host a
            server from inside the app, so friends can join yours. You don&rsquo;t need
            it to join someone else&rsquo;s. Stores and package managers always give you that one.
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.hFormat}>Format</th>
              <th scope="col" className={styles.hFile}>App</th>
              <th scope="col" className={styles.hFile}>With server</th>
            </tr>
          </thead>
          {order.map(({ id, name, icon: Icon }) => (
            <tbody key={id} className={styles.group} data-mine={id === mine || undefined}>
              <tr>
                <th scope="colgroup" colSpan={3} className={styles.groupHead}>
                  <Icon size={17} aria-hidden="true" />
                  {name}
                  {id === mine && <span className={styles.mine}>Your system</span>}
                </th>
              </tr>
              {rowsFor(id).map((row) => (
                <tr key={row.key} className={styles.row}>
                  <th scope="row" className={styles.name}>
                    <span className="sr-only">{OS_NAMES[id as DesktopOS] ?? name} </span>
                    {row.name}
                  </th>
                  {row.span ? (
                    <td colSpan={2} className={styles.span}>{row.span}</td>
                  ) : (
                    <>
                      <FileCell file={row.slim} label="App" />
                      <FileCell file={row.full} label="With server" />
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          ))}
        </table>

        <p className={styles.github}>
          <FaGithub size={18} aria-hidden="true" className={styles.githubIcon} />
          <span>
            Something missing? The{" "}
            <a href={LATEST_URL} target="_blank" rel="noreferrer">
              GitHub release page
            </a>{" "}
            has every file, with checksums.
          </span>
        </p>
      </div>
    </section>
  );
}
