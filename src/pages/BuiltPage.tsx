import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Block } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { builtOfKind } from "../lib/built";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * Bots, addons and server plugins people can go and read, from `src/lib/built.ts`, by pull
 * request. Everything on it today is Gryt's own, and the page says so.
 */
const DOCS = "https://docs.gryt.chat/docs";
const BUILT_FILE = "https://github.com/Gryt-chat/site/blob/main/src/lib/built.ts";

export function BuiltPage() {
  useEffect(() => {
    document.title = pageTitle("Built with Gryt");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="Built with Gryt"
        title="Things people have made."
        lede="Bots, client addons and server plugins, each a folder you can read before you run it. Everything here today is ours — the examples we wrote so there would be something to copy. Yours goes on the same list."
      />

      <p className={styles.intro}>
        Nothing on this page was audited. A row here means somebody read the
        pull request that added it, not that the code was reviewed. An addon
        runs on your machine and a server plugin runs inside somebody&rsquo;s
        server, so install ones you&rsquo;d trust the author with — the same
        rule the <a href={`${DOCS}/client/addons`}>docs</a> give.
      </p>

      <Block
        heading="Bots"
        note="A bot joins a server the way any other client does: its own key, its own certificate, and whatever an admin agreed to let it do. Nothing special happens on the server side."
        items={builtOfKind("bot")}
      />

      <Block
        heading="Client addons"
        note="A theme is CSS. A plugin is JavaScript in a worker of its own, and what it can call is what you ticked when you turned it on."
        items={builtOfKind("addon")}
      />

      <Block
        heading="Server plugins"
        note="These run inside the server process, with the database and the filesystem, and nothing contains them. Whoever runs the server installs one, and everybody who joins is told it is there."
        items={builtOfKind("plugin")}
      />

      <Block heading="Getting yours on here">
        <p className={styles.blockNote}>
          The list is{" "}
          <a href={BUILT_FILE} target="_blank" rel="noreferrer">
            one file in this site&rsquo;s repository
          </a>
          . Open a pull request adding your entry.
        </p>
        <ol className={styles.steps}>
          <li>
            Link to source somebody can read. Not a download, not a landing
            page.
          </li>
          <li>
            Say who made it. A person or a project — your own name is fine.
          </li>
          <li>
            One line on what it does. What it does, not how good it is.
          </li>
        </ol>
        <p className={styles.blockNote}>
          It works the same way whether you wrote a theme or a plugin pair. If
          you built something and aren&rsquo;t sure it belongs, open the pull
          request anyway and we&rsquo;ll talk about it there.
        </p>
      </Block>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          The <Link to="/developers">developer page</Link> has the packages, the
          APIs and what a plugin is allowed to reach.
        </p>
        <div className={styles.tailLinks}>
          <a href={`${DOCS}/client/addons`} target="_blank" rel="noreferrer">
            Writing an addon <span aria-hidden="true">→</span>
          </a>
          <a href={`${DOCS}/server/plugins`} target="_blank" rel="noreferrer">
            Server plugins <span aria-hidden="true">→</span>
          </a>
          <a href={`${DOCS}/guide/plugin-pairs`} target="_blank" rel="noreferrer">
            Plugin pairs <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
