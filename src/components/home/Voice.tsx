import { avatarSeed, owlAvatarColour } from "@gryt/owl";
import { Avatar, Chip } from "@gryt/ui";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Clip, type ClipSet } from "../Clip";
import { inView, rise, stagger } from "./motion";
import { Frame, UploadSketch } from "../sketches";
import styles from "./Voice.module.css";

/**
 * Everything about voice in one section rather than four down the page.
 *
 * The panel is a demonstration, not a call. Everyone in it is a name and a
 * state, and the levels are made up on a timer — **the page says so under the
 * panel**, because implying a live room is the sort of claim the rest of this
 * page exists to avoid making.
 *
 * What is real is the drawing: `Avatar` is the component the client renders,
 * the owls come out of `@gryt/owl` on this machine, and the tile tint is
 * `owlAvatarColour` of the same seed, so an owl and its tile are one colour
 * rather than two that nearly match.
 */
interface Person {
  name: string;
  muted?: boolean;
  deafened?: boolean;
  sharing?: boolean;
}

const PEOPLE: Person[] = [
  { name: "sivert" },
  { name: "kasper", sharing: true },
  { name: "nora" },
  { name: "tobias", muted: true },
  { name: "ida", muted: true, deafened: true },
];

/**
 * A screen share as the people watching it see it.
 *
 * Sivert's capture, encoded the same way as the hero:
 *
 *   yarn encode:clips <source> screen-share \
 *     --width 2200 --fps 60 --av1-crf 30 --h264-crf 21
 *
 * This one is 60fps, not 120. The heading above it says sharing goes to 120,
 * and the clip is not proof of that — it is a share at the top of what a
 * browser can play back, standing in until a 120fps take exists. The constant
 * is named for what it is rather than for the claim it sits under, and the
 * caption says what the viewer is looking at rather than how many frames it
 * took to get there.
 */
const SHARE: ClipSet = {
  src: "/home/screen-share.mp4",
  av1: "/home/screen-share.av1.mp4",
  poster: "/home/screen-share.poster.webp",
};

const SHARE_SHOWS =
  "A shared screen filling the Gryt client as the main view, with the six " +
  "people in the call as a strip of tiles above it";

/**
 * Seven facts, and three of them are the ones Sivert picked out. The first is
 * split out because it frames the other six rather than being one of them.
 *
 * Read from source rather than from the docs:
 *   RNNoise, on this machine   client settings/hooks/useAudioSettings.ts
 *   restart survival           sfu sync_request, docs/sfu/index.mdx
 *   eSports mode               client settings/hooks/settingsSearch.ts
 *   one UDP port               sfu internal/config, ICE_UDP_MUX_PORT
 *
 * The last one is a single muxed port, 3478 unless it is changed — **not a
 * range**. /why-gryt said range until this pass, and was wrong.
 */
const LEAD: [string, string] = [
  "The voice server",
  "Ours. We wrote it from scratch in Go instead of renting one",
];

const FACTS = [
  ["Sound", "Opus at 48 kHz, in stereo, and it copes with dropped packets"],
  ["Quality", "Nothing gets re-encoded on the way, so nothing gets lost"],
  ["Noise", "RNNoise cleans up your mic, on your machine, not on a server"],
  [
    "If the server restarts",
    "You keep talking. Voice is its own connection to its own service, and when the server comes back it just asks who is still in the room",
  ],
  [
    "eSports mode",
    "128 kbps, Opus in 10 ms frames, push-to-talk on, every filter off",
  ],
  ["Network", "One UDP port to open, not a range. 3478, unless you change it"],
];

