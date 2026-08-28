import { Link } from "react-router-dom";

import { Button } from "@gryt/ui";

import { GrytLogo } from "./GrytLogo";
import {
  community,
  getGoing,
  legal,
  reading,
  source,
  type SiteLink,
} from "../data/siteLinks";
import styles from "./Footer.module.css";

/**
 * A sign-off, then the links.
 *
 * The previous version led with six repository cells and three rows of links,
 * which was a directory wearing a footer's clothes. The page above it argues
 * that Gryt belongs to you and is made by one person in the open; the footer
 * should finish that sentence rather than start a new index.
 *
 * So: the closing line and the two actions first, at a size somebody will
 * actually read. Everything else goes underneath in one quiet block, because a
 * person hunting for the Mastodon account will find it there and a person who
 * has just finished the page should not have to walk past it.
 */
const groups: { title: string; links: SiteLink[] }[] = [
  { title: "Get Gryt", links: getGoing },
  { title: "Read", links: reading },
  { title: "Talk to us", links: community },
  { title: "Source", links: source },
];

function FooterLink({ link }: { link: SiteLink }) {
  if (link.route) return <Link to={link.href}>{link.label}</Link>;
  // Anything that is not a route is either off-site or a mailto. Only the first
  // wants a new tab.
  if (link.href.startsWith("mailto:")) return <a href={link.href}>{link.label}</a>;
  return (
    <a href={link.href} target="_blank" rel={link.relMe ? "me noreferrer" : "noreferrer"}>
      {link.label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.signoff}>
        <GrytLogo size={44} />
        <p className={styles.line}>
          Made by one person, in the open, since 2022. Every part of it is a
          repo you can go and read, and it always will be.
        </p>
        <div className={styles.actions}>
          <Button render={<a href="https://app.gryt.chat" />} size="large">
            Open in browser
          </Button>
          <Button render={<Link to="/download" />} size="large" tone="neutral">
            Download
          </Button>
        </div>
      </div>

      <div className={styles.index}>
        {groups.map((g) => (
          <nav className={styles.group} key={g.title} aria-label={g.title}>
            <h2>{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.href + l.label}>
                  <FooterLink link={l} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={styles.colophon}>
        <p className={styles.licence}>
          <span>AGPL-3.0</span>
        </p>
        <ul className={styles.legal}>
          {legal.map((l) => (
            <li key={l.href}>
              <FooterLink link={l} />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
