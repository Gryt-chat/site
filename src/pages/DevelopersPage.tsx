import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Block, type RowItem } from "../components/LinkRows";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * For people who want to build on Gryt or take a piece of it away with them.
 *
 * The package descriptions are the ones in each package's own `package.json`,
 * shortened where a row needed shortening — not new copy, because a second
 * description is a second thing to keep right.
 *
 * Two things deliberately absent:
 *
 *  - There is no Figma file and no Code Connect anywhere in this repository. A
 *    developer page is the obvious place to claim one and it would be a lie.
 *  - `voice/index` in the docs still says the package is `0.1.1` when it is
 *    `0.4.2`, so the voice rows point at the pages that are current. The stale
 *    one is a docs task, not something to hide behind a link.
 *
 * The addons section is the long version of what the front page says in three
 * sentences. It is honest about being thin, and it stays that way until the
 * thing itself is not.
 */
const DOCS = "https://docs.gryt.chat/docs";
const NPM = "https://www.npmjs.com/package";
const GH = "https://github.com/Gryt-chat";

const PACKAGES: RowItem[] = [
  {
    name: "@gryt/ui",
    mono: true,
    detail: "MIT. React components on Base UI, styled with Tailwind on the Gryt palette — what the desktop and web clients render.",
    href: `${NPM}/@gryt/ui`,
  },
  {
    name: "@gryt/ui-native",
    mono: true,
    detail: "MIT. The same design system through React Native: same tokens, same names, a different renderer.",
    href: `${NPM}/@gryt/ui-native`,
  },
  {
    name: "@gryt/theme",
    mono: true,
    detail: "MIT. The design tokens, colour scales and OKLCH maths, with no renderer and no DOM. The theme swatches on our front page come out of it.",
    href: `${NPM}/@gryt/theme`,
  },
  {
    name: "@gryt/owl",
    mono: true,
    detail: "MIT. The owl avatars — give it a name, get an SVG. No renderer, no DOM, no dependencies.",
    href: `${NPM}/@gryt/owl`,
  },
  {
    name: "@gryt/voice",
    mono: true,
    detail: "AGPL. The voice engine on its own: signalling, ICE, tracks and audio, with web and React Native adapters.",
    href: `${NPM}/@gryt/voice`,
  },
  {
    name: "@gryt/bot",
    mono: true,
    detail: "AGPL. Write a Gryt bot in TypeScript. It joins a server the way any other client does.",
    href: `${NPM}/@gryt/bot`,
  },
];

const BOTS: RowItem[] = [
  {
    name: "Writing a bot",
    detail: "The SDK, how a bot asks to be let in, and what happens when an admin says yes.",
    href: `${DOCS}/bot`,
  },
  {
    name: "Roles and permissions",
    detail: "The same permission set a bot is granted from. There is no separate bot permission model.",
    href: `${DOCS}/guide/roles`,
  },
];

const APIS: RowItem[] = [
  {
    name: "Server API",
    detail: "Every REST endpoint and Socket.IO event the server answers.",
    href: `${DOCS}/server/api-reference`,
  },
  {
    name: "The SFU protocol",
    detail: "How the voice server is spoken to, from both sides: the Gryt server's connection and a participant's.",
    href: `${DOCS}/sfu`,
  },
  {
    name: "Identity",
    detail: "Self-signed certificates, the challenge-response, and how a server decides a key is who it says.",
    href: `${DOCS}/server/identity`,
  },
  {
    name: "Rate limiting",
    detail: "What the server does when a client goes too fast, and what a client should do about it.",
    href: `${DOCS}/server/rate-limiting`,
  },
];

const VOICE: RowItem[] = [
  {
    name: "Getting started",
    detail: "Wiring the engine into a React app.",
    href: `${DOCS}/voice/getting-started`,
  },
  {
    name: "Hooks",
    detail: "The hooks and what each one returns.",
    href: `${DOCS}/voice/hooks`,
  },
  {
    name: "The seams",
    detail: "The five interfaces the engine cannot work out for itself, and which of them are wired up yet.",
    href: `${DOCS}/voice/seams`,
  },
];

const DESIGN: RowItem[] = [
  {
    name: "The component library",
    detail: "The two packages Gryt's interface is built from, and the tokens they share.",
    href: `${DOCS}/ui`,
  },
  {
    name: "React Native",
    detail: "@gryt/ui-native, and where a phone forces a different answer than the web got.",
    href: `${DOCS}/ui/react-native`,
  },
  {
    name: "The theme generator",
    detail: "Build a palette, press Copy link, paste it into Appearance. A theme is a link.",
    href: "https://ui.gryt.chat/theme/generator",
  },
];

