import { Link } from "react-router-dom";

import { GrytLogo } from "./GrytLogo";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Product",
    links: [
      {
        href: "https://github.com/Gryt-chat/gryt/releases",
        label: "Download",
        external: true,
      },
      { href: "https://app.gryt.chat", label: "Open App", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://docs.gryt.chat", label: "Docs", external: true },
      { href: "/blog", label: "Blog", isRoute: true },
      {
        href: "https://docs.gryt.chat/docs/guide/roadmap",
        label: "Roadmap",
        external: true,
      },
      {
        href: "https://docs.gryt.chat/docs/guide/quick-start",
        label: "Self-Host Guide",
        external: true,
      },
      {
        href: "https://github.com/Gryt-chat/gryt/releases",
        label: "Releases",
        external: true,
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        href: "https://github.com/Gryt-chat",
        label: "GitHub",
        external: true,
      },
      {
        href: "https://feedback.gryt.chat",
        label: "Feedback",
        external: true,
      },
      { href: "/why-gryt", label: "Why Gryt?", isRoute: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy", isRoute: true },
      {
        href: "/community-guidelines",
        label: "Guidelines",
        isRoute: true,
      },
      { href: "mailto:sivert@gryt.chat", label: "Business Inquiries" },
    ],
  },
] as const;

type FooterLink = (typeof columns)[number]["links"][number];

function FooterLink({ link }: { link: FooterLink }) {
  if ("isRoute" in link && link.isRoute) {
    return <Link to={link.href}>{link.label}</Link>;
  }
  if ("external" in link && link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer">
        {link.label}
      </a>
    );
  }
  return <a href={link.href}>{link.label}</a>;
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title} className={styles.column}>
              <h4 className={styles.columnTitle}>{col.title}</h4>
              <ul className={styles.columnLinks}>
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.brand}>
            <GrytLogo size={24} />
            Gryt
            <span className={styles.est}>est. 2022</span>
          </div>
          <div className={styles.copy}>
            AGPL-3.0 License — Built by the Gryt community
          </div>
        </div>
      </div>
    </footer>
  );
}
