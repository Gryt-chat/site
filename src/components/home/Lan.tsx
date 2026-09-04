import { Avatar, Button, Chip, Surface } from "@gryt/ui";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PiBroadcastFill } from "react-icons/pi";

import { Clip, type ClipSet } from "../Clip";
import { Showcase } from "../Showcase";
import styles from "./Lan.module.css";

/**
 * LAN discovery, and the limit on it.
 *
 * `packages/client/electron/lanDiscovery.ts` — mDNS, merged on the instance
 * name. **It lives under `electron/`, so this is the desktop app doing the
 * looking** and the section has to say so rather than implying a browser tab
 * can. The server side is the "Discoverable on LAN" switch, documented in
 * deployment/embedded.
 *
 * The clip this is waiting for needs two machines and `SHOTLIST.md` has the
 * recipe. Until it exists the section renders `Pane` below.
 */
const LAN: ClipSet | null = null;

const SHOWS =
  "A Gryt server started on one machine appearing by itself in the server " +
  "list on another machine on the same network";

const DOCS = "https://docs.gryt.chat/docs/deployment/embedded";

/**
 * The discovery pane, built from the components the client builds it from.
 *
 * `packages/client/src/components/discovery.tsx` is the original, and
 * `Surface`, `Avatar`, `Chip` and `Button` all come from `@gryt/ui` — so this
 * is that pane at a different width rather than a drawing of it.
 *
 * The icons are DiceBear Planets seeded on each server's name, Planets because
 * a server is not a person and CC0 so no deployment inherits an attribution
 * obligation. They are **rendered once and committed** under
 * `public/home/servers/` rather than generated in the browser: `@dicebear/core`
 * plus the Planets definition is about 80 kB for four decorative icons, and the
 * output is identical either way.
 *
 * The fourth arrives on a timer, once, when the pane is first on screen, and
 * not at all under reduced motion.
 */
const FOUND = [
  { name: "Gryta Krutt", addr: "192.168.1.24:5000", icon: "gryta-krutt" },
  { name: "The Basement", addr: "192.168.1.31:5000", icon: "the-basement" },
  { name: "Studio", addr: "192.168.1.8:5000", icon: "studio" },
];

const ARRIVES = {
  name: "LAN Party",
  addr: "192.168.1.42:5000",
  icon: "lan-party",
};

const ARRIVES_AFTER_MS = 1600;

function Pane() {
  const reduced = useReducedMotion() ?? false;
  const [seen, setSeen] = useState(false);
  const [waited, setWaited] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || reduced) return;
    const id = window.setTimeout(() => setWaited(true), ARRIVES_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [seen, reduced]);

  /* Derived rather than a second piece of state set from an effect. Reduced
     motion gets the finished pane the moment it is on screen: the point is
     what is in it, not the way the last one got there. */
  const arrived = reduced ? seen : waited;
  const list = arrived ? [...FOUND, ARRIVES] : FOUND;

  return (
    <div className={styles.pane} ref={ref}>
      <div className={styles.paneHead}>
        <span className={styles.broadcast} aria-hidden="true">
          <PiBroadcastFill size={13} />
        </span>
        <span className={styles.paneTitle}>On your network</span>
        <span className={styles.paneCount}>
          {list.length} found
        </span>
      </div>

      {/* 260 rather than the client's 280: the column this sits in is about
          616px, and 280 leaves two cards touching. */}
      <ul className={styles.grid}>
        {list.map((s) => {
          const isNew = arrived && s.name === ARRIVES.name;
          return (
            <li key={s.name} data-new={isNew || undefined}>
              <Surface className={styles.card}>
                <Avatar
                  className={styles.icon}
                  src={`/home/servers/${s.icon}.svg`}
                  alt=""
                />
                <span className={styles.meta}>
                  <span className={styles.name}>
                    <span className={styles.nameText}>{s.name}</span>
                    {isNew && <Chip tone="primary" label="New" />}
                  </span>
                  <span className={styles.addr}>{s.addr}</span>
                </span>
                <Button size="xsmall" className={styles.join}>
                  Join
                </Button>
              </Surface>
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        The pane from the app, built here from the same parts. Nobody on this
        page is on your network. These four are made up.
      </p>
    </div>
  );
}

export function Lan() {
  return (
    <Showcase
      id="lan"
      side="left"
      size="regular"
      eyebrow="On your network"
      title="Nobody types an address."
      media={
        LAN ? (
          <Clip {...LAN} alt={SHOWS} width={960} height={720} />
        ) : (
          <Pane />
        )
      }
      mediaCaption={LAN ? "A server started on one machine, appearing on another." : undefined}
    >
      <p>
        Start a server on your machine and everyone else on the network just
        sees it appear in their list. No address to read out, no invite link to
        send round. It's mDNS, the same thing that finds your printer.
      </p>
      <p>
        The desktop app is the one doing the looking, so a browser tab won't
        find anything this way. The server has a switch for it and it's on by
        default.{" "}
        <a href={DOCS} target="_blank" rel="noreferrer">
          Hosting from the app
        </a>
        .
      </p>
    </Showcase>
  );
}