const SOURCE: RowItem[] = [
  {
    name: "Build the client",
    detail: "Compile the desktop app yourself from the public source.",
    href: `${DOCS}/client/build-from-source`,
  },
  {
    name: "Contributing",
    detail: "How a change gets in, and what we do and do not want pull requests for.",
    href: `${DOCS}/guide/contributing`,
  },
  {
    name: "Licensing",
    detail: "AGPL-3.0 for the platform, MIT for the design-system packages. Which is which, and what each one asks of you.",
    href: `${DOCS}/guide/licensing`,
  },
  {
    name: "How Gryt is built with AI",
    detail: "Which parts an agent may touch, which need a human read, and how to audit it from the git log.",
    href: `${DOCS}/guide/ai`,
  },
  {
    name: "The monorepo",
    detail: "Every repository, as submodules. Start here to read rather than install.",
    href: `${GH}/gryt`,
  },
];

export function DevelopersPage() {
  useEffect(() => {
    document.title = pageTitle("Developers");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="For developers"
        title="Take a piece of it."
        lede="Six of the pieces Gryt is made of are published on npm. The design system, the tokens and the owl avatars are MIT, so you can use them in something that has nothing to do with Gryt. The bot SDK, the voice engine and the APIs are here too."
      />

      <p className={styles.intro}>
        Identities are P-256 keypairs that sign their own certificates, and a
        server checks a signature rather than asking anybody, including us.
        There is no bot account type, no bot token and no bot bypass: what a bot
        may do is what an admin agreed to let it do, enforced by the same checks
        that apply to a person.
      </p>

      <Block
        heading="The packages"
        note="All six are used by the app you can download, and none of them needs a Gryt server to be useful on its own. Four are MIT; the two that are AGPL are the ones that only make sense pointed at Gryt."
        items={PACKAGES}
      />

      <Block
        heading="Bots"
        note="A bot knocks: it starts, says what it is called and what it wants to be allowed to do, and waits. An admin opens Server settings, unticks anything they would rather it did not have, and lets it in. The approval reaches the bot without a restart."
        items={BOTS}
      />

      <Block
        heading="The APIs"
        note="Everything the clients use."
        items={APIS}
      />

      <Block
        heading="The voice engine"
        note="@gryt/voice is the calling half of Gryt with nothing else attached — signalling, ICE, tracks and audio behind a set of React hooks. It talks to a Gryt SFU, and that is the only Gryt piece it needs."
        items={VOICE}
      />

      <Block
        heading="The design system"
        note="One set of tokens, two renderers, and a generator that turns a palette into a link."
        items={DESIGN}
      />

      <Block heading="Addons">
        <p className={styles.blockNote}>
          An addon is a folder with an <code>addon.json</code> in it, loaded by
          the desktop app. A theme addon injects CSS. A plugin addon injects a
          module, and what that module can talk to is one object on{" "}
          <code>window</code>: the client version, the theme you are on, and an
          event that fires when you change it.
        </p>
        <p className={styles.blockNote}>
          That is the whole surface. There is no sandbox, no permission model,
          no registry and no docs page, and the plugin system is still listed as
          planned on the roadmap. It is enough to restyle the client or bolt
          something small onto it, and not enough to build a product on.
        </p>
        <p className={styles.blockNote}>
          The shape it should take has not been decided. If you have tried to
          write one, an issue saying what you needed is more use than a feature
          request.
        </p>
      </Block>

      <Block
        heading="The source"
        note="One superproject with the rest as submodules, each with its own CI and its own releases."
        items={SOURCE}
      />

      <section className={styles.tail}>
        <p className={styles.tailText}>
          If you are here to run a server rather than to build on one, the{" "}
          <Link to="/self-hosting">self-hosting</Link> page has the guides.
        </p>
        <div className={styles.tailLinks}>
          <a href={`${DOCS}/guide/roadmap`} target="_blank" rel="noreferrer">
            Roadmap <span aria-hidden="true">→</span>
          </a>
          <a href={`${GH}/gryt/issues`} target="_blank" rel="noreferrer">
            Issues <span aria-hidden="true">→</span>
          </a>
          <a href="https://gryt.chat/discord">
            Discord <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
