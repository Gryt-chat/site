import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { inView, rise, stagger } from "./motion";
import styles from "./Story.module.css";

/**
 * Every figure here is one the blog already states. 170+ users and the 131 over
 * a LAN-party weekend come from /blog/131-users-and-a-lan-party and
 * /blog/a-small-update; May 2022 is the GitHub organisation date in
 * /blog/the-story-of-gryt.
 */
const figures = [
  { value: 4, suffix: "+", label: "years, since May 2022" },
  { value: 2, suffix: "", label: "of them spent learning WebRTC first" },
  { value: 170, suffix: "+", label: "people using it" },
  { value: 1, suffix: "", label: "maintainer, and no second reviewer" },
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

export function Story() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="story">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Who built this
        </motion.p>

        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          One senior engineer, four years, and a WebRTC stack written from
          scratch.
        </motion.h2>

        <motion.div className={styles.prose} variants={rise(reduced)}>
          <p>
            Gryt has been in development since May 2022. Roughly two of those
            years went into WebRTC before the media server was written at all.
            I asked every developer at my workplace how ICE negotiation and
            DTLS-SRTP actually work and not one of them could tell me, so it was
            me, the RFCs and a lot of trial and error.
          </p>
          <p>
            The SFU is written in Go on{" "}
            <a href="https://github.com/pion/webrtc" target="_blank" rel="noreferrer">
              Pion
            </a>{" "}
            rather than an off-the-shelf SDK, because when something breaks in
            production I want to trace it from the application layer down to an
            individual RTP packet. That decision cost years and it is the reason
            voice holds up.
          </p>
          <p>
            AI helps with parts of this project, and where it does the commits
            say so. Anything security-relevant only merges through a pull
            request I have read line by line. The{" "}
            <a href="https://docs.gryt.chat/docs/guide/ai" target="_blank" rel="noreferrer">
              policy
            </a>{" "}
            is published, including the part where I am the only reviewer and
            can override my own rule.
          </p>
        </motion.div>

        <motion.dl className={styles.figures} variants={rise(reduced)}>
          {figures.map((f) => (
            <div key={f.label}>
              <dt>
                <Counter value={f.value} suffix={f.suffix} />
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
