import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/**
 * Bots, lifted out of the old one-page `/developers` (GRYT-956).
 *
 * The content is that page's Bots block, unchanged — the four steps of the
 * knock, the SDK example, the compose file, and the paragraph about the
 * identity file that costs people an afternoon. It has room to grow here, which
 * is the reason for the split.
 */
const DOCS = "https://docs.gryt.chat/docs";
const GH = "https://github.com/Gryt-chat";

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
 * shell syntax rather than the thing being shown.
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

const ROWS: RowItem[] = [
  {
    name: "Two bots to copy",
    detail: "One file that answers a command, and a folder with a Dockerfile, a compose file and an FAQ.",
    href: `${GH}/bot/tree/main/examples`,
  },
  {
    name: "Writing a bot",
    detail: "The SDK in full: commands, events, attachments, and what a bot does when an admin says no.",
    href: `${DOCS}/bot`,
  },
  {
    name: "API reference",
    detail: "Everything @gryt/bot exports, generated from the source so it cannot drift.",
    href: `${DOCS}/bot/api-reference`,
  },
  {
    name: "Roles and permissions",
    detail: "The same permission set a bot is granted from. There is no separate bot permission model.",
    href: `${DOCS}/guide/roles`,
  },
];

export function BotsPage() {
  return (
    <DevSubPage
      eyebrow="Build on it"
      title="Bots"
      lede="A bot joins a server the same way any other client does — a key it holds, a certificate it signed itself, and a challenge-response over P-256. From the server's side it is just another member."
    >
      <p className={styles.blockNote}>
        There is no bot account type, no bot token, and no way for a bot to skip
        any of it. What a bot can do is whatever an admin agreed to, checked the
        same way it&rsquo;s checked for a person.
      </p>

      <ol className={styles.steps}>
        <li>
          It starts up knowing only the address, says what it&rsquo;s called and
          what it wants to be allowed to do, and gets turned away.
        </li>
        <li>
          It leaves a request behind. An admin opens{" "}
          <strong>Server settings → Bots</strong> and sees it.
        </li>
        <li>
          They untick anything they&rsquo;d rather it didn&rsquo;t have, and let
          it in.
        </li>
        <li>The approval reaches the bot without a restart. Leave it running.</li>
      </ol>

      <p className={styles.blockNote}>
        What a bot asks for on its first run is the only list it ever gets. A
        later run asking for more gets the answer the first one got. That
        isn&rsquo;t aimed at you. It&rsquo;s aimed at the run that isn&rsquo;t
        yours, after somebody takes over a published image. And if nobody is
        around for the first launch, like in a compose file or CI, an admin can
        decide it all up front and hand over a single-use token.
      </p>

      <Snippet label="bot.ts" code={BOT_EXAMPLE} />

      <p className={styles.blockNote}>
        <code>bot.can()</code> answers from what the server said, not from what
        you asked for. And it keeps up if an admin changes their mind while the
        bot is running.
      </p>

      <p className={styles.blockNote}>
        A bot runs as a container. The example below builds on its own, since{" "}
        <code>@gryt/bot</code> comes off npm like any other dependency.
      </p>

      <Snippet label="compose.yml" code={BOT_COMPOSE} />

      <p className={styles.blockNote}>
        <code>gryt-bot-identity.json</code> is the bot. The id the server knows
        it by comes from the key inside it. Keep that file on a volume and the
        bot keeps its permissions across restarts and upgrades. Lose it and the
        server sees a stranger knocking, holding nothing.
      </p>

      <p className={styles.blockNote}>
        Mounting the volume isn&rsquo;t enough by itself. By default the bot
        writes that file next to the code, and only the bot can move it.{" "}
        <code>identityPath</code> is an option on <code>GrytBot</code>, and the
        SDK reads no environment variables of its own. The example passes{" "}
        <code>process.env.GRYT_IDENTITY_PATH</code>, and its Dockerfile sets
        that to <code>/data/gryt-bot-identity.json</code>. Miss it and the bot
        works, keeps its identity across restarts, and loses it the next time
        you rebuild the image.
      </p>

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
