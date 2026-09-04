import styles from "./sketches.module.css";

/**
 * Drawings that stand where a capture will go, and drawings that are the
 * finished thing.
 *
 * These are **diagrams, not screenshots.** The standing rule in design.md bans
 * hand-built fake window chrome. An SVG pretending to be the emoji importer
 * would be a picture of a UI that exists, drawn by somebody who was not looking
 * at it, and it would go stale the first time the real one moved. Each of these
 * carries the *shape* of what happens instead.
 *
 * Everything is drawn in `currentColor` and two CSS variables, so they follow
 * the theme rather than carrying a palette of their own.
 */
export function Frame({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className={styles.frame}>
      <div className={styles.art}>{children}</div>
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}

/**
 * What a file runs into on the way up, and who set it.
 *
 * The numbers are the shipped default and the two ceilings above it, which is
 * the whole point of the block this sits beside.
 */
export function UploadSketch() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="A file being uploaded past the shipped 100 MB default towards the storage ceiling, with the server owner setting the limit"
    >
      {/* the file */}
      <rect x="22" y="74" width="66" height="52" rx="8" className={styles.panel} />
      <path d="M74 74v14h14" className={styles.wire} />
      <rect x="34" y="98" width="42" height="7" rx="3.5" className={styles.bar} />
      <rect x="34" y="110" width="28" height="7" rx="3.5" className={styles.barDim} />

      {/* the run */}
      <path d="M96 100h58" className={styles.wire} />
      <path d="M148 95l6 5-6 5" className={styles.wire} />

      {/* the gate the owner sets */}
      <rect x="162" y="52" width="30" height="96" rx="8" className={styles.gate} />
      <text x="177" y="42" className={styles.smallCentre}>
        the limit
      </text>
      <text x="177" y="166" className={styles.smallCentreDim}>
        set by whoever
      </text>
      <text x="177" y="180" className={styles.smallCentreDim}>
        runs the server
      </text>

      <path d="M200 100h30" className={styles.wire} />
      <path d="M224 95l6 5-6 5" className={styles.wire} />

      {/* the scale beyond it. The labels are short on purpose — 320 units is
          all there is, and a longer word here ran off the right edge. */}
      <line x1="238" y1="60" x2="238" y2="140" className={styles.axis} />
      <circle cx="238" cy="124" r="4" className={styles.dot} />
      <text x="250" y="128" className={styles.small}>
        100 MB
      </text>
      <text x="250" y="142" className={styles.smallDim}>
        ships here
      </text>
      <circle cx="238" cy="74" r="4" className={styles.dotDim} />
      <text x="250" y="78" className={styles.small}>
        5 TB
      </text>
      <text x="250" y="92" className={styles.smallDim}>
        the disk&rsquo;s
      </text>
    </svg>
  );
}

/**
 * An identity sitting in a password manager, as an entry.
 *
 * Not a picture of 1Password or of Gryt. **The value is drawn as dots rather
 * than as words**: a page showing something that looks like a real recovery
 * phrase is a page teaching people to read one off a screen.
 *
 * `guide/accounts.mdx` and the 1.6.0 post are the source — the seed is 24
 * BIP-39 words, and the field you paste them back into is a real password
 * field, which is what makes a manager offer to fill it.
 */
export function VaultSketch() {
  const dots = Array.from({ length: 6 }, (_, i) => i);
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="A password manager entry named Gryt, holding a 24-word recovery phrase as a hidden value with a copy button beside it"
    >
      {/* the entry */}
      <rect x="20" y="24" width="280" height="152" rx="14" className={styles.panel} />

      {/* the header: a lock, a name, a site */}
      <rect x="36" y="42" width="30" height="30" rx="9" className={styles.gate} />
      <path
        d="M45 57v-3a6 6 0 0 1 12 0v3"
        className={styles.wire}
        style={{ strokeWidth: 2 }}
      />
      <rect x="44" y="56" width="14" height="11" rx="3" className={styles.dot} />
      <text x="76" y="55" className={styles.smallStrong}>
        Gryt
      </text>
      <text x="76" y="69" className={styles.smallDim}>
        gryt.chat
      </text>

      <line x1="36" y1="86" x2="284" y2="86" className={styles.axis} />

      {/* the value you cannot read */}
      <text x="36" y="108" className={styles.smallDim}>
        Recovery phrase
      </text>
      <rect x="36" y="116" width="196" height="30" rx="9" className={styles.field} />
      {dots.map((i) => (
        <g key={i}>
          {[0, 1, 2, 3].map((d) => (
            <circle
              key={d}
              cx={50 + i * 30 + d * 6}
              cy={131}
              r="2.4"
              className={styles.dotDim}
            />
          ))}
        </g>
      ))}

      {/* the button that does the only thing you need */}
      <rect x="240" y="116" width="44" height="30" rx="9" className={styles.pill} />
      <text x="252" y="135" className={styles.pillText}>
        Copy
      </text>

      <text x="36" y="164" className={styles.smallDim}>
        24 words. Paste it on the next machine.
      </text>
    </svg>
  );
}

