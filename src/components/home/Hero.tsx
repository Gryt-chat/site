import { Button } from "@gryt/ui";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lightbox } from "react-motion-lightbox";
import "react-motion-lightbox/styles.css";

import { useLatestDownload } from "../../lib/useLatestDownload";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { Clip, type ClipSet } from "../Clip";
import { rise, stagger } from "./motion";
import styles from "./Hero.module.css";

const SELF_HOST = "https://docs.gryt.chat/docs/host/docker-compose";

/** The last 12 s of the film, silent and looping; the whole film opens in the lightbox with sound. */
const PREVIEW: ClipSet = {
  src: "/home/film-preview.mp4",
  av1: "/home/film-preview.av1.mp4",
  poster: "/home/film-preview.poster.webp",
};
const FILM = { kind: "video" as const, src: "/home/film.mp4", poster: "/home/film-preview.poster.webp", width: 1920, height: 1080, alt: "Gryt, the owl, sets up a server and calls his friends" };

const SHOWS =
  "Gryt the owl sets up a server, invites friends, chats with them and " +
  "joins a voice call where one of them shares a game";


/** The play triangle from the home page design (v8). */
function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}

export function Hero() {
  const prefers = usePrefersReducedMotion();
  const reduced = prefers ?? false;
  // Held until the preference is known, a render after hydration, so a reduced-motion visitor
  // gets the short fade rather than the timings the prerendered page was set up with.
  const arrive = prefers !== null;
  const { os, osName, version } = useLatestDownload();
  const card = useRef<HTMLButtonElement>(null);
  const [watching, setWatching] = useState(false);

  return (
    <section className={styles.hero}>
      <motion.div className={styles.inner} variants={stagger(reduced, 0.09)} initial="hidden" animate={arrive ? "shown" : "hidden"}>
        <motion.h1 className={styles.title} variants={rise(reduced)}>
          A place to talk that belongs to you.
        </motion.h1>

        <motion.p className={styles.lede} variants={rise(reduced)}>
          Gryt is voice, video and text chat. Download the app and you can make
          your own server right from it. Your chats stay on your machine, and
          nobody has to hand over an email, a phone number or a photo of their
          face to join.
        </motion.p>

        <motion.div className={styles.actions} variants={rise(reduced)}>
          {/* Like Godot: the button opens your system's page, never a file. */}
          <Link className={styles.download} to={os === "ios" || os === "android" ? "/download" : `/download?os=${os}`}>
            <span className={styles.downloadLabel}>Download for {os === "ios" ? "iPhone" : osName}</span>
          </Link>
          <Button className={styles.secondary} onClick={() => setWatching(true)} size="large" tone="ghost">
            Watch the video
          </Button>
        </motion.div>

        <motion.p className={styles.also} variants={rise(reduced)}>
          {version && <span className={styles.version}>{version}</span>}
          {version && " · "}
          <Link to="/download">Other systems</Link>
          <br />
          Or <a href="https://app.gryt.chat" target="_blank" rel="noreferrer">try it in the browser</a>, or{" "}
          <a href={SELF_HOST}>host it yourself</a>.
        </motion.p>

        <motion.figure className={styles.shot} variants={rise(reduced)}>
          <button ref={card} type="button" className={styles.play} onClick={() => setWatching(true)} aria-label="Play the video of Gryt, with sound">
            <Clip {...PREVIEW} alt={SHOWS} width={1920} height={1080} />
            <span className={styles.pill}>
              <PlayIcon size={14} />
              Watch Gryt in 90 seconds
            </span>
          </button>
          <figcaption className={styles.caption}>
            Made from the real app's own components: a server, friends, a chat and a call with screen share.
          </figcaption>
        </motion.figure>
      </motion.div>

      <Lightbox
        items={[FILM]}
        index={0}
        open={watching}
        onClose={() => setWatching(false)}
        origin={() => card.current}
        thumbnails={false}
        renderVideo={(item, { active }) => (
          <video src={item.src} poster={item.poster} aria-label={item.alt} controls autoPlay={active} playsInline style={{ width: "100%", height: "100%" }} />
        )}
      />
    </section>
  );
}
