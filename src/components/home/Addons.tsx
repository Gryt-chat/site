import { Link } from "react-router-dom";

import { AddonSketch, Frame } from "../sketches";
import { Showcase } from "../Showcase";

/**
 * Themes and plugins, and where a plugin runs.
 *
 * This said "no sandbox, no registry, no docs page" until the plugin system
 * landed, and every word was true when it was written. What changed:
 * `pluginHost.ts` gives each plugin a `Worker`, `addonWorker.ts` deletes
 * `window`, `document`, `localStorage`, `indexedDB` and `Worker` off the
 * prototype chain before importing it, and `mayCall` in `workerProtocol.ts`
 * refuses anything the manifest did not declare and the person did not agree
 * to.
 *
 * **If the capability list grows, this section has to grow with it, and so does
 * `AddonSketch`** — the drawing beside it is the claim made checkable, and it
 * goes stale the same way the copy did.
 */
const ADDONS = "https://docs.gryt.chat/docs/client/addons";
const PAIRS = "https://docs.gryt.chat/docs/guide/plugin-pairs";

export function Addons() {
  return (
    <Showcase
      id="addons"
      size="regular"
      side="right"
      eyebrow="Addons"
      title="Themes, and plugins that stay where you put them."
      media={
        <Frame label="A theme's CSS goes into the page like any other stylesheet. A plugin doesn't go into the page at all — it gets a worker, and one object in it.">
          <AddonSketch />
        </Frame>
      }
    >
      <p>
        An addon is a folder you drop in. A{" "}
        <a href={ADDONS} target="_blank" rel="noreferrer">
          theme
        </a>{" "}
        is CSS. A plugin is JavaScript, and it runs in a worker of its own,
        where there&rsquo;s no page to reach, no messages to read and no key to
        take. What it can call is what you ticked when you turned it on.
      </p>
      <p>
        It can also{" "}
        <a href={PAIRS} target="_blank" rel="noreferrer">
          talk to a copy of itself on the server
        </a>
        , which is how one plugin shows everybody what you&rsquo;re playing. A
        server names every plugin it runs to everybody who joins, and that
        can&rsquo;t be turned off.{" "}
        <Link to="/built">See what people have built</Link>.
      </p>
    </Showcase>
  );
}
