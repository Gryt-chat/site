import { Avatar, Button, Chip } from "@gryt/ui";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Block,
  LinkRows,
  PackageRows,
  type PackageItem,
  type RowItem,
} from "../components/LinkRows";
import { OwlPlayground } from "../components/OwlPlayground";
import { PageHeader } from "../components/PageHeader";
import { Snippet } from "../components/Snippet";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";

/**
 * For people who want to build on Gryt or take a piece of it away with them.
 *
 * The package descriptions are the ones in each package's own `package.json`,
 * shortened where a row needed shortening — not new copy, because a second
 * description is a second thing to keep right.
 *
 * It was six groups of rows and nothing else, which on a site whose front page
 * runs the product live in four places hands a developer an index. The
 * directories are still directories and still rows; what changed is that the
 * first half of the page now shows the things it is describing. The owl is
 * drawn here by the published package, the packages carry the line that
 * installs them, and the two smallest surfaces in Gryt — the bot handshake and
 * the plugin object — are short enough to print in full.
 *
 * Nothing here is a second copy of the docs. Every snippet is either read out
 * of the source it documents or is the code running on this page, and the rows
 * still go to `docs.gryt.chat` for the rest.
 *
 * Two things deliberately absent:
 *
 *  - There is no Figma file and no Code Connect anywhere in this repository. A
 *    developer page is the obvious place to claim one and it would be a lie.
 *  - `voice/index` in the docs still says the package is `0.1.1` when it is
 *    `0.4.2`, so the voice rows point at the pages that are current. The stale
 *    one is a docs task, not something to hide behind a link.
 */
const DOCS = "https://docs.gryt.chat/docs";
const NPM = "https://www.npmjs.com/package";
const GH = "https://github.com/Gryt-chat";

const PACKAGES: PackageItem[] = [
  {
    name: "@gryt/ui",
    licence: "MIT",
    detail: "React components on Base UI, styled with Tailwind on the Gryt palette — what the desktop and web clients render.",
    install: "npm i @gryt/ui",
    href: `${NPM}/@gryt/ui`,
  },
  {
    name: "@gryt/ui-native",
    licence: "MIT",
    detail: "The same design system through React Native: same tokens, same names, a different renderer.",
    install: "npm i @gryt/ui-native",
    href: `${NPM}/@gryt/ui-native`,
  },
  {
    name: "@gryt/theme",
    licence: "MIT",
    detail: "The design tokens, colour scales and OKLCH maths, with no renderer and no DOM. The theme swatches on our front page come out of it.",
    install: "npm i @gryt/theme",
    href: `${NPM}/@gryt/theme`,
  },
  {
    name: "@gryt/owl",
    licence: "MIT",
    detail: "The owl avatars — give it a name, get an SVG. No renderer, no DOM, no dependencies.",
    install: "npm i @gryt/owl",
    href: `${NPM}/@gryt/owl`,
  },
  {
    name: "@gryt/voice",
    licence: "AGPL",
    detail: "The voice engine on its own: signalling, ICE, tracks and audio, with web and React Native adapters.",
    install: "npm i @gryt/voice",
    href: `${NPM}/@gryt/voice`,
  },
  {
    name: "@gryt/bot",
    licence: "AGPL",
    detail: "Write a Gryt bot in TypeScript. It joins a server the way any other client does.",
    install: "npm i @gryt/bot",
    href: `${NPM}/@gryt/bot`,
  },
];

/**
 * The example from `bot/index.mdx`, two lines shorter.
 *
 * The docs version gives every command a description and a `requires` list,
 * which is the right advice and the wrong first impression — the shape of the
 * SDK is what this is here to show. Both dropped fields are optional in
 * `GrytBotOptions` and `CommandOptions`, so this compiles as it stands.
 */
const BOT_EXAMPLE = `import { GrytBot } from "@gryt/bot";

const bot = new GrytBot({
  host: "chat.example.com",
  nickname: "Helper",
  wants: ["read_messages", "send_messages"],
});

bot.command("ping", async (ctx) => ctx.reply("pong"));

void bot.start();`;

/**
 * `examples/support-bot/compose.yml`, with the interpolation taken out.
 *
 * The real file guards `GRYT_HOST` with `${GRYT_HOST:?...}` and gives the
 * nickname and the token defaults, which is right for a file somebody runs and
 * wrong for one somebody reads: three of the four environment lines would be
 * shell syntax rather than the thing being shown. The host is written out
 * literally and the two optional keys are gone. Everything left is that file.
 *
 * The volume is the reason this is on the page at all, and it is only half the
 * story on its own — see the paragraph under it.
 */
const BOT_COMPOSE = `services:
  support-bot:
    build: .
    restart: unless-stopped
    environment:
      GRYT_HOST: chat.example.com
    volumes:
      - support-bot-identity:/data

volumes:
  support-bot-identity:`;

/**
 * The top of `packages/client/src/packages/addons/src/pluginApi.ts`, as it is.
 *
 * Printed rather than summarised, because "the surface is thin" is the claim
 * and the declaration is the proof. One alias is inlined — the source names the
 * handler type separately — and nothing else is changed. If the plugin surface
 * grows, this grows with it or it becomes a lie, which is easier to notice than
 * a paragraph going quietly out of date.
 */