/**
 * The four things a Gryt server is, and the two ways in.
 *
 * Two drawings, one shown at a time. A 640-unit viewBox scaled into a 330px
 * phone column puts the labels at about six pixels, so the narrow one stacks
 * the boxes and brings the arrows in from the left instead.
 *
 * The facts are `ops/deploy/compose/prod.yml`: the Node server (SQLite inside
 * it, no database container), the Go SFU, MinIO standing in for any
 * S3-compatible storage, and the image worker.
 *
 * The asymmetry is the point. One arrow is ordinary web traffic that a reverse
 * proxy or a tunnel will carry; the other is UDP that nothing can carry for
 * you, which is the fact that costs people an evening when they miss it.
 */
function StackSketchWide() {
  return (
    <svg
      className={`${styles.svg} ${styles.wide}`}
      viewBox="0 0 640 226"
      role="img"
      aria-label="One machine running four services — a Node server, a Go voice server, S3-compatible storage and an image worker. Web traffic reaches the server through a proxy; voice reaches the voice server directly over UDP port 3478."
    >
      {/* the way in for everything that is not voice */}
      <path d="M14 88h130" className={styles.wire} />
      <path d="M138 83l6 5-6 5" className={styles.wire} />
      <text x="14" y="78" className={styles.small}>
        HTTPS &middot; WebSocket
      </text>
      <text x="14" y="106" className={styles.smallDim}>
        put a proxy on it
      </text>

      {/* and the way in that nothing else can carry */}
      <path d="M14 164h130" className={styles.arc} />
      <path d="M138 159l6 5-6 5" className={styles.arc} />
      <text x="14" y="154" className={styles.small}>
        UDP 3478
      </text>
      <text x="14" y="182" className={styles.smallDim}>
        straight through
      </text>

      {/* one box round the lot, because it is one compose file */}
      <rect x="136" y="20" width="488" height="190" rx="16" className={styles.boundary} />
      <text x="152" y="42" className={styles.smallDim}>
        one machine, one docker compose up
      </text>

      <rect x="152" y="56" width="214" height="64" rx="10" className={styles.panel} />
      <text x="166" y="82" className={styles.smallStrong}>
        Server
      </text>
      <text x="166" y="100" className={styles.small}>
        Node. Accounts, channels,
      </text>
      <text x="166" y="113" className={styles.small}>
        messages, uploads.
      </text>

      <rect x="394" y="56" width="214" height="64" rx="10" className={styles.panel} />
      <text x="408" y="82" className={styles.smallStrong}>
        Storage
      </text>
      <text x="408" y="100" className={styles.small}>
        Any S3-compatible bucket.
      </text>
      <text x="408" y="113" className={styles.small}>
        MinIO in the compose file.
      </text>

      <rect x="152" y="132" width="214" height="64" rx="10" className={styles.panel} />
      <text x="166" y="158" className={styles.smallStrong}>
        Voice server
      </text>
      <text x="166" y="176" className={styles.small}>
        Go. Routes audio and video
      </text>
      <text x="166" y="189" className={styles.small}>
        between people in a call.
      </text>

      <rect x="394" y="132" width="214" height="64" rx="10" className={styles.panel} />
      <text x="408" y="158" className={styles.smallStrong}>
        Image worker
      </text>
      <text x="408" y="176" className={styles.small}>
        Resizes what people upload:
      </text>
      <text x="408" y="189" className={styles.small}>
        avatars, emoji, thumbnails.
      </text>
    </svg>
  );
}

