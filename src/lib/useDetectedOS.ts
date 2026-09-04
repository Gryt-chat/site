import { useSyncExternalStore } from "react";

import { detectOS, type OS } from "./releases";

/* Nothing to subscribe to. The user agent does not change while the page is
   open, so the first read after hydration is the last one. */
const neverChanges = () => () => {};
const notOnTheServer = () => null;

/**
 * The platform the visitor is on, or null until hydration is over.
 *
 * Detection cannot happen during the first render. These pages are prerendered
 * by `vite build --ssr`, Node has a `navigator` of its own, and its userAgent
 * reads "Node.js/22" — matching neither "win" nor "mac", so `detectOS()` fell
 * through to linux and every page shipped with Linux picked. React does not
 * put that right: hydration keeps the server's attributes where they disagree
 * with the client's, and no later render diffs them back.
 *
 * Null rather than a default, because /download acts on this once and assigns
 * `window.location`. A guess that corrected itself a frame later would start
 * two downloads. Callers that only need something to draw can say
 * `?? "windows"`.
 */
export function useDetectedOS(override?: OS | null): OS | null {
  return useSyncExternalStore(
    neverChanges,
    () => override ?? detectOS(),
    notOnTheServer
  );
}
