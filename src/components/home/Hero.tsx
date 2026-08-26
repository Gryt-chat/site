import { motion, useReducedMotion } from "motion/react";
import { Button } from "@gryt/ui";
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
          <Button
            className={styles.primary}
            onClick={scrollToDownload}
            render={<a href="#download" />}
            size="large"
          >
            <DownloadIcon size={17} />
            Download Gryt
          </Button>
          {/* tone="neutral" would be a flat surface fill. The hero sits on a
              blob field, and the second action reads as glass over it — so the
              tone is ghost, carrying no fill of its own, and the class adds
              only the translucency and the hairline. */}
          <Button
            className={styles.secondary}
            render={
              <a
                href="https://app.gryt.chat"
                target="_blank"
                rel="noreferrer"
              />
            }
            size="large"
            tone="ghost"
          >
            <GlobeIcon size={17} />
            Try it in the browser
          </Button>
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
        {/* Its own asset rather than the 1.4.0 release-notes capture this used
            to borrow. That image is still what 1.4.0 looked like and has to
            stay that way; the front page has to be what the client looks like
            now, and the two stopped being the same picture.

            Three widths because the capture is 3456 wide and a 2x display
            asking for a 1180px slot wants every one of those pixels. The
            1728 entry is what a 1x display gets. */}
        <img
          src="/home/client-md.webp"
          srcSet="/home/client-sm.webp 720w, /home/client-md.webp 1728w, /home/client.webp 3456w"
          sizes="(max-width: 768px) calc(100vw - 32px), min(1180px, calc(100vw - 48px))"
          alt="The Gryt desktop client: a voice channel with eight people and a shared screen, chat alongside it, and a twenty-one-person member list"
          width={1728}
          height={1084}
          fetchPriority="high"
        />
      </motion.figure>
    </section>
  );
}