function StackSketchNarrow() {
  return (
    <svg
      className={`${styles.svg} ${styles.narrow}`}
      viewBox="0 0 340 392"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M8 80h100" className={styles.wire} />
      <path d="M102 75l6 5-6 5" className={styles.wire} />
      <text x="8" y="70" className={styles.small}>
        HTTPS &middot; WebSocket
      </text>
      <text x="8" y="96" className={styles.smallDim}>
        put a proxy on it
      </text>

      <path d="M8 164h100" className={styles.arc} />
      <path d="M102 159l6 5-6 5" className={styles.arc} />
      <text x="8" y="154" className={styles.small}>
        UDP 3478
      </text>
      <text x="8" y="180" className={styles.smallDim}>
        straight through
      </text>

      <rect x="104" y="14" width="228" height="364" rx="14" className={styles.boundary} />
      <text x="116" y="32" className={styles.smallDim}>
        one machine
      </text>

      <rect x="116" y="44" width="204" height="72" rx="10" className={styles.panel} />
      <text x="130" y="70" className={styles.smallStrong}>
        Server
      </text>
      <text x="130" y="88" className={styles.small}>
        Node. Accounts, channels,
      </text>
      <text x="130" y="101" className={styles.small}>
        messages, uploads.
      </text>

      <rect x="116" y="128" width="204" height="72" rx="10" className={styles.panel} />
      <text x="130" y="154" className={styles.smallStrong}>
        Voice server
      </text>
      <text x="130" y="172" className={styles.small}>
        Go. Routes audio and video
      </text>
      <text x="130" y="185" className={styles.small}>
        between people in a call.
      </text>

      <rect x="116" y="212" width="204" height="72" rx="10" className={styles.panel} />
      <text x="130" y="238" className={styles.smallStrong}>
        Storage
      </text>
      <text x="130" y="256" className={styles.small}>
        Any S3-compatible bucket.
      </text>
      <text x="130" y="269" className={styles.small}>
        MinIO in the compose file.
      </text>

      <rect x="116" y="296" width="204" height="72" rx="10" className={styles.panel} />
      <text x="130" y="322" className={styles.smallStrong}>
        Image worker
      </text>
      <text x="130" y="340" className={styles.small}>
        Resizes what people upload:
      </text>
      <text x="130" y="353" className={styles.small}>
        avatars, emoji, thumbnails.
      </text>
    </svg>
  );
}

/**
 * The pair. Only one is ever visible, and only the wide one carries the
 * description — two `img` roles saying the same thing is one screen reader
 * announcement too many, and CSS `display: none` is not something the
 * accessibility tree is guaranteed to agree about across breakpoints.
 */
export function StackSketch() {
  return (
    <>
      <StackSketchWide />
      <StackSketchNarrow />
    </>
  );
}

/**
 * What an addon is, and the one door a plugin gets.
 *
 * The facts are `packages/client/src/packages/addons/src`. `AddonManifest` in
 * `types.ts` has `styles` for a theme and `main` for a plugin, and
 * `useAddonLoader` injects the first and imports the second. `pluginApi.ts` is
 * the door: `version`, `theme`, and `on("themeChange")`, hung on `window.gryt`.
 * Three members, and nothing else on the object.
 *
 * A theme's CSS arrow lands on the app itself; a plugin's module lands on the
 * door, because the door is all it gets. No `main` file is drawn holding a
 * network call, a filesystem or a message, because it cannot have one. **If the
 * plugin API grows, this drawing has to grow with it.**
 */
