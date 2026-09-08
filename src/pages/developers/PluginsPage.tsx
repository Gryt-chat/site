import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/**
 * Server plugins (GRYT-956). Its own page rather than a paragraph under client addons: one
 * runs in a worker on your machine, the other inside somebody's server with their database.
 */
const DOCS = "https://docs.gryt.chat/docs";
const GH = "https://github.com/Gryt-chat";

/** The manifest a plugin ships, and what the operator reads before running it. */
const MANIFEST = `{
  "id": "presence",
  "name": "Presence",
  "version": "1.0.0",
  "main": "index.mjs",
  "author": "you",
  "description": "Shows what people are playing",
  "capabilities": ["messaging", "members:read"]
}`;

const ROWS: RowItem[] = [
  {
    name: "Two plugins to copy",
    detail: "One that deletes the same message posted across three channels, and the server half of a pair.",
    href: `${GH}/server/tree/main/examples`,
  },
  {
    name: "Writing a server plugin",
    detail: "What a plugin can hear, what it can do about it, and why installing one is a bigger decision than a theme.",
    href: `${DOCS}/server/plugins`,
  },
  {
    name: "Server plugin API reference",
    detail: "Every capability, event and call, generated from the source so it cannot drift.",
    href: `${DOCS}/server/plugin-api`,
  },
  {
    name: "Plugin pairs",
    detail: "The pipe between a server plugin and the copy of itself in people's clients.",
    href: `${DOCS}/guide/plugin-pairs`,
  },
];

export function PluginsPage() {
  return (
    <DevSubPage
      eyebrow="Build on it"
      title="Server plugins"
      lede="JavaScript that runs inside a Gryt server. It hears about things as they happen, it can kick and ban and delete, and it runs with everything the server has."
    >
      <p className={styles.blockNote}>
        That last part is the whole story, so it comes first.{" "}
        <strong>Installing a plugin is running somebody else&rsquo;s code on
        your machine, with your database.</strong> It can read your files, open
        connections, and do anything the server process can do. The capability
        list in a manifest is a plugin telling you what it means to do. It is
        not a wall around it.
      </p>

      <Snippet label="manifest.json" code={MANIFEST} />

      <p className={styles.blockNote}>
        There&rsquo;s no sandbox and no plan for one that would still be useful.
        Install plugins you&rsquo;d trust the author with, and read the code if
        you can. If that sounds like too much, you probably want a bot instead —
        it talks to your server over the network like any other client, sees
        only what you let it into, and can be turned off without touching the
        server.
      </p>

      <p className={styles.blockNote}>
        Everybody who joins is told which plugins you run and what each one may
        do. That can&rsquo;t be turned off. A plugin reading people&rsquo;s
        messages is something the people sending them get to know about — and it
        is how the client half of a pair finds out the server runs the other
        half.
      </p>

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
