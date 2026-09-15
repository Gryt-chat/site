import { useSyncExternalStore } from "react";

const neverChanges = () => () => {};

/**
 * False on the server and for the render that hydrates, true from the next one. For what the
 * prerendered page cannot know, like the query string or the path a 404 was served for.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}
