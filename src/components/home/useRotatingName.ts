import { useEffect, useRef, useState } from "react";

const HOLD_MS = 3200;

/**
 * Swaps the name in the avatar demo every few seconds.
 *
 * It typed the name in a character at a time to begin with, which meant the owl
 * was redrawn on every keystroke and the whole thing flickered. One swap every
 * three seconds shows the same thing — a different name, a different owl — and
 * sits still while you read it.
 *
 * It stops the moment somebody touches the field, because a box that keeps
 * changing while you are trying to use it is the worst kind of clever, and it
 * stops for good once they have typed something of their own. Reduced motion
 * pauses it too: the rotation is decoration, the owl is the point.
 *
 * Returns the name plus a setter, so the field stays a normal controlled input.
 */
export function useRotatingName(
  names: string[],
  paused: boolean,
  initial: string,
): [string, (value: string) => void] {
  const [name, setName] = useState(initial);

  // The timer owns `name` between renders. Keeping it in a ref as well means the
  // effect never has to list it as a dependency and restart itself every time it
  // changes the very thing it is watching.
  const shown = useRef(initial);
  const touched = useRef(false);

  useEffect(() => {
    if (paused || touched.current) return;

    const swap = () => {
      let next = names[Math.floor(Math.random() * names.length)];
      // Never the one already on screen; three seconds of nothing happening
      // reads as broken rather than as a coincidence.
      if (next === shown.current && names.length > 1) {
        next = names[(names.indexOf(next) + 1) % names.length];
      }
      shown.current = next;
      setName(next);
    };

    const id = window.setInterval(swap, HOLD_MS);
    return () => window.clearInterval(id);
  }, [names, paused]);

  const set = (value: string) => {
    touched.current = true;
    shown.current = value;
    setName(value);
  };

  return [name, set];
}
