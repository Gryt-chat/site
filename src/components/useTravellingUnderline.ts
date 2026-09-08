import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One underline for a whole row of links, travelling to whichever one you point at. Measured
 * in the list's own coordinates, so the list has to be a positioned ancestor.
 */
export interface Underline {
  left: number;
  width: number;
}

export function useTravellingUnderline<T extends HTMLElement>(
  /** The current route. Changing it re-measures, which is how the mark leaves. */
  page: string,
) {
  const listRef = useRef<T>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [at, setAt] = useState<Underline | null>(null);

  /**
   * Whether the mark is currently somewhere, so the next move can animate from it. Going
   * from nowhere would slide it in from the left edge, which reads as a stray element.
   */
  const placed = useRef(false);
  const [settled, setSettled] = useState(false);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const el = target ?? list.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el) {
      setAt(null);
      setSettled(false);
      placed.current = false;
      return;
    }
    setAt({ left: el.offsetLeft, width: el.offsetWidth });
    setSettled(placed.current);
    placed.current = true;
  }, [target]);

  // `page` is not read by `measure` — it reads `aria-current` off the DOM — so
  // it is a dependency of the effect rather than of the callback.
  useEffect(measure, [measure, page]);

  // A width that changed under it — the window resized, or the variable font
  // finished loading and every label got a pixel wider.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    for (const child of Array.from(list.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [measure]);

  // Hover and keyboard focus both move it; leaving the row sends it back.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const linkFrom = (node: EventTarget | null) => {
      const el = node instanceof HTMLElement ? node.closest<HTMLElement>("a") : null;
      return el && list.contains(el) ? el : null;
    };
    /** Still inside the row? Then this is a move between links, not an exit. */
    const stillInside = (related: EventTarget | null) =>
      related instanceof Node && list.contains(related);

    const over = (e: PointerEvent) => {
      const link = linkFrom(e.target);
      if (link) setTarget(link);
    };
    const out = (e: PointerEvent) => {
      if (!stillInside(e.relatedTarget)) setTarget(null);
    };
    const focusIn = (e: FocusEvent) => {
      const link = linkFrom(e.target);
      if (link) setTarget(link);
    };
    const focusOut = (e: FocusEvent) => {
      if (!stillInside(e.relatedTarget)) setTarget(null);
    };

    list.addEventListener("pointerover", over);
    list.addEventListener("pointerout", out);
    list.addEventListener("focusin", focusIn);
    list.addEventListener("focusout", focusOut);
    return () => {
      list.removeEventListener("pointerover", over);
      list.removeEventListener("pointerout", out);
      list.removeEventListener("focusin", focusIn);
      list.removeEventListener("focusout", focusOut);
    };
  }, []);

  return { listRef, at, settled };
}