export function AddonSketch() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="An addon folder holding addon.json with a styles entry for a theme and a main entry for a plugin. The theme's CSS goes into the client; the plugin's module reaches one object on window, holding a version, the current theme, and a themeChange event."
    >
      {/* what you write */}
      <rect x="14" y="28" width="118" height="144" rx="12" className={styles.panel} />
      <text x="28" y="50" className={styles.smallStrong}>
        Your folder
      </text>
      <line x1="28" y1="60" x2="118" y2="60" className={styles.axis} />

      <text x="28" y="78" className={styles.mono}>
        addon.json
      </text>

      <rect x="28" y="88" width="90" height="34" rx="9" className={styles.field} />
      <text x="38" y="104" className={styles.mono}>
        styles[]
      </text>
      <text x="38" y="116" className={styles.smallDim}>
        a theme
      </text>

      <rect x="28" y="128" width="90" height="34" rx="9" className={styles.field} />
      <text x="38" y="144" className={styles.mono}>
        main
      </text>
      <text x="38" y="156" className={styles.smallDim}>
        a plugin
      </text>

      {/* the client, and the one door in it */}
      <rect x="176" y="28" width="130" height="144" rx="12" className={styles.panel} />
      <text x="190" y="50" className={styles.smallStrong}>
        The client
      </text>
      <text x="190" y="70" className={styles.mono}>
        window.gryt
      </text>

      <rect x="188" y="80" width="106" height="76" rx="10" className={styles.gate} />
      <text x="200" y="102" className={styles.small}>
        version
      </text>
      <text x="200" y="122" className={styles.small}>
        theme
      </text>
      <text x="200" y="142" className={styles.small}>
        themeChange
      </text>

      {/* CSS goes into the client. A module gets the door and nothing else. */}
      <path d="M124 105h52" className={styles.wire} />
      <path d="M170 100l6 5-6 5" className={styles.wire} />
      <path d="M124 145h64" className={styles.arc} />
      <path d="M182 140l6 5-6 5" className={styles.arc} />
    </svg>
  );
}

/**
 * What talks to what, on /why-gryt.
 *
 * **Do not put mermaid back.** It was in the bundle for this one graph, its
 * labels cannot hold spaces without quoting so the page shipped
 * `Signaling_server` and `Object_storage` to readers, and it drew its own
 * bordered box in its own colours on a site whose front page repaints from the
 * theme.
 *
 * A client talks to the server for chat and uploads and to the SFU for media,
 * the server owns the database and the object store, and identity hangs off the
 * side because a guest never touches it. The dashed boundary is that last part.
 */
function ArchitectureWide() {
  return (
    <svg
      className={`${styles.svg} ${styles.wide}`}
      viewBox="0 0 440 300"
      role="img"
      aria-label="You talk to the client. The client talks to the server for chat and uploads, and to the voice server for voice and video. The server owns the database and the file storage. Signing in and certificates sit apart, dashed, because a guest never uses them."
    >
      {/* you, and the app in front of you */}
      <rect x="12" y="112" width="60" height="40" rx="10" className={styles.field} />
      <text x="42" y="136" className={styles.smallCentre}>
        You
      </text>

      <rect x="96" y="98" width="92" height="68" rx="12" className={styles.panel} />
      <text x="142" y="126" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Client
      </text>
      <text x="142" y="142" className={styles.smallCentreDim}>
        app or browser
      </text>

      <path d="M74 132h16" className={styles.wire} />
      <path d="M84 127l6 5-6 5" className={styles.wire} />

      {/* the two things it talks to */}
      <rect x="232" y="40" width="104" height="60" rx="12" className={styles.panel} />
      <text x="284" y="66" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Server
      </text>
      <text x="284" y="82" className={styles.smallCentreDim}>
        chat and uploads
      </text>

      <rect x="232" y="164" width="104" height="60" rx="12" className={styles.panel} />
      <text x="284" y="190" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Voice server
      </text>
      <text x="284" y="206" className={styles.smallCentreDim}>
        voice and video
      </text>

      <path d="M190 120C210 120 212 74 226 72" className={styles.wire} />
      <path d="M220 67l6 5-6 5" className={styles.wire} />
      <path d="M190 144C210 144 212 190 226 192" className={styles.wire} />
      <path d="M220 187l6 5-6 5" className={styles.wire} />

      {/* what the server keeps */}
      <rect x="356" y="34" width="72" height="30" rx="9" className={styles.field} />
      <text x="392" y="53" className={styles.smallCentre}>
        Database
      </text>
      <rect x="356" y="76" width="72" height="30" rx="9" className={styles.field} />
      <text x="392" y="95" className={styles.smallCentre}>
        Files
      </text>
      <path d="M338 60h12" className={styles.wire} />
      <path d="M344 55l6 5-6 5" className={styles.wire} />
      <path d="M338 84h12" className={styles.wire} />
      <path d="M344 79l6 5-6 5" className={styles.wire} />

      {/* the half a guest never touches */}
      <rect x="272" y="248" width="160" height="44" rx="12" className={styles.boundary} />
      <text x="352" y="266" className={styles.smallCentreDim}>
        Signing in, certificates
      </text>
      <text x="352" y="282" className={styles.smallCentreDim}>
        not used by guests
      </text>

      {/* Both dashed lines start where the optional thing is actually asked
          for: the client signs you in, and the server checks the certificate.
          The voice server is not on either path, so nothing touches it. */}
      <path d="M142 170v102h130" className={styles.boundary} />
      <path d="M344 102v146" className={styles.boundary} />
    </svg>
  );
}

