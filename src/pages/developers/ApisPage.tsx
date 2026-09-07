import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/** The APIs, lifted out of the old one-page `/developers` (GRYT-956). */
const DOCS = "https://docs.gryt.chat/docs";

/**
 * The first call anybody makes against a Gryt server, and what comes back.
 *
 * `/info` is the join preview and it is deliberately unauthenticated: a client
 * has to be able to say "you do not need an account for this one" before
 * anybody tries.
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

const ROWS: RowItem[] = [
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

export function ApisPage() {
  return (
    <DevSubPage
      eyebrow="Take a piece"
      title="The APIs"
      lede="Everything the apps use. The one call that needs nothing from you is /info, the join preview — it's open on purpose, because a client has to be able to tell you whether you need an account before you try."
    >
      <Snippet label="bash" code={INFO_REQUEST} shell />
      <Snippet label="json" code={INFO_RESPONSE} />

      <p className={styles.blockNote}>
        A server with discovery turned off answers 404 to anyone who isn&rsquo;t
        already a member. The build number only comes back for members, because
        an open endpoint that names your exact version is a list of hosts for
        someone to scan.
      </p>

      <p className={styles.blockNote}>
        An identity is a P-256 keypair that signs its own certificate. A server
        checks the signature instead of asking anyone, us included. That is the
        same handshake a person, a bot and another server all use — there is no
        second path.
      </p>

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
