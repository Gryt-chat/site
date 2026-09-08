import { avatarSeed } from "@gryt/owl";
import {
  createGrytTheme,
  grytPresets,
  grytPresetsByCollection,
  grytThemeToOptions,
} from "@gryt/theme";
import { Avatar, Button, Chip } from "@gryt/ui";
import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { Showcase } from "../Showcase";
import { usePageTheme } from "./usePageTheme";
import styles from "./Themes.module.css";

/**
 * Every shipped theme, on a piece of the app rather than as a swatch, from the same
 * `grytPresets` the client renders. The count in the copy is read, not written.
 */
const GENERATOR = "https://ui.gryt.chat/theme/generator";

const COLLECTIONS = grytPresetsByCollection;
const PORTED = grytPresets.filter((p) => p.collection === "Brands").length;

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
 * A piece of the client, themed by whatever preset is handed to it: the style object is the
 * whole variable set, so radius comes with it. The carousel builds them, not this.
 */
function Preview({ vars }: { vars: CSSProperties }) {
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
  // Which collection, and how far into it. Held apart because the arrows move
  // one and the timer moves the other. GRYT-1069.
  const [at, setAt] = useState({ group: 0, member: 0 });
  const [picked, setPicked] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const step = useCallback((by: number) => {
    setPicked(true);
    setAt(({ group, member }) => {
      const size = COLLECTIONS[group].presets.length;
      return { group, member: (member + by + size) % size };
    });
  }, []);

  const jump = useCallback((group: number) => {
    setPicked(true);
    setAt({ group, member: 0 });
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

  // A collection per tick, so one pass is ten stops rather than forty-seven, and
  // a further step in once it wraps, so the passes are not the same ten themes.
  useEffect(() => {
    if (!seen || picked || reduced) return;
    const id = window.setInterval(() => {
      setAt(({ group, member }) => {
        const next = (group + 1) % COLLECTIONS.length;
        return { group: next, member: next === 0 ? member + 1 : member };
      });
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [seen, picked, reduced]);

  const collection = COLLECTIONS[at.group];
  // Collections are different lengths, so the timer's running count is folded
  // back in rather than clamped: the offset is what makes each pass differ.
  const member = at.member % collection.presets.length;
  const preset = collection.presets[member];

  const vars = useMemo(
    () => createGrytTheme(grytThemeToOptions(preset.theme, "dark")),
    [preset],
  );

  /* The rest of the page comes along, but only once somebody has picked something: repainting
     every four seconds while it cycles would be a page nobody could read. */
  usePageTheme(picked ? vars : null);

  return (
    <div className={styles.carousel} ref={ref}>
      {/* The collections, so forty-seven themes are picked from four or five at
          a time. Buttons rather than tabs: nothing is hidden behind them. */}
      <div className={styles.groups}>
        {COLLECTIONS.map((c, i) => (
          <button
            key={c.collection}
            type="button"
            className={styles.group}
            aria-pressed={i === at.group}
            onClick={() => jump(i)}
          >
            {c.collection}
          </button>
        ))}
      </div>

      <Preview vars={vars} />

      <p className={styles.note}>{collection.note}</p>

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
            {member + 1} of {collection.presets.length} in {collection.collection}
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
        They come in {spell(COLLECTIONS.length)} collections, so you're picking
        from four or five at a time rather than reading a list of{" "}
        {grytPresets.length}. {Spell(PORTED)} are ports of themes you've
        probably seen somewhere else and the rest are ours. A theme sets the
        colours and the corner radius, so picking one changes the shape of the
        app as well as the colour.
      </p>
      <p>
        The panel next to this is built from the same parts as the app, and
        each theme goes on it the same way. Pick a collection or press an arrow
        and the rest of this page comes with it &mdash; that's the same set of
        variables, on the whole site instead of one box.
      </p>
      <p>
        If none of them fits, build one at{" "}
        <a href={GENERATOR} target="_blank" rel="noreferrer">
          ui.gryt.chat
        </a>{" "}
        and paste the link it gives you into Appearance. Text size, interface
        scale and emoji size are their own settings: 10 to 24 pixels, 50 to 200
        per cent, and 12 to 96 pixels.
      </p>
    </Showcase>
  );
}
