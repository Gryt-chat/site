import styles from "../styles/devHub.module.css";

/**
 * Where somebody else's code attaches to Gryt (GRYT-956). This goes stale the day the
 * architecture moves, which is the known cost. Drawn, so a theme change moves it too.
 */
export function DevArchitecture() {
  return (
    <div className={styles.diagramScroll}>
      <svg
        className={styles.diagram}
        viewBox="0 0 900 250"
        role="img"
        aria-label={
          "How Gryt fits together, and the four places your own code attaches. " +
          "The client, on the left, runs addons — a theme, or a plugin in a worker. " +
          "The server, in the middle, runs server plugins inside its own process with its database, " +
          "and a bot connects to it like any other client. " +
          "The voice server, on the right, is what @gryt/voice talks to. " +
          "The client and server speak over sockets; the server and voice server carry media."
        }
      >
        {/* ── The client ── */}
        <rect className={styles.dgPanel} x="18" y="52" width="228" height="120" rx="12" />
        <text className={styles.dgTitle} x="38" y="80">
          The client
        </text>
        <text className={styles.dgDetail} x="38" y="97">
          Desktop, web and phone
        </text>
        <rect className={styles.dgCore} x="38" y="112" width="188" height="46" rx="9" />
        <text className={styles.dgSlot} x="54" y="131">
          ADDON
        </text>
        <text className={styles.dgDetail} x="54" y="147">
          a theme, or a plugin in a worker
        </text>

        {/* ── The server ── */}
        <rect className={styles.dgPanel} x="336" y="52" width="228" height="120" rx="12" />
        <text className={styles.dgTitle} x="356" y="80">
          The server
        </text>
        <text className={styles.dgDetail} x="356" y="97">
          Yours, on your machine
        </text>
        <rect className={styles.dgCore} x="356" y="112" width="188" height="46" rx="9" />
        <text className={styles.dgSlot} x="372" y="131">
          SERVER PLUGIN
        </text>
        <text className={styles.dgDetail} x="372" y="147">
          the process, and the database
        </text>

        {/* ── The SFU ── */}
        <rect className={styles.dgPanel} x="654" y="52" width="228" height="120" rx="12" />
        <text className={styles.dgTitle} x="674" y="80">
          The voice server
        </text>
        <text className={styles.dgDetail} x="674" y="97">
          Go, on Pion. Relays media.
        </text>
        <rect className={styles.dgCore} x="674" y="112" width="188" height="46" rx="9" />
        <text className={styles.dgSlot} x="690" y="131">
          @GRYT/VOICE
        </text>
        <text className={styles.dgDetail} x="690" y="147">
          the calling half, on its own
        </text>

        {/* ── What talks to what ── */}
        <path className={styles.dgWireOn} d="M246 118h90" />
        <path className={styles.dgWire} d="M564 118h90" />
        <text className={styles.dgDetail} x="266" y="110">
          sockets
        </text>
        <text className={styles.dgDetail} x="586" y="110">
          media
        </text>

        {/* ── A bot, which is a client rather than a part of the server ── */}
        <rect className={styles.dgPanel} x="356" y="196" width="188" height="34" rx="9" />
        <text className={styles.dgSlot} x="372" y="217">
          A BOT
        </text>
        <text className={styles.dgDetail} x="418" y="217">
          joins like any other client
        </text>
        <path className={styles.dgWireOn} d="M450 172v24" />
      </svg>
    </div>
  );
}
