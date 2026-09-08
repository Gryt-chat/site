import { useSyncExternalStore } from "react";

import { detectMacArch, type Arch } from "./releases";

/* Nothing to subscribe to. The machine does not change chip while the page is
   open, so the first read after hydration is the last one. */
const neverChanges = () => () => {};
const notOnTheServer = () => null;

/**
 * Apple silicon or Intel, or null on the server, off a Mac, and in Safari.
 *
 * Same shape as `useDetectedOS` and for the same reason: these pages are
 * prerendered, so the probe cannot run during the first render and React will
 * not diff a corrected guess back afterwards.
 *
 * Null is a real answer here rather than "not yet". Callers fall back to the
 * order in `PREFERRED`, which puts Apple silicon first, and the label on the
 * button says which chip regardless.
 */
export function useDetectedArch(): Arch | null {
  return useSyncExternalStore(neverChanges, detectMacArch, notOnTheServer);
}
