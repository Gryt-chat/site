import { motion, useReducedMotion } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { DownloadIcon, GlobeIcon } from "../icons";
import { rise, stagger } from "./motion";
import styles from "./Hero.module.css";

function scrollToDownload(e: React.MouseEvent) {
  e.preventDefault();
  const el = document.getElementById("download");
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className={styles.hero}>
      <div className={styles.field} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        <span className={styles.grid} />
      </div>

      <motion.div
        className={styles.inner}
        variants={stagger(reduced, 0.09)}
        initial="hidden"
        animate="shown"
      >
        <motion.a
          className={styles.badge}
          variants={rise(reduced)}
          href="https://github.com/Gryt-chat/gryt"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size={16} aria-hidden="true" />
          Open source under AGPL-3.0
          <span className={styles.badgeArrow} aria-hidden="true">
            →
          </span>
        </motion.a>

        <motion.h1 className={styles.title} variants={rise(reduced)}>
          Voice chat that nobody else owns.
        </motion.h1>

        <motion.p className={styles.lede} variants={rise(reduced)}>
          Voice, text and video on hardware you control. Gryt has no feature
          paywalls, the whole stack is open source, and servers verify you
          without receiving a reusable credential.
        </motion.p>

        <motion.div className={styles.actions} variants={rise(reduced)}>
          <a href="#download" className={styles.primary} onClick={scrollToDownload}>
            <DownloadIcon size={17} />
            Download Gryt
          </a>
          <a
            href="https://app.gryt.chat"
            target="_blank"
            rel="noreferrer"
            className={styles.secondary}
          >
            <GlobeIcon size={17} />
            Try it in the browser
          </a>
        </motion.div>

      </motion.div>

      <motion.figure
        className={styles.shot}
        initial={{ opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduced ? 0.15 : 0.9,
          delay: reduced ? 0 : 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <img
          src="/changelog/voice-split.webp"
          srcSet="/changelog/voice-split-sm.webp 720w, /changelog/voice-split.webp 1728w"
          sizes="(max-width: 768px) calc(100vw - 32px), min(1180px, calc(100vw - 48px))"
          alt="The Gryt desktop client: a voice channel with eight people, chat alongside it, and an eighteen-person member list"
          width={1728}
          height={1084}
          fetchPriority="high"
        />
      </motion.figure>
    </section>
  );
}
