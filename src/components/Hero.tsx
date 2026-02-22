import { GrytLogo } from "./GrytLogo";
import { DownloadIcon } from "./icons";
import { AppMockup } from "./AppMockup";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <GrytLogo size={96} className={styles.logo} />

      <div className={styles.badge}>
        <span className={styles.badgeHighlight}>Open Source</span> — Self-hosted
        voice, text &amp; video
      </div>

      <h1 className={styles.title}>
        Communication that
        <br />
        <span className={styles.gradient}>you control.</span>
      </h1>

      <p className={styles.subtitle}>
        Gryt is a self-hosted, open-source platform for voice, text, and video
        chat. Own your data. Host your server. Build your client.
      </p>

      <div className={styles.actions}>
        <a href="https://github.com/Gryt-chat/gryt/releases" target="_blank" rel="noreferrer" className="btn btn-primary">
          <DownloadIcon />
          Download Gryt
        </a>
        <a
          href="https://docs.gryt.chat"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
        >
          Read the Docs
        </a>
      </div>

      <AppMockup />
    </section>
  );
}
