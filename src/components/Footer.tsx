import { Link } from "react-router-dom";

import { GrytLogo } from "./GrytLogo";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Resources",
    links: [
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
        href: "https://github.com/Gryt-chat",
        label: "GitHub",
        external: true,
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        href: "https://mastodon.social/@gryt",
        label: "Mastodon",
        external: true,
        relMe: true,
      },
      {
        href: "https://bsky.app/profile/gryt.chat",
        label: "Bluesky",
        external: true,
      },
      {
        href: "https://www.reddit.com/r/Gryt/",
        label: "Reddit",
        external: true,
      },
      {
        href: "https://discord.gg/Q3JKUGsnHE",
        label: "Discord",
        external: true,
      },
      {
        href: "https://feedback.gryt.chat",
        label: "Feedback",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Use", isRoute: true },
      { href: "/privacy", label: "Privacy", isRoute: true },
      {
        href: "/community-guidelines",
        label: "Guidelines",
        isRoute: true,
      },
      { href: "mailto:business@gryt.chat", label: "Business Inquiries" },
    ],
  },
] as const;

type FooterLink = (typeof columns)[number]["links"][number];

function FooterLink({ link }: { link: FooterLink }) {
  if ("isRoute" in link && link.isRoute) {
    return <Link to={link.href}>{link.label}</Link>;
  }
  if ("external" in link && link.external) {
    const rel =
      "relMe" in link && link.relMe ? "me noreferrer" : "noreferrer";
    return (
      <a href={link.href} target="_blank" rel={rel}>
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
