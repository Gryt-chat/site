import { Link } from "react-router-dom";
import { PiButterfly, PiDiscordLogo, PiGithubLogo, PiMastodonLogo, PiRedditLogo } from "react-icons/pi";

import { GrytLogo } from "./GrytLogo";
import { footerGroups, legal, type SiteLink } from "../data/siteLinks";
import styles from "./Footer.module.css";


const SOCIALS = [
  { label: "GitHub", href: "https://github.com/Gryt-chat", Icon: PiGithubLogo },
  { label: "Discord", href: "https://gryt.chat/discord", Icon: PiDiscordLogo },
  { label: "Mastodon", href: "https://mastodon.social/@gryt", Icon: PiMastodonLogo, relMe: true },
  { label: "Bluesky", href: "https://bsky.app/profile/gryt.chat", Icon: PiButterfly },
  { label: "Reddit", href: "https://www.reddit.com/r/Gryt/", Icon: PiRedditLogo },
];

function FooterLink({ link }: { link: SiteLink }) {
  if (link.route) return <Link to={link.href}>{link.label}</Link>;
  if (link.href.startsWith("mailto:")) return <a href={link.href}>{link.label}</a>;
  return <a href={link.href} target="_blank" rel={link.relMe ? "me noreferrer" : "noreferrer"}>{link.label}</a>;
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <span className={styles.brand}><GrytLogo size={30} />Gryt</span>
            <p className={styles.tagline}>Voice, video and text chat you can run yourself. Free and open source.</p>
            <div className={styles.socials}>
              {SOCIALS.map(({ label, href, Icon, relMe }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel={relMe ? "me noreferrer" : "noreferrer"}>
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          {footerGroups.map((g) => (
            <nav className={styles.group} key={g.title} aria-label={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}><FooterLink link={l} /></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.colophon}>
          <span>© 2021–{new Date().getFullYear()} Gryt · AGPL-3.0</span>
          <ul className={styles.legal}>
            {legal.map((l) => (
              <li key={l.href}><FooterLink link={l} /></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
