import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/**
 * How to help build Gryt (GRYT-956). The page that did not exist: contributing was one row
 * inside "The source", which is the wrong weight for half of what the hub answers.
 */
const DOCS = "https://docs.gryt.chat/docs";
const GH = "https://github.com/Gryt-chat";

/** Thirteen repositories, and the one flag that gets all of them. */
const CLONE = `git clone --recurse-submodules https://github.com/Gryt-chat/gryt.git`;

const ROWS: RowItem[] = [
  {
    name: "Contributing",
    detail: "What the setup needs, how a change gets in, and what we do and do not want pull requests for.",
    href: `${DOCS}/guide/contributing`,
  },
  {
    name: "The roadmap",
    detail: "What is planned, what is not, and roughly in what order.",
    href: `${DOCS}/guide/roadmap`,
  },
  {
    name: "Feature requests",
    detail: "Where an idea goes so it lands somewhere it will be read rather than in an issue that closes stale.",
    href: `${DOCS}/guide/feature-requests`,
  },
  {
    name: "How Gryt is built with AI",
    detail: "Which parts an agent may touch, which need a human read, and how to audit it from the git log.",
    href: `${DOCS}/guide/ai`,
  },
  {
    name: "Architecture",
    detail: "What each of the thirteen repositories is, and which ones talk to which.",
    href: `${DOCS}/guide/architecture`,
  },
  {
    name: "Licensing",
    detail: "AGPL-3.0 for the platform, MIT for the design-system packages. Which is which, and what each asks of you.",
    href: `${DOCS}/guide/licensing`,
  },
];

export function ContributingPage() {
  return (
    <DevSubPage
      eyebrow="Help build Gryt"
      title="Contributing"
      lede="One person maintains this. A pull request that fits is worth a lot, and the fastest way to find out whether yours fits is to read what the project has already decided."
    >
      <Snippet label="bash" code={CLONE} shell />

      <p className={styles.blockNote}>
        The flag isn&rsquo;t optional. Without it you get thirteen empty
        folders — Gryt is a superproject and every part of it is a repository
        with its own CI and its own releases.
      </p>

      <p className={styles.blockNote}>
        Use <strong>yarn, never npm</strong>. The client and the server both
        ship a <code>yarn.lock</code>, and <code>npm install</code> silently
        resolves a different tree and writes a competing lockfile.
      </p>

      <p className={styles.blockNote}>
        Some paths always get read by a person before they merge: the media
        plane, the identity authority, anything that parses a stranger&rsquo;s
        upload, and the code that holds your private key. That isn&rsquo;t a
        hands-off list — it is a list of things that get a second pair of eyes,
        and the AI policy below names all of them.
      </p>

      <p className={styles.blockNote}>
        Built something rather than changed something? Bots, addons and server
        plugins go on <a href="/built">/built</a>, which is a file in the site
        repository that changes by pull request.
      </p>

      <LinkRows items={ROWS} />

      <p className={styles.blockNote}>
        Everything is on{" "}
        <a href={`${GH}/gryt`} target="_blank" rel="noreferrer">
          GitHub
        </a>
        , and issues are the right place for something broken.
      </p>
    </DevSubPage>
  );
}
