import { Link } from "react-router-dom";

import { GrytLogo } from "./GrytLogo";
import styles from "./Footer.module.css";

/**
 * Three groups rather than four columns of links above a social row above a
 * copyright tail, and the first group is the thing worth saying: every part of
 * Gryt is a repository you can read. The old shape gave equal weight to
 * "Roadmap" and "the entire media server".
 */
const repos = [
  { href: "https://github.com/Gryt-chat/gryt", label: "Monorepo" },
  { href: "https://github.com/Gryt-chat/client", label: "Client" },
  { href: "https://github.com/Gryt-chat/server", label: "Server" },
  { href: "https://github.com/Gryt-chat/sfu", label: "SFU" },
  { href: "https://github.com/Gryt-chat/auth", label: "Auth" },
  { href: "https://github.com/Gryt-chat/image-worker", label: "Image worker" },
];

const groups = [
  {
    title: "Get started",
    links: [
      { href: "https://app.gryt.chat", label: "Open in browser", external: true },
      { href: "https://github.com/Gryt-chat/gryt/releases", label: "Download", external: true },
      { href: "https://docs.gryt.chat/docs/guide/quick-start", label: "Self-host guide", external: true },
      { href: "https://docs.gryt.chat", label: "Documentation", external: true },
      { href: "https://docs.gryt.chat/docs/guide/roadmap", label: "Roadmap", external: true },
    ],
  },
  {
    title: "Community",
    links: [
      // The invite itself lives in one place, the redirect in this repo's
      // Dockerfile. See the note there for why it is not written out here.
      { href: "https://gryt.chat/discord", label: "Discord", external: true },
      { href: "https://mastodon.social/@gryt", label: "Mastodon", external: true, relMe: true },
      { href: "https://bsky.app/profile/gryt.chat", label: "Bluesky", external: true },
      { href: "https://www.reddit.com/r/Gryt/", label: "Reddit", external: true },
      { href: "https://feedback.gryt.chat", label: "Feedback", external: true },
    ],
  },
  {
    title: "This site",
    links: [
      { href: "/why-gryt", label: "Why Gryt?", isRoute: true },
      { href: "/blog", label: "Blog", isRoute: true },
      { href: "/changelog", label: "Changelog", isRoute: true },
      { href: "/sponsors", label: "Sponsors", isRoute: true },
      { href: "/privacy", label: "Privacy", isRoute: true },
      { href: "/terms", label: "Terms of use", isRoute: true },
      { href: "/community-guidelines", label: "Guidelines", isRoute: true },
      { href: "mailto:business@gryt.chat", label: "Business inquiries" },
    ],
  },
] as const;

type Link_ = { href: string; label: string; external?: boolean; isRoute?: boolean; relMe?: boolean };

function FooterLink({ link }: { link: Link_ }) {
  if (link.isRoute) return <Link to={link.href}>{link.label}</Link>;
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel={link.relMe ? "me noreferrer" : "noreferrer"}>
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
        <div className={styles.lead}>
          <div className={styles.brand}>
            <GrytLogo size={30} />
            Gryt
          </div>
          <p className={styles.pitch}>
            Voice, text and video chat you host yourself. Every piece of it is
            open source, down to the media server and the identity authority.
          </p>
          <nav className={styles.repos} aria-label="Repositories">
            {repos.map((r) => (
              <a key={r.href} href={r.href} target="_blank" rel="noreferrer">
                {r.label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.groups}>
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
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
      </div>

      <p className={styles.colophon}>
        <span>AGPL-3.0</span>
        <span>Built in the open since 2022</span>
      </p>
    </footer>
  );
}
