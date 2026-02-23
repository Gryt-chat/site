import { Link } from "react-router-dom";
import { GrytLogo } from "./GrytLogo";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <GrytLogo size={24} />
          Gryt
          <span className={styles.est}>est. 2022</span>
        </div>

        <ul className={styles.links}>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy</Link>
          </li>
          <li>
            <Link to="/community-guidelines">Guidelines</Link>
          </li>
          <li>
            <a href="https://docs.gryt.chat" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Gryt-chat"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Gryt-chat/gryt/releases"
              target="_blank"
              rel="noreferrer"
            >
              Releases
            </a>
          </li>
          <li>
            <a
              href="https://docs.gryt.chat/docs/guide/quick-start"
              target="_blank"
              rel="noreferrer"
            >
              Self-Host Guide
            </a>
          </li>
          <li>
            <a href="mailto:sivert@gryt.chat">Business Inquiries</a>
          </li>
        </ul>

        <div className={styles.copy}>
          AGPL-3.0 License — Built by the Gryt community
        </div>
      </div>
    </footer>
  );
}
