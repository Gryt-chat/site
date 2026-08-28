import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { inView, rise, stagger } from "./motion";
import styles from "./Motivation.module.css";

const PION = "https://github.com/pion/webrtc";
const MONOREPO = "https://github.com/Gryt-chat/gryt";

/**
 * Every figure is one the blog already states. The 170 and the 131 over a
 * LAN-party weekend come from /blog/131-users-and-a-lan-party and
 * /blog/a-small-update; May 2022 is the GitHub organisation date in
 * /blog/the-story-of-gryt.
 */
const FIGURES = [
  { value: 4, suffix: "+", label: "years, since May 2022" },
  { value: 2, suffix: "", label: "of them spent on WebRTC before writing the media server" },
  { value: 13, suffix: "", label: "repositories, all public" },
  { value: 1, suffix: "", label: "person" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion() ?? false;
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!visible || reduced) return;
    let frame = 0;
    const total = 38;
    const tick = () => {
      frame += 1;
      const t = frame / total;
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (frame < total) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [visible, reduced, value]);

  return (
    <span ref={ref} className={styles.figure}>
      {n}
      {suffix}
    </span>
  );
}

export function Motivation() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="motivation">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Why this exists
        </motion.p>
        <motion.h2 className={styles.title} variants={rise(reduced)}>
          One senior engineer, four years, and a voice stack written from
          scratch.
        </motion.h2>

        <motion.div className={styles.prose} variants={rise(reduced)}>
          <p>
            I started Gryt in May 2022 because I wanted somewhere for my friends
            to talk that I was not renting from anybody, and because the chat
            apps we were using kept asking for a little more of us every year.
          </p>
          <p>
            Roughly two of those four years went into WebRTC before the media
            server was written at all. I asked every developer at my workplace
            how ICE negotiation and DTLS-SRTP actually work, and not one of them
            could tell me. So it was me, the RFCs and a lot of trial and error.
            The voice server is written in Go on{" "}
            <a href={PION} target="_blank" rel="noreferrer">
              Pion
            </a>{" "}
            rather than an off-the-shelf SDK, because when something breaks in a
            call I want to be able to trace it down to an individual packet.
          </p>
          <p>
            It is still one person. The app, the server, the voice stack, the
            identity system, the component library, the mobile app, the docs and
            this page. That is either the best or the worst thing about Gryt
            depending on what you need from it, and you should know it before
            you build a community on top of it.
          </p>
        </motion.div>

        <motion.dl className={styles.figures} variants={rise(reduced)}>
          {FIGURES.map((f) => (
            <div className={styles.stat} key={f.label}>
              <dt className={styles.srOnlyLabel}>{f.label}</dt>
              <dd>
                <Counter value={f.value} suffix={f.suffix} />
                <span className={styles.label}>{f.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.p className={styles.links} variants={rise(reduced)}>
          <a href={MONOREPO} target="_blank" rel="noreferrer">
            Read the code <span aria-hidden="true">→</span>
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
