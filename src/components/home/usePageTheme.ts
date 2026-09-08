import type { CSSProperties } from "react";
import { useEffect } from "react";

/**
 * Paint a whole theme onto the page, and take it off on the way out. Only the front page
 * does this. The properties go on `documentElement`: the navbar lives outside the tree.
 */
export function usePageTheme(vars: CSSProperties | null) {
  useEffect(() => {
    if (!vars) return;

    const root = document.documentElement;
    const entries = Object.entries(vars as Record<string, string>);

    for (const [name, value] of entries) root.style.setProperty(name, value);

    return () => {
      for (const [name] of entries) root.style.removeProperty(name);
    };
  }, [vars]);
}