/**
 * The same drawing for a phone, stacked into one column.
 *
 * The wide one draws two dashed lines into the optional half, because the
 * client asks for the sign-in and the server checks the certificate. Two dashed
 * lines down a 320-unit column cross the boxes they are meant to avoid, so this
 * one draws a single connector and the group says both halves in words.
 */
function ArchitectureNarrow() {
  return (
    <svg
      className={`${styles.svg} ${styles.narrow}`}
      viewBox="0 0 320 400"
      role="presentation"
      aria-hidden="true"
    >
      <rect x="110" y="6" width="100" height="30" rx="9" className={styles.field} />
      <text x="160" y="26" className={styles.smallCentre}>
        You
      </text>
      <path d="M160 36v10" className={styles.wire} />
      <path d="M155 42l5 6 5-6" className={styles.wire} />

      <rect x="88" y="52" width="144" height="50" rx="12" className={styles.panel} />
      <text x="160" y="74" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Client
      </text>
      <text x="160" y="90" className={styles.smallCentreDim}>
        app or browser
      </text>
      <path d="M160 102v16" className={styles.wire} />
      <path d="M155 114l5 6 5-6" className={styles.wire} />

      <rect x="48" y="126" width="224" height="48" rx="12" className={styles.panel} />
      <text x="160" y="148" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Server
      </text>
      <text x="160" y="164" className={styles.smallCentreDim}>
        chat and uploads
      </text>

      <rect x="48" y="192" width="106" height="28" rx="9" className={styles.field} />
      <text x="101" y="210" className={styles.smallCentre}>
        Database
      </text>
      <rect x="166" y="192" width="106" height="28" rx="9" className={styles.field} />
      <text x="219" y="210" className={styles.smallCentre}>
        Files
      </text>
      <path d="M101 174v10" className={styles.wire} />
      <path d="M96 180l5 6 5-6" className={styles.wire} />
      <path d="M219 174v10" className={styles.wire} />
      <path d="M214 180l5 6 5-6" className={styles.wire} />

      <rect x="48" y="244" width="224" height="48" rx="12" className={styles.panel} />
      <text x="160" y="266" className={styles.smallCentre} style={{ fontWeight: 700 }}>
        Voice server
      </text>
      <text x="160" y="282" className={styles.smallCentreDim}>
        voice and video
      </text>
      <path d="M88 78H24v190h18" className={styles.wire} />
      <path d="M36 263l6 5-6 5" className={styles.wire} />

      <rect x="40" y="330" width="240" height="52" rx="12" className={styles.boundary} />
      <text x="160" y="350" className={styles.smallCentreDim}>
        Signing in, certificates
      </text>
      <text x="160" y="366" className={styles.smallCentreDim}>
        the client asks, the server checks
      </text>
      <path d="M232 78h64v274h-16" className={styles.boundary} />
    </svg>
  );
}

/**
 * The pair. Only the wide one carries the description, for the reason
 * `StackSketch` gives: two `img` roles saying the same thing is one screen
 * reader announcement too many, and `display: none` is not something the
 * accessibility tree is guaranteed to agree about across breakpoints.
 */
export function ArchitectureSketch() {
  return (
    <>
      <ArchitectureWide />
      <ArchitectureNarrow />
    </>
  );
}
