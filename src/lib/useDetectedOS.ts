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
 * reads "Node.js/22" — which matches neither "win" nor "mac", so `detectOS()`
 * fell through to linux at build time and every page shipped with Linux picked.
 *
 * React does not put that right. Hydration keeps the server's attributes where
 * they disagree with the client's, and no later render diffs them back, because
 * by then the fiber is holding the client's props already. On the download tabs
 * that left `aria-selected` and `data-active` on Linux while the indicator went
 * to Windows: a pill under a tab that read as unselected, and an accent-ink
 * label on a tab with no accent behind it. Text mismatches do get repaired,
 * which is why the navbar button looked right and the tabs did not.
 *
 * `useSyncExternalStore` rather than an effect, because a server snapshot is
 * the thing it exists for: React uses it for the prerender and for hydration,
 * then reads the client one and re-renders.
 *
 * Null rather than a default, because /download acts on this exactly once and
 * assigns `window.location`. A guess that corrected itself a frame later would
 * start two downloads. Callers that only need something to draw can say
 * `?? "windows"`.
 */
export function useDetectedOS(override?: OS | null): OS | null {
  return useSyncExternalStore(
    neverChanges,
    () => override ?? detectOS(),
    notOnTheServer
  );
}
