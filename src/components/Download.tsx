import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import { DownloadIcon, GlobeIcon, ServerRackIcon } from "./icons";
import styles from "./Download.module.css";

export function Download() {
  return (
    <section className="section border-top" id="download">
      <div className={styles.box}>
        <div className={styles.glow} />
        <div className="section-label">Get Started</div>
        <h2 className="section-title">Ready to get started?</h2>
        <p className={`section-desc ${styles.desc}`}>
          Try Gryt right in your browser, download the desktop client, or
          self-host your own server in minutes.
        </p>

        <div className={styles.actions}>
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
            href="https://github.com/Gryt-chat/gryt/releases"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <DownloadIcon size={16} />
            Download Latest Release
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

        <div className={styles.platforms}>
          <span className={styles.platform}>
            <FaWindows size={14} />
            Windows
          </span>
          <span className={styles.platform}>
            <FaApple size={14} />
            macOS
          </span>
          <span className={styles.platform}>
            <FaLinux size={14} />
            Linux
          </span>
        </div>
      </div>
    </section>
  );
}
