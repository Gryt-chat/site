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
            <GlobeIcon />
            Try in Browser
          </a>
          <a
            href="https://github.com/Gryt-chat/gryt/releases"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <DownloadIcon />
            Download Latest Release
          </a>
          <a
            href="https://docs.gryt.chat/docs/guide/quick-start"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <ServerRackIcon />
            Self-Host a Server
          </a>
        </div>

        <p className={styles.note}>
          No download required — works in Chrome, Firefox, Edge, and Safari.
          Some features like global push-to-talk are desktop-only.
        </p>

        <div className={styles.platforms}>
          <span className={styles.platform}>
            <WindowsIcon />
            Windows
          </span>
          <span className={styles.platform}>
            <MacIcon />
            macOS
          </span>
          <span className={styles.platform}>
            <LinuxIcon />
            Linux
          </span>
        </div>
      </div>
    </section>
  );
}

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2.5h7.3v7.3H0zm8.7 0H16v7.3H8.7zM0 10.2h7.3V16H0zm8.7-1.9H16V16H8.7z" />
    </svg>
  );
}

function MacIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm3.05 4.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-6.1 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM8 13c-2.33 0-4.31-1.46-5.11-3.5h10.22C12.31 11.54 10.33 13 8 13z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l.5.9C9.2 3.5 8.7 4 8 4s-1.2-.5-.5-2.1L8 1zm-3.3 3.4c-.2 0-.4.1-.5.2C3.1 5.7 2.5 7.8 2.5 10v.5c0 1.4.3 2.7.8 3.5.2.3.5.5.7.5s.4-.1.6-.3c.4-.4 1-.6 1.6-.6h3.6c.6 0 1.2.2 1.6.6.2.2.4.3.6.3s.5-.2.7-.5c.5-.8.8-2.1.8-3.5V10c0-2.2-.6-4.3-1.7-5.4-.1-.1-.3-.2-.5-.2H4.7z" />
    </svg>
  );
}
