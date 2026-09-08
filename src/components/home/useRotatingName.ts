import { useEffect, useRef, useState } from "react";

const HOLD_MS = 3200;

/**
 * Swaps the name in the avatar demo every three seconds. It stops the moment somebody
 * touches the field, and for good once they type. Reduced motion pauses it too.
 */
export function useRotatingName(
  names: string[],
  paused: boolean,
  initial: string,
): [string, (value: string) => void] {
  const [name, setName] = useState(initial);

  // The timer owns `name` between renders. A ref as well means the effect never lists it as
  // a dependency and restarts itself every time it changes the thing it is watching.
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
