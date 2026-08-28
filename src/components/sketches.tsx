import styles from "./sketches.module.css";

/**
 * Drawings that stand where a capture will go, and drawings that are the
 * finished thing.
 *
 * These were under `home/` while the front page was the only page with any.
 * `/self-hosting` needed one too, and a diagram vocabulary that lives inside
 * one page's folder is one that the next page quietly re-invents.
 *
 * These are **diagrams, not screenshots.** The standing rule in design.md bans
 * hand-built fake window chrome, and it means it — an SVG pretending to be the
 * emoji importer would be a picture of a UI that exists, drawn by somebody who
 * was not looking at it, and it would go stale the first time the real one
 * moved. So each of these carries the *shape* of what happens: a link goes in,
 * a list comes back, you tick some of it. Nobody will mistake one for the app.
 *
 * They are also not placeholders in the "coming soon" sense. Each one is a
 * finished thing that says something true, and it stays useful beside a clip
 * rather than being deleted when one arrives.
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
 * Not a picture of 1Password or of Gryt: a password manager entry is a shape
 * everyone recognises — a name, a site, a value you cannot read, a button that
 * copies it — and that shape is the whole claim. The value is drawn as dots
 * rather than as words, because a page showing something that looks like a real
 * recovery phrase is a page teaching people to read one off a screen.
 *
 * `guide/accounts.mdx` and the 1.6.0 post are the source: the seed is 24 BIP-39
 * words, and the field you paste them back into is a real password field, which
 * is what makes a manager offer to fill it.
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
 * phone column puts the labels at about six pixels, which is a diagram nobody
 * can read pretending to be one they can — and the alternative, a diagram that
 * scrolls sideways, is worse on the device where sideways scrolling is how you
 * move through the page. So the boxes stack and the arrows come in from the
 * left in one column instead. Same facts, same vocabulary, laid out for the
 * width it is actually being drawn at.
 *
 * `/self-hosting` said this in a paragraph, and a paragraph is the wrong shape
 * for four boxes and two arrows. The facts are `ops/deploy/compose/prod.yml`:
 * the Node server (SQLite inside it, no database container), the Go SFU, MinIO
 * standing in for any S3-compatible storage, and the image worker.
 *
 * The asymmetry is the point of drawing it at all. One arrow is ordinary web
 * traffic that a reverse proxy or a tunnel will carry; the other is UDP that
 * nothing can carry for you, which is the single fact that costs people an
 * evening when they miss it.
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
