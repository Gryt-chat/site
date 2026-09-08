import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PiBracketsCurlyFill,
  PiGitPullRequestFill,
  PiHardDrivesFill,
  PiMapTrifoldFill,
  PiPaletteFill,
  PiPlugsFill,
  PiRobotFill,
  PiSparkleFill,
  PiWaveformFill,
} from "react-icons/pi";

import { DevArchitecture } from "../components/DevArchitecture";
import { CardGrid, type DevCard, GroupHead } from "../components/DevCards";
import { PageHeader } from "../components/PageHeader";
import { pageTitle } from "../lib/title";
import styles from "../styles/audience.module.css";
import hub from "../styles/devHub.module.css";

/**
 * The front door for somebody who writes code (GRYT-956). A hub: the six sections that were
 * mostly rows are pages of their own. The card budget is spent here and nowhere else.
 */
const DOCS = "https://docs.gryt.chat/docs";
const NPM = "https://www.npmjs.com/package";
const GH = "https://github.com/Gryt-chat";

/** What Gryt has for you. None of these needs a Gryt server to be useful. */
const TAKE: DevCard[] = [
  {
    icon: PiPaletteFill,
    title: "The design system",
    detail:
      "One set of tokens, two renderers, and a generator that turns a palette into a link.",
    go: "@gryt/ui",
    href: "/developers/design-system",
  },
  {
    icon: PiWaveformFill,
    title: "Voice in your own app",
    detail:
      "Signalling, ICE, tracks and audio behind React hooks. It needs an SFU and nothing else.",
    go: "@gryt/voice",
    href: "/developers/voice",
  },
  {
    icon: PiBracketsCurlyFill,
    title: "The APIs",
    detail:
      "Every REST endpoint and socket event, the SFU protocol, and how a server decides a key is who it says.",
    go: "Reference",
    href: "/developers/apis",
  },
];

/** Your code, running beside Gryt's. Each of these has an example to copy. */
const BUILD: DevCard[] = [
  {
    icon: PiRobotFill,
    title: "Build a bot",
    detail:
      "It joins like any other client — its own key, its own certificate, and whatever an admin agreed to.",
    go: "@gryt/bot",
    href: "/developers/bots",
  },
  {
    icon: PiPlugsFill,
    title: "Write an addon",
    detail:
      "A theme is CSS. A plugin runs in a worker of its own and can call what you ticked when you turned it on.",
    go: "Client addons",
    href: "/developers/addons",
  },
  {
    icon: PiHardDrivesFill,
    title: "Extend the server",
    detail:
      "A server plugin runs inside the process, with the database. Everybody who joins is told it is there.",
    go: "Server plugins",
    href: "/developers/plugins",
  },
];

/** The half that used to be one row inside "The source". */
const HELP: DevCard[] = [
  {
    icon: PiGitPullRequestFill,
    title: "Contribute a change",
    detail:
      "What the setup needs, how a change gets in, and what pull requests are and are not wanted for.",
    go: "Contributing",
    href: "/developers/contributing",
  },
  {
    icon: PiMapTrifoldFill,
    title: "What is wanted",
    detail:
      "The roadmap, and where a feature request goes so it lands somewhere it will be read.",
    go: "Roadmap",
    href: `${DOCS}/guide/roadmap`,
  },
  {
    icon: PiSparkleFill,
    title: "Get yours listed",
    detail:
      "Bots, addons and plugins people have made. Yours goes on the same list, by pull request.",
    go: "/built",
    href: "/built",
  },
];

/**
 * Six on npm, four of them MIT. A strip rather than a second card grid — two card grids in
 * a row is the thing `design.md` warns about.
 */
const PACKAGES: { name: string; licence: string; href: string }[] = [
  { name: "@gryt/ui", licence: "MIT", href: `${NPM}/@gryt/ui` },
  { name: "@gryt/ui-native", licence: "MIT", href: `${NPM}/@gryt/ui-native` },
  { name: "@gryt/theme", licence: "MIT", href: `${NPM}/@gryt/theme` },
  { name: "@gryt/owl", licence: "MIT", href: `${NPM}/@gryt/owl` },
  { name: "@gryt/voice", licence: "AGPL", href: `${NPM}/@gryt/voice` },
  { name: "@gryt/bot", licence: "AGPL", href: `${NPM}/@gryt/bot` },
];

export function DevelopersPage() {
  useEffect(() => {
    document.title = pageTitle("Developers");
  }, []);

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="For developers"
        title="Where your code goes."
        lede="Gryt is a client, a server and a media server. Four places take code of your own, six of the pieces are on npm, and the whole thing is one person's — so a pull request that fits is worth a lot."
      />

      <DevArchitecture />

      <GroupHead
        title="Take a piece"
        note="None of these needs a Gryt server to be useful. Four of the six packages are MIT and have nothing to do with chat."
      />
      <CardGrid items={TAKE} />

      <div className={hub.strip}>
        {PACKAGES.map((pkg) => (
          <a
            className={hub.chip}
            key={pkg.name}
            href={pkg.href}
            target="_blank"
            rel="noreferrer"
          >
            <b>{pkg.name}</b> · {pkg.licence}
          </a>
        ))}
      </div>

      <GroupHead
        title="Build on it"
        note="Your code, running beside Gryt's. Every one of these has an example in the repository to copy."
      />
      <CardGrid items={BUILD} />

      <GroupHead
        title="Help build Gryt"
        note="One person maintains this, with the AI policy published so you can audit what an agent touched."
      />
      <CardGrid items={HELP} />

      <p className={hub.tail}>
        Putting a server on a machine rather than building on one? That&rsquo;s{" "}
        <Link to="/self-hosting">self-hosting</Link>. Reading rather than
        installing? The source is{" "}
        <a href={`${GH}/gryt`} target="_blank" rel="noreferrer">
          thirteen repositories
        </a>
        , and{" "}
        <a href={`${DOCS}/guide/ai`} target="_blank" rel="noreferrer">
          how Gryt is built with AI
        </a>{" "}
        says which parts an agent may touch.
      </p>
    </main>
  );
}
