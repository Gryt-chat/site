import { useSyncExternalStore } from "react";

import { detectMacArch, type Arch } from "./releases";

/* Nothing to subscribe to. The machine does not change chip while the page is
   open, so the first read after hydration is the last one. */
const neverChanges = () => () => {};
const notOnTheServer = () => null;

/**
 * Apple silicon or Intel, or null on the server, off a Mac, and in Safari. Null is a real
 * answer: callers fall back to `PREFERRED`, and the button label says which chip.
 */
export function useDetectedArch(): Arch | null {
  return useSyncExternalStore(neverChanges, detectMacArch, notOnTheServer);
}