const PLUGIN_API = `type ThemeInfo = { appearance: "light" | "dark"; accentColor: string };

interface GrytPluginAPI {
  version: string;
  theme: ThemeInfo;
  on(event: "themeChange", handler: (theme: ThemeInfo) => void): () => void;
}

declare global {
  interface Window {
    gryt?: GrytPluginAPI;
  }
}`;

/**
 * The first call anybody makes against a Gryt server, and what comes back.
 *
 * `/info` is the join preview and it is deliberately unauthenticated: a client
 * has to be able to say "you do not need an account for this one" before
 * anybody tries. It is the shortest possible proof that a host is a Gryt server
 * and that you can talk to it, which is why it is here rather than a paragraph
 * about REST.
 *
 * `description` is dropped from the response shown; everything else is the
 * shape in `server/api-reference`. A server with `discoverable` off answers 404
 * to anyone who is not already a member, so an empty answer is a setting rather
 * than a bug.
 */
const INFO_REQUEST = `curl -s https://chat.example.com/info`;

const INFO_RESPONSE = `{
  "serverId": "...",
  "name": "Bird House",
  "members": "12",
  "lanOpen": false,
  "identityTiers": ["account"],
  "joinPolicy": "invite"
}`;

/**
 * Joining and leaving a call, from `voice/getting-started`.
 *
 * The whole engine behind two functions and a state, which is the argument for
 * the package. What the snippet cannot show is the part that costs people an
 * afternoon — `<VoiceSingletonHooks />` has to be mounted above this or every
 * hook quietly returns its initial value — so the copy beside it says that
 * instead of hoping somebody clicks through.
 */
const VOICE_EXAMPLE = `import { SFUConnectionState, useSFU } from "@gryt/voice";

function JoinButton({ channelId }: { channelId: string }) {
  const { connect, disconnect, connectionState } = useSFU();

  if (connectionState === SFUConnectionState.CONNECTED) {
    return <button onClick={() => disconnect()}>Leave</button>;
  }
  return <button onClick={() => connect(channelId)}>Join</button>;
}`;

/** The three components rendered above it, as they are written there. */
const UI_EXAMPLE = `import { Avatar, Button, Chip } from "@gryt/ui";

<Avatar seed="nora" alt="" size="small" />
<Chip label="42 ms" tone="success" />
<Button size="small">Send</Button>`;

/** Thirteen repositories, and the one flag that gets all of them. */
const CLONE = `git clone --recurse-submodules https://github.com/Gryt-chat/gryt.git`;

