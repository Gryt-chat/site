import { motion, useReducedMotion } from "motion/react";
import { LightboxImage } from "../Lightbox";
import { inView, rise, stagger } from "./motion";
import styles from "./FeatureGrid.module.css";

/**
 * Three alternating rows, one screenshot each.
 *
 * This was a six-card bento with a stat block, a floating clip and a paragraph
 * per card, and it was doing two jobs at once: showing the app and listing
 * features. The comparison tables list the features now, in nineteen rows, so
 * this only has to prove the app is real. One image, one line, one row at a
 * time.
 *
 * The crops come from scripts/generate-feature-crops.mjs, cut out of a genuine
 * screenshot, so they cannot quietly drift out of date the way a redrawn
 * mockup does.
 */
const rows = [
  {
    key: "voice",
    title: "Voice that tells you who is talking",
    body: "Every tile takes its colour from that person's avatar, and the ring follows the syllables rather than blinking on and off.",
    img: "/features/voice.webp",
    alt: "Four voice tiles, each tinted from the avatar of the person in it, one with a speaking ring and two showing mute badges",
  },
  {
    key: "chat",
    title: "Text, with everything you expect in it",
    body: "Mentions, replies, link previews, code, custom emoji and file uploads with previews.",
    img: "/features/chat.webp",
    alt: "A Gryt text channel showing a link preview, mentions, formatted text and emoji reactions",
  },
  {
    key: "members",
    title: "Who is around, and where",
    body: "In voice, online, away, offline. Roles and colours come from the server rather than a subscription.",
    img: "/features/members.webp",
    alt: "The member list showing eighteen people grouped by whether they are in voice, online or away",
  },
];

export function FeatureGrid() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="features">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          Screenshots of the real thing, not a drawing of it.
        </motion.h2>

        {rows.map((r) => (
          <motion.article key={r.key} className={styles.row} variants={rise(reduced)}>
            <div className={styles.copy}>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
            <div className={styles.shot}>
              <LightboxImage src={r.img} alt={r.alt} />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
