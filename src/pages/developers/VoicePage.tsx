import { DevSubPage } from "../../components/DevSubPage";
import { LinkRows, type RowItem } from "../../components/LinkRows";
import { Snippet } from "../../components/Snippet";
import styles from "../../styles/audience.module.css";

/** The voice engine, lifted out of the old one-page `/developers` (GRYT-956). */
const DOCS = "https://docs.gryt.chat/docs";

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

const ROWS: RowItem[] = [
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

export function VoicePage() {
  return (
    <DevSubPage
      eyebrow="Take a piece"
      title="The voice engine"
      lede="@gryt/voice is the calling half of Gryt with nothing else attached — signalling, ICE, tracks and audio behind a set of React hooks. It talks to a Gryt SFU, and that is the only Gryt piece it needs."
    >
      <Snippet label="JoinButton.tsx" code={VOICE_EXAMPLE} />

      <p className={styles.blockNote}>
        Two things have to be true above that, and both fail quietly.{" "}
        <code>&lt;VoiceSingletonHooks /&gt;</code> has to be mounted, or every
        singleton hook just hands back its starting value while the app builds
        and launches like normal. And Vite has to leave the package alone with{" "}
        <code>optimizeDeps.exclude</code>, or the RNNoise worker looks for
        itself somewhere it isn&rsquo;t and you ship without noise suppression.
      </p>

      <p className={styles.blockNote}>
        The package is AGPL. It only makes sense pointed at a Gryt SFU anyway,
        so the licence is not the thing standing between you and using it — the
        SFU is a separate Go service and you would be running one.
      </p>

      <LinkRows items={ROWS} />
    </DevSubPage>
  );
}