/** Smooth pseudo-levels. A ring that jumps reads as a blink, not as a voice. */
function useLevels(count: number, running: boolean) {
  const [levels, setLevels] = useState<number[]>(() => Array(count).fill(0));
  const phase = useRef(0);
  const silent = useMemo(() => Array(count).fill(0) as number[], [count]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      phase.current += 0.045;
      const t = phase.current;
      setLevels(
        Array.from({ length: count }, (_, i) => {
          // Three detuned sines per person, so nobody's mouth keeps time with
          // anybody else's.
          const a = Math.sin(t * (0.7 + i * 0.19) + i * 2.1);
          const b = Math.sin(t * (1.9 + i * 0.31) + i * 0.7);
          const c = Math.sin(t * 0.23 + i);
          return Math.max(0, ((a + b * 0.5 + c) / 2.5) * 100);
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, running]);

  // Silence is returned rather than written back into state: setting it in the
  // effect would be a second render for a value that is a function of `running`
  // already.
  return running ? levels : silent;
}

function Panel() {
  const reduced = useReducedMotion() ?? false;
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Nothing animates until the panel is on screen, and nothing animates at all
  // for somebody who asked for less motion — a ring pulsing forever off the
  // bottom of the viewport is work nobody sees.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const levels = useLevels(PEOPLE.length, seen && !reduced);

  const tints = useMemo(
    () => PEOPLE.map((p) => owlAvatarColour(avatarSeed(p.name) ?? p.name)),
    [],
  );

  return (
    <div className={styles.panel} ref={ref}>
      <div className={styles.panelHead}>
        <span className={styles.channel}>General</span>
        <Chip label="42 ms" tone="success" />
      </div>

      <ul className={styles.tiles}>
        {PEOPLE.map((p, i) => {
          const level = p.muted ? 0 : (levels[i] ?? 0);
          const speaking = level > 22;
          return (
            <li
              key={p.name}
              className={styles.tile}
              style={
                {
                  "--tint": tints[i],
                  "--glow": speaking ? Math.min(1, level / 70) : 0,
                } as React.CSSProperties
              }
              data-speaking={speaking || undefined}
            >
              <span className={styles.ring}>
                <Avatar seed={avatarSeed(p.name) ?? p.name} alt="" size="medium" />
              </span>
              <span className={styles.who}>{p.name}</span>
              <span className={styles.marks}>
                {p.deafened && <span className={styles.mark}>deafened</span>}
                {p.muted && !p.deafened && <span className={styles.mark}>muted</span>}
                {p.sharing && <span className={styles.mark} data-share="">sharing</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Voice() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="voice">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Voice and sharing
        </motion.p>
        <motion.h2 className={styles.title} variants={rise(reduced)}>
          It sounds good, and it keeps up.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          Full-quality audio, a noise filter that runs on your own machine, and
          screen sharing fast enough to actually watch someone play. There's no
          better version you could be paying for. Whoever runs the server sets
          the limits, and they can turn them up.
        </motion.p>

        <motion.div className={styles.demo} variants={rise(reduced)}>
          <Panel />
          <p className={styles.note}>
            Built from the same parts as the app. The voices are on a timer.
            Nobody's really talking.
          </p>
        </motion.div>

        {/* Still a description list: every one of these is a term and what it
            means, and a card is a way of drawing that rather than a reason to
            stop saying it. */}
        <motion.dl className={styles.facts} variants={rise(reduced)}>
          <div className={`${styles.fact} ${styles.factLead}`}>
            <dt>{LEAD[0]}</dt>
            <dd>{LEAD[1]}</dd>
          </div>
          {FACTS.map(([k, v]) => (
            <div className={styles.fact} key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.h3 className={styles.subTitle} variants={rise(reduced)}>
          Share your screen at up to 120 frames a second.
        </motion.h3>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          Enough that a game still looks like the game. 30, 60, 90 and 120 are
          the normal settings. 144, 165 and 240 are there if you want to push
          it, up to 4K. Anything over 60 needs the Windows app, because it grabs
          the screen itself instead of going through the browser.
        </motion.p>

        {/* Directly under the claim it belongs to. It used to sit at the very
            bottom of the section, two headings away from the sentence about
            frame rate, where it read as a picture of the section rather than
            as the thing being described. */}
        <motion.figure className={styles.share} variants={rise(reduced)}>
          <Clip {...SHARE} alt={SHARE_SHOWS} width={2200} height={1238} />
          <figcaption>
            What everyone watching sees. Your screen is the main thing, and the
            people in the call sit in a strip above it.
          </figcaption>
        </motion.figure>

        <motion.div className={styles.split} variants={rise(reduced)}>
          <div className={styles.splitCopy}>
            <h3 className={styles.subTitleTight}>Send the whole file.</h3>
            <p className={styles.sub}>
              The size limit is whatever the person running the server picks.
              There's no tier that raises it, because there are no tiers. It
              starts at 100&nbsp;MB so nobody fills a disk by accident, and the
              next limit after that belongs to the storage, not to us.{" "}
              <Link to="/self-hosting">What a server decides</Link>.
            </p>
          </div>
          <Frame label="Past the 100 MB default, the next limit is the storage's own. On S3 that's 5 TB a file.">
            <UploadSketch />
          </Frame>
        </motion.div>

      </motion.div>
    </section>
  );
}
