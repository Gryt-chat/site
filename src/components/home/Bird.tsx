import { avatarSeed, owlAvatarDataUri } from "@gryt/owl";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { OwlDesigner } from "../owl/owlDesigner";
import { DEMO_NAMES } from "../../data/demoNames";
import { useRotatingName } from "./useRotatingName";

import { inView, rise, stagger } from "./motion";
import styles from "./Bird.module.css";

/**
 * The client's own designer, in the page rather than behind a button.
 *
 * A modal would mean asking somebody to open a window to look at a toy, and the
 * toy is the argument: your face is drawn, so it is yours to change. It is the
 * same component the app opens from settings, not a version of it.
 *
 * `followSeed` is the prop this page needed and the client does not. Without it
 * the designer opened on a saved look, or on the default gold bird, and drew
 * the same owl whatever anybody typed — which is the opposite of what the
 * heading claims. It now opens on the owl the name already draws and keeps
 * following the name until somebody picks a hat, at which point the bird is
 * theirs and the name stops moving it.
 *
 * The avatar upload used to be its own section further down. It is here now: it
 * is the same question — what is your face — and asking it twice on one page
 * made the second one read as filler.
 */
const AVATAR_DOCS = "https://docs.gryt.chat/docs/guide/accounts";

/** Four names, four owls, drawn here rather than saved as images. */
const GALLERY = ["kasper", "nora", "tobias", "ida"];

export function Bird() {
  const reduced = useReducedMotion() ?? false;
  const [touched, setTouched] = useState(false);
  const [name, setName] = useRotatingName(DEMO_NAMES, touched || reduced, "sivert");

  const gallery = useMemo(
    () =>
      GALLERY.map((n) => ({
        name: n,
        uri: owlAvatarDataUri(avatarSeed(n) ?? n, { size: 160 }),
      })),
    [],
  );

  return (
    <section className={styles.section} id="bird">
      <motion.div className={styles.inner} variants={stagger(reduced)} {...inView}>
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Your own bird, if you want it
        </motion.p>
        <motion.h2 className={styles.title} variants={rise(reduced)}>
          Everybody gets an owl. Yours is drawn where you are standing.
        </motion.h2>

        <motion.div
          className={styles.stage}
          variants={rise(reduced)}
          onPointerDown={() => setTouched(true)}
        >
          {/* Centred and given its own room. It used to sit as a small label
              and a box wedged between the heading and the designer, where it
              read as a caption rather than as the one thing on this section
              you are meant to type in. */}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Type a name and watch</span>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              onFocus={() => setTouched(true)}
              placeholder="your name"
              spellCheck={false}
              autoComplete="off"
            />
            <span className={styles.fieldHint}>
              Nothing is sent anywhere. The drawing happens in this tab.
            </span>
          </label>

          <div className={styles.designer}>
            <OwlDesigner
              nickname={name}
              followSeed
              saving={false}
              onSave={(png) => {
                // No account here to save to, so "use this owl" hands you the
                // file. A button that says it saved and did not is worse.
                const url = URL.createObjectURL(png);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${avatarSeed(name) ?? "owl"}-gryt.png`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        </motion.div>

        <motion.h3 className={styles.subTitle} variants={rise(reduced)}>
          Or use a picture you already have.
        </motion.h3>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          A GIF stays a GIF, and so does an animated WebP: the movement survives
          the upload rather than being flattened to the first frame, and it
          plays in the member list and beside every message you send. There is
          no tier that unlocks it. Up to 25&nbsp;MB, cropped square and stored
          at 256 pixels, and server icons take the same files.{" "}
          <a href={AVATAR_DOCS} target="_blank" rel="noreferrer">
            More on profiles
          </a>
          .
        </motion.p>

        <motion.ul className={styles.gallery} variants={rise(reduced)}>
          {gallery.map((g) => (
            <li className={styles.tile} key={g.name}>
              <img src={g.uri} alt={`The owl drawn for the name ${g.name}`} width={160} height={160} />
              <span>{g.name}</span>
            </li>
          ))}
          {/* The fifth tile is the upload, and it is drawn rather than
              photographed: a stand-in photo of a stranger would be the one
              thing in this row that is not real. */}
          <li className={styles.tile} data-upload="">
            <span className={styles.uploadArt} aria-hidden="true">
              <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
                <rect x="6" y="12" width="52" height="40" rx="8" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="22" cy="26" r="5" stroke="currentColor" strokeWidth="2.5" />
                <path d="M9 45l14-13 10 9 8-7 14 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>yours</span>
          </li>
        </motion.ul>
      </motion.div>
    </section>
  );
}
