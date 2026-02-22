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
        </div>

        <ul className={styles.links}>
          <li>
            <Link to="/blog">Blog</Link>
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
        </ul>

        <div className={styles.copy}>
          MIT License — Built by the Gryt community
        </div>
      </div>
    </footer>
  );
}
