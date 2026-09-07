import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/**
 * Client addons, lifted out of the old one-page `/developers` (GRYT-956).
 *
 * The server half moved to its own page rather than staying a paragraph at the
 * bottom of this one: a plugin inside somebody's server and a plugin inside
 * your own client are different decisions with different risks, and the old
 * page ran them together under one heading.
 */
const DOCS = "https://docs.gryt.chat/docs";
const GH = "https://github.com/Gryt-chat";

/**
 * The `gryt` object from `packages/client/src/packages/addons/src/addonWorker.ts`.
 *
 * Printed rather than summarised, because "this is the whole surface" is the
 * claim and the declaration is the proof. If the surface grows, this grows with
 * it or it becomes a lie, which is easier to notice than a paragraph going
 * quietly out of date.
 */
const PLUGIN_API = `declare const gryt: {
  version: string;
  theme: { appearance: "light" | "dark"; accentColor: string };
  on(event: "themeChange" | "cleanup", handler: () => void): () => void;

  // needs "status"
  setActivity(activity: string): Promise<unknown>;

  // needs "messaging"
  messaging: {
    send(topic: string, data: unknown, host?: string): Promise<unknown>;
    on(topic: string, handler: (message: unknown) => void): () => void;
    servers(): Promise<string[]>;
  };

  // needs "display"
  ui: {
    panel(panel: { title: string; rows: { label: string; value?: string }[] }): Promise<unknown>;
    clear(): Promise<unknown>;
  };

  // needs "processes"
  processes: {
    running(): Promise<string[]>;
    on(handler: (running: string[]) => void): () => void;
  };

  log: { info(m: string): void; warn(m: string): void; error(m: string): void };
};`;

/**
 * What is not there, taken from the same file.
 *
 * `addonWorker.ts` walks the prototype chain for each of these and deletes it
 * before the plugin is imported — a plain `delete globalThis.indexedDB` does
 * nothing, because they are getters on `WorkerGlobalScope.prototype`.
 */
const PLUGIN_GONE = `window        // a worker has none, so nothing on the page
document
localStorage
indexedDB     // deleted off the prototype chain
caches
Worker        // no nesting out of it`;

const ROWS: RowItem[] = [
  {
    name: "A theme and a plugin to copy",
    detail: "Forty lines of CSS, and the client half of a pair that draws what everybody is playing.",
    href: `${GH}/client/tree/main/examples`,
  },
  {
    name: "Writing an addon",
    detail: "The manifest, the API, the capabilities, and what granting one does and does not buy you.",
    href: `${DOCS}/client/addons`,
  },
  {
    name: "Addon API reference",
    detail: "Everything on the gryt object, generated from the source so it cannot drift.",
    href: `${DOCS}/client/addon-api`,
  },
  {
    name: "Plugin pairs",
    detail: "A client half and a server half talking to each other, and everything Gryt drops before either sees it.",
    href: `${DOCS}/guide/plugin-pairs`,
  },
];

export function AddonsPage() {
  return (
    <DevSubPage
      eyebrow="Build on it"
      title="Client addons"
      lede="An addon is a folder you drop in. A theme is CSS and goes into the page. A plugin is JavaScript and does not: it gets a worker of its own, and one object in it."
    >
      <Snippet label="addonWorker.ts" code={PLUGIN_API} />

      <p className={styles.blockNote}>
        Each of those needs a capability the manifest declared and the person
        turned on. Both, or the call rejects and says which one is missing. A
        capability name this build has never heard of is dropped rather than
        refused, so a plugin written against a newer Gryt still loads on an
        older one.
      </p>

      <p className={styles.blockNote}>
        The other half of that is what a plugin doesn&rsquo;t get, and it
        matters more than the list above:
      </p>

      <Snippet label="not defined" code={PLUGIN_GONE} />

      <p className={styles.blockNote}>
        A plugin can&rsquo;t read your messages and can&rsquo;t reach your
        identity key. It can put a panel beside the member list by describing
        one — a title and rows of text that Gryt draws — and it can&rsquo;t put
        an element on the page, because it isn&rsquo;t on the page.
      </p>

      <p className={styles.blockNote}>
        What it keeps is its internet connection, so whatever you grant it, it
        can send anywhere. Installing one is still trusting whoever wrote it
        with what you gave it.
      </p>

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
