import { motion, useReducedMotion } from "motion/react";
import { LightboxImage } from "../Lightbox";
import { inView, rise, stagger } from "./motion";
import styles from "./FeatureGrid.module.css";

/**
 * Real screenshots of the client, cropped panel by panel by
 * scripts/generate-feature-crops.mjs. These are the actual app, not a redrawn
 * copy, so they cannot quietly drift out of date the way a hand-built mockup
 * does — when the client changes, the crop is visibly wrong.
 */
const cards = [
  {
    key: "voice",
    span: "wide",
    title: "Voice that tells you who is talking",
    body: "Every tile takes its colour from that person's avatar, so a call you are half-watching still tells you who is where. The ring follows the syllables, and muted people wear a badge instead of you inferring it from a halo that never appears.",
    img: "/features/voice.webp",
    alt: "Four voice tiles, each tinted from the avatar of the person in it, one with a speaking ring and two showing mute badges",
    clip: true,
  },
  {
    key: "chat",
    span: "narrow",
    title: "Text that keeps up",
    body: "Mentions, replies, link previews, code, custom emoji imported from BetterTTV or emoji.gg, and file uploads with image previews.",
    img: "/features/chat.webp",
    alt: "A Gryt text channel showing a link preview, mentions, formatted text and emoji reactions",
  },
  {
    key: "channels",
    span: "narrow",
    title: "Servers and channels",
    body: "Text and voice channels, and you can see who is sitting in voice without joining first. Connect to several self-hosted servers at once and switch between them.",
    img: "/features/channels.webp",
    alt: "The Gryt server rail and channel list, with a voice channel showing the eight people currently in it",
  },
  {
    key: "members",
    span: "narrow",
    title: "Who is around",
    body: "Presence that means something: in voice, online, away, offline. Roles and colours come from the server, not from a subscription.",
    img: "/features/members.webp",
    alt: "The member list showing eighteen people grouped by whether they are in voice, online or away",
  },
  {
    key: "audio",
    span: "narrow",
    title: "Audio worth the bandwidth",
    body: "RNNoise suppression at roughly 20 ms of latency, RMS auto gain, a compressor and a noise gate you can tune. Screen sharing does AV1 and H.264 on your GPU, with a gaming mode that holds framerate over sharpness.",
  },
];

export function FeatureGrid() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.section} id="features">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          The client
        </motion.p>
        <motion.h2 className={styles.heading} variants={rise(reduced)}>
          This is the actual app. Not a mockup of it.
        </motion.h2>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          Every image below is cropped straight out of a screenshot of Gryt
          running. Click any of them to see it full size.
        </motion.p>

        <div className={styles.grid}>
          {cards.map((c) => (
            <motion.article
              key={c.key}
              className={`${styles.card} ${styles[c.span]}`}
              variants={rise(reduced)}
            >
              <div className={styles.copy}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>

              {c.img && (
                <div className={styles.shot}>
                  <LightboxImage src={c.img} alt={c.alt} />
                </div>
              )}

              {c.clip && (
                <video
                  className={styles.clip}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="A speaking indicator growing and shrinking with how loud someone is talking"
                >
                  <source src="/changelog/speaking-indicator.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
                  <source src="/changelog/speaking-indicator.mp4" type="video/mp4" />
                </video>
              )}
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