const BOTS: RowItem[] = [
  {
    name: "The support bot",
    detail: "A folder to copy: a Dockerfile, the compose file above, and a bot that answers out of a JSON file.",
    href: `${GH}/bot/tree/main/examples/support-bot`,
  },
  {
    name: "Writing a bot",
    detail: "The SDK in full: commands, events, attachments, and what a bot does when an admin says no.",
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
        lede="Six of the pieces Gryt is made of are on npm. The design system, the tokens and the owl avatars are MIT, so you can drop them into something that has nothing to do with Gryt. The bot SDK, the voice engine and the APIs are here too."
      />

      <p className={styles.intro}>
        An identity is a P-256 keypair that signs its own certificate. A server
        checks the signature instead of asking anyone, us included. There&rsquo;s
        no bot account type, no bot token, and no way for a bot to skip any of
        it. What a bot can do is whatever an admin agreed to, checked the same
        way it&rsquo;s checked for a person.
      </p>

      <Block
        heading="An owl from a name"
        note="Every avatar in Gryt is drawn from a nickname. The package that does it has no dependencies and never touches the network, so this page just runs it instead of showing you a picture. Type a name and both halves change."
      >
        <OwlPlayground />
      </Block>

      <Block
        heading="The packages"
        note="All six are used by the app you can download, and none of them needs a Gryt server to be useful. Four are MIT. The two AGPL ones only make sense pointed at Gryt anyway."
      >
        <PackageRows items={PACKAGES} />
      </Block>

      <Block heading="Bots">
        <p className={styles.blockNote}>
          A bot joins a server the same way any other client does. A key it
          holds, a certificate it signed itself, and a challenge-response over
          P-256. From the server&rsquo;s side it&rsquo;s just another member.
        </p>
        <ol className={styles.steps}>
          <li>
            It starts up knowing only the address, says what it&rsquo;s called
            and what it wants to be allowed to do, and gets turned away.
          </li>
          <li>
            It leaves a request behind. An admin opens{" "}
            <strong>Server settings → Bots</strong> and sees it.
          </li>
          <li>
            They untick anything they&rsquo;d rather it didn&rsquo;t have, and
            let it in.
          </li>
          <li>The approval reaches the bot without a restart. Leave it running.</li>
        </ol>
        <p className={styles.blockNote}>
          What a bot asks for on its first run is the only list it ever gets. A
          later run asking for more gets the answer the first one got. That
          isn&rsquo;t aimed at you. It&rsquo;s aimed at the run that isn&rsquo;t
          yours, after somebody takes over a published image. And if nobody is
          around for the first launch, like in a compose file or CI, an admin
          can decide it all up front and hand over a single-use token.
        </p>
        <Snippet label="bot.ts" code={BOT_EXAMPLE} />
        <p className={styles.blockNote}>
          <code>bot.can()</code> answers from what the server said, not from
          what you asked for. And it keeps up if an admin changes their mind
          while the bot is running.
        </p>
        <p className={styles.blockNote}>
          A bot runs as a container. The example below builds on its own,
          since <code>@gryt/bot</code> comes off npm like any other
          dependency.
        </p>
        <Snippet label="compose.yml" code={BOT_COMPOSE} />
        <p className={styles.blockNote}>
          <code>gryt-bot-identity.json</code> is the bot. The id the server
          knows it by comes from the key inside it. Keep that file on a volume
          and the bot keeps its permissions across restarts and upgrades. Lose
          it and the server sees a stranger knocking, holding nothing.
        </p>
        <p className={styles.blockNote}>
          Mounting the volume isn&rsquo;t enough by itself. By default that
          file is written next to the code, so the Dockerfile sets{" "}
          <code>GRYT_IDENTITY_PATH=/data/gryt-bot-identity.json</code> to put it
          on the volume instead. Without that line the bot works, keeps its
          identity across restarts, and loses it the next time you rebuild the
          image.
        </p>
        <LinkRows items={BOTS} />
      </Block>

      <Block heading="Addons">
        <p className={styles.blockNote}>
          An addon is a folder with an <code>addon.json</code> in it, loaded by
          the desktop app. A theme addon adds CSS. A plugin addon adds a module,
          and that module can talk to exactly one thing: an object on{" "}
          <code>window</code>.
        </p>
        <Snippet label="pluginApi.ts" code={PLUGIN_API} />
        <p className={styles.blockNote}>
          And that&rsquo;s all of it. No sandbox, no permission model, no
          registry, no docs page, and the plugin system is still down as planned
          on the roadmap. It&rsquo;s enough to restyle the client or bolt
          something small onto it. It isn&rsquo;t enough to build a product
          on.
        </p>
        <p className={styles.blockNote}>
          What it should turn into hasn&rsquo;t been decided yet. If you&rsquo;ve
          tried to write one, an issue saying what you needed is more use than a
          feature request.
        </p>
      </Block>

      <Block heading="The APIs">
        <p className={styles.blockNote}>
          Everything the apps use. The one call that needs nothing from you is{" "}
          <code>/info</code>, the join preview. It&rsquo;s open on purpose,
          because a client has to be able to tell you whether you need an
          account before you try.
        </p>
        <Snippet label="bash" code={INFO_REQUEST} shell />
        <Snippet label="json" code={INFO_RESPONSE} />
        <p className={styles.blockNote}>
          A server with discovery turned off answers 404 to anyone who
          isn&rsquo;t already a member. The build number only comes back for
          members, because an open endpoint that names your exact version is a
          list of hosts for someone to scan.
        </p>
        <LinkRows items={APIS} />
      </Block>

      <Block
        heading="The voice engine"
        note="@gryt/voice is the calling half of Gryt with nothing else attached — signalling, ICE, tracks and audio behind a set of React hooks. It talks to a Gryt SFU, and that is the only Gryt piece it needs."
      >
        <Snippet label="JoinButton.tsx" code={VOICE_EXAMPLE} />
        <p className={styles.blockNote}>
          Two things have to be true above that, and both fail quietly.{" "}
          <code>&lt;VoiceSingletonHooks /&gt;</code> has to be mounted, or every
          singleton hook just hands back its starting value while the app builds
          and launches like normal. And Vite has to leave the package alone with{" "}
          <code>optimizeDeps.exclude</code>, or the RNNoise worker looks for
          itself somewhere it isn&rsquo;t and you ship without noise
          suppression.
        </p>
        <LinkRows items={VOICE} />
      </Block>

      <Block
        heading="The design system"
        note="One set of tokens, two renderers, and a generator that turns a palette into a link. These three come straight out of the published package and are drawn here, picking up this page's colours as they go."
      >
        <div className={styles.sampleStage}>
          <Avatar seed="nora" alt="" size="small" />
          <Chip label="42 ms" tone="success" />
          <Button size="small">Send</Button>
        </div>
        <Snippet label="app.tsx" code={UI_EXAMPLE} />
        <LinkRows items={DESIGN} />
      </Block>

      <Block
        heading="The source"
        note="One superproject with the rest as submodules, each with its own CI and its own releases. The flag isn't optional. Without it you get thirteen empty folders."
      >
        <Snippet label="bash" code={CLONE} shell />
        <LinkRows items={SOURCE} />
      </Block>

      <section className={styles.tail}>
        <p className={styles.tailText}>
          If you&rsquo;re here to run a server rather than build on one,
          the{" "}
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
