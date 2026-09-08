import { useSyncExternalStore } from "react";

import { detectOS, type OS } from "./releases";

/* Nothing to subscribe to. The user agent does not change while the page is
   open, so the first read after hydration is the last one. */
const neverChanges = () => () => {};
const notOnTheServer = () => null;

/**
 * The platform the visitor is on, or null until hydration is over. Node's userAgent reads
 * "Node.js/22" and hydration keeps the server's attributes, so every page shipped Linux.
 */
export function useDetectedOS(override?: OS | null): OS | null {
  return useSyncExternalStore(
    neverChanges,
    () => override ?? detectOS(),
    notOnTheServer
  );
}
