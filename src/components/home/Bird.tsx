import { avatarSeed, owlAvatarDataUri } from "@gryt/owl";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { Clip, type ClipSet } from "../Clip";
import { OwlDesigner } from "@gryt/ui";
import { DEMO_NAMES } from "../../data/demoNames";
import { useRotatingName } from "./useRotatingName";

import { inView, rise, stagger } from "./motion";
import styles from "./Bird.module.css";

/**
 * The client's own designer, in the page rather than behind a button. It is the
 * same component the app opens from settings, not a version of it.
 *
 * `followSeed` is the prop this page needed and the client does not. Without it
 * the designer opened on a saved look, or on the default gold bird, and drew
 * the same owl whatever anybody typed. It now opens on the owl the name already
 * draws and keeps following the name until somebody picks a hat, at which point
 * the bird is theirs and the name stops moving it.
 */
const AVATAR_DOCS = "https://docs.gryt.chat/docs/guide/accounts";

/**
 * The designer in the app, doing the things the one above it cannot.
 *
 * Sivert's capture, 2026-08-28, and **the whole take**. A marketing page has no
 * account to save to and no member list to save into, so the ending is the
 * point: it stops on the new owl having reached a message and a member list,
 * not on a toast saying it worked. Do not trim it back to "Avatar updated".
 *
 *   node scripts/encode-clips.mjs avatar-editor-preview.mp4 avatar-editor \
 *     --width 2200 --fps 30 --poster-at 2.4
 *
 * `--poster-at 2.4` because the first two seconds are a settings panel sliding
 * open, and a half-drawn panel is a poor still for somebody who asked for no
 * motion.
 */
const EDITOR: ClipSet = {
  src: "/home/avatar-editor.mp4",
  av1: "/home/avatar-editor.av1.mp4",
  poster: "/home/avatar-editor.poster.webp",
};

const EDITOR_SHOWS =
  "The owl designer open in the Gryt desktop app: rows of expressions, " +
  "glasses, heads and colours being picked, Surprise me rolling a new bird, " +
  "and the chosen owl appearing on the profile and beside a message once it " +
  "is saved";

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
        {/* The label for the section, not a second headline. "Your own bird,
            if you want it" was a sentence in the slot every other section fills
            with one word, and the heading under it already says the same thing
            with more room to do it in. `Avatars` is also what this section is,
            since the upload half moved in here. */}
        <motion.p className={styles.eyebrow} variants={rise(reduced)}>
          Avatars
        </motion.p>
        <motion.h2 className={styles.title} variants={rise(reduced)}>
          Everybody gets an owl. Here's yours.
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
            <span className={styles.fieldLabel}>Type a name</span>
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
              Nothing gets sent anywhere. It's drawn in this tab.
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

        <motion.figure className={styles.capture} variants={rise(reduced)}>
          <Clip {...EDITOR} alt={EDITOR_SHOWS} width={2200} height={1212} />
          <figcaption>
            The same designer in the app, doing the bits this page can't. The
            owls you've worn before, Surprise me, and a message at the end so
            you can see the new owl actually turn up.
          </figcaption>
        </motion.figure>

        <motion.h3 className={styles.subTitle} variants={rise(reduced)}>
          Or use a picture you already have.
        </motion.h3>
        <motion.p className={styles.sub} variants={rise(reduced)}>
          A GIF stays a GIF, and so does an animated WebP. It keeps moving
          instead of getting flattened to the first frame, and it plays in the
          member list and next to every message you send. You don't have to pay
          for that. Up to 25&nbsp;MB, cropped square, stored at 256 pixels.
          Server icons work the same way.{" "}
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
