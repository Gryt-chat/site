import { Link } from "react-router-dom";

import { Showcase } from "../Showcase";

/**
 * The honest version, and it is short because the feature is.
 *
 * `packages/client/src/packages/addons/src/pluginApi.ts` is forty lines. The
 * entire surface a plugin gets is `window.gryt` with a version string, the
 * current theme, and a `themeChange` event. There is no sandbox, no registry
 * and no docs page, and /compare used to claim addons as a shipped feature
 * against a competitor while the roadmap listed the plugin system as planned.
 * That row is fixed; this section is why it was wrong.
 *
 * If this grows, this is the section that has to grow with it.
 */
const ROADMAP = "https://docs.gryt.chat/docs/guide/roadmap";

export function Addons() {
  return (
    <Showcase
      id="addons"
      size="full"
      eyebrow="Addons"
      title="Themes, and a small plugin API."
    >
      <p>
        An addon is a folder with an <code>addon.json</code> in it. A theme
        addon adds CSS. A plugin addon adds a module, and that module can talk
        to exactly one thing: an object on <code>window</code> holding a
        version, the theme you're on, and an event for when you change it.
      </p>
      <p>
        That's all of it. There's no sandbox, no registry and no marketplace,
        and the plugin system is still{" "}
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
