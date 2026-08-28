import { avatarSeed } from "@gryt/owl";
import { createGrytTheme, grytPresets, grytThemeToOptions } from "@gryt/theme";
import { Avatar, Button, Chip } from "@gryt/ui";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { Showcase } from "../Showcase";
import styles from "./Themes.module.css";

/**
 * Every shipped theme, on a piece of the app rather than as a swatch.
 *
 * `@gryt/theme` is a dependency of this site and `grytPresets` is the same
 * array the client's Appearance tab renders, so `createGrytTheme` turns a
 * preset into the 233 custom properties the design system runs on, and the
 * preview below is drawn with them. The pieces inside it are `Avatar`, `Chip`
 * and `Button` out of `@gryt/ui` — the components the client renders rather
 * than a drawing of them, which is the same call the voice panel makes.
 *
 * A row of colour swatches came first and it was the wrong picture. A theme
 * changes the corner radius as well as the palette, and eighteen chips cannot
 * show that; one panel that actually restyles can.
 *
 * Ship a nineteenth theme and the carousel grows a step with no edit here.
 * Which is also why the count in the copy is read rather than written: two
 * comments elsewhere in this repository still claim eleven and twelve presets.
 *
 * The dark half of each theme is what is shown, because the site is dark and a
 * carousel mixing the two would read as thirty-six themes rather than eighteen.
 * `Paper`, `Ice` and the ported ones all carry a light half in the app.
 */
const GENERATOR = "https://ui.gryt.chat/theme/generator";

const OURS = grytPresets.filter((p) => p.group === "Gryt").length;
const PORTED = grytPresets.length - OURS;

const HOLD_MS = 3600;

const NUMBER = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

/** Spelled out where it reads as prose, digits past what a sentence carries. */
const spell = (n: number) => NUMBER[n] ?? String(n);

/** The same word at the start of a sentence. */
const Spell = (n: number) => {
  const word = spell(n);
  return word[0].toUpperCase() + word.slice(1);
};

const PEOPLE = [
  { name: "kasper", says: "did you see the new theme" },
  { name: "nora", says: "took about four seconds to pick" },
];

/**
 * A piece of the client, themed by whatever preset is handed to it.
 *
 * The style object is the whole design system's variable set, so everything
 * inside — the two Gryt UI components included — resolves against this preset
 * rather than against the page. Radius comes with it, which is why the corners
 * move between Signal, GitHub and Gryt Rounded.
 */
function Preview({ preset }: { preset: (typeof grytPresets)[number] }) {
  const vars = useMemo(
    () => createGrytTheme(grytThemeToOptions(preset.theme, "dark")),
    [preset],
  );

  return (
    <div className={styles.preview} style={vars}>
      <div className={styles.previewHead}>
        <span className={styles.previewChannel}># general</span>
        <Chip label="42 ms" tone="success" />
      </div>

      <ul className={styles.previewLines}>
        {PEOPLE.map((p) => (
          <li key={p.name}>
            <Avatar seed={avatarSeed(p.name) ?? p.name} alt="" size="small" />
            <span className={styles.previewWho}>{p.name}</span>
            <span className={styles.previewSays}>{p.says}</span>
          </li>
        ))}
      </ul>

      <div className={styles.previewFoot}>
        <span className={styles.previewBox}>Message #general</span>
        <Button size="small">Send</Button>
      </div>
    </div>
  );
}

function Carousel() {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const step = useCallback((by: number) => {
    setPicked(true);
    setIndex((i) => (i + by + grytPresets.length) % grytPresets.length);
  }, []);

  // Nothing rotates off screen, and nothing rotates for somebody who asked for
  // less motion — the two conditions the voice panel is already held to.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // It stops for good once somebody uses an arrow. A carousel that keeps moving
  // under the person steering it is the worst kind of clever.
  useEffect(() => {
    if (!seen || picked || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % grytPresets.length),
      HOLD_MS,
    );
    return () => window.clearInterval(id);
  }, [seen, picked, reduced]);

  const preset = grytPresets[index];

  return (
    <div className={styles.carousel} ref={ref}>
      <Preview preset={preset} />

      <div className={styles.pager}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(-1)}
          aria-label="Previous theme"
        >
          <MdChevronLeft size={20} />
        </button>

        {/* aria-live, because the thing that changed with the name is a picture
            and says nothing on its own. */}
        <span className={styles.presetName} aria-live="polite">
          <span className={styles.presetLabel}>{preset.name}</span>
          <span className={styles.presetCount}>
            {index + 1} of {grytPresets.length}
          </span>
        </span>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(1)}
          aria-label="Next theme"
        >
          <MdChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function Themes() {
  return (
    <Showcase
      id="themes"
      side="right"
      size="large"
      eyebrow="Themes"
      title={`${Spell(grytPresets.length)} themes, and a generator for the rest.`}
      media={<Carousel />}
    >
      <p>
        {Spell(OURS)} are ours. {Spell(PORTED)} are ports of themes you've
        probably used somewhere else. A theme sets the whole palette and the
        corner radius, so picking one changes the shape of the app as well as
        the colour.
      </p>
      <p>
        The panel next to this is built from the same components as the app,
        and each theme goes on it the same way.
      </p>
      <p>
        If none of them fits, build one at{" "}
        <a href={GENERATOR} target="_blank" rel="noreferrer">
          ui.gryt.chat
        </a>{" "}
        and paste the link it gives you into Appearance. Text size, interface
        scale and emoji size are separate settings: 10 to 24 pixels, 50 to 200
        per cent, and 12 to 96 pixels.
      </p>
    </Showcase>
  );
}
