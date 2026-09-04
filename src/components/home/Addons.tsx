import { Link } from "react-router-dom";

import { AddonSketch, Frame } from "../sketches";
import { Showcase } from "../Showcase";

/**
 * The honest version, and it is short because the feature is.
 *
 * `packages/client/src/packages/addons/src/pluginApi.ts` is forty lines. The
 * entire surface a plugin gets is `window.gryt` with a version string, the
 * current theme, and a `themeChange` event. No sandbox, no registry, no docs
 * page.
 *
 * **If this grows, this section has to grow with it, and so does
 * `AddonSketch`** — the drawing beside it is the claim about smallness made
 * checkable, and it goes stale the same way the copy would.
 */
const ROADMAP = "https://docs.gryt.chat/docs/guide/roadmap";

export function Addons() {
  return (
    <Showcase
      id="addons"
      size="regular"
      side="right"
      eyebrow="Addons"
      title="Themes, and a small plugin API."
      media={
        <Frame label="A theme's CSS goes in like any other stylesheet. A plugin's module gets one object, with three things on it.">
          <AddonSketch />
        </Frame>
      }
    >
      <p>
        An addon is a folder with an <code>addon.json</code> in it. A theme
        addon adds CSS. A plugin addon adds a module, and that module can talk
        to exactly one thing: an object on <code>window</code> with a version,
        the theme you're on, and an event for when you change it.
      </p>
      <p>
        And that's all of it. No sandbox, no registry, no marketplace, and the
        plugin system is still{" "}
        <a href={ROADMAP} target="_blank" rel="noreferrer">
          on the roadmap
        </a>
        . It's enough to restyle the client. It isn't enough to build a
        product on.{" "}
        <Link to="/developers">More on the developer page</Link>.
      </p>
    </Showcase>
  );
}
