import { useEffect, useRef, useState } from "react";

const RESET_MS = 1600;

/**
 * Copy, and a flag that says so for a moment.
 *
 * Its own file rather than a second export from `Snippet.tsx`: the snippet
 * block and the package rows on /developers both want this behaviour, one
 * hanging off a `<pre>` and the other off a one-line command, and two copies of
 * a timer that has to be cleared on unmount is two chances to leak one.
 */
export function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    // The clipboard is refused over plain HTTP and in a few locked-down
    // browsers. The text is on screen and selectable either way, so a refusal
    // says nothing rather than reporting a failure at somebody who can simply
    // select it.
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
