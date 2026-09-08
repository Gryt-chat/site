import { useEffect, useRef, useState } from "react";

const RESET_MS = 1600;

/**
 * Copy, and a flag that says so for a moment. Its own file because two callers want it, and
 * two copies of a timer that has to be cleared on unmount is two chances to leak one.
 */
export function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    // The clipboard is refused over plain HTTP and in a few locked-down browsers. The text
    // is on screen and selectable either way, so a refusal says nothing.
    void navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
      },
      () => {},
    );
  };

  return [copied, copy];
}
