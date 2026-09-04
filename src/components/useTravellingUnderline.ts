import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One underline for a whole row of links, which travels to whichever one you
 * are pointing at.
 *
 * Parks under the current page, follows hover and focus while they are on the
 * row, and returns on leave — or goes nowhere on `/`, which is not in the bar.
 *
 * Measured in the list's own coordinates via `offsetLeft`/`offsetWidth`, so the
 * list has to be a positioned ancestor.
 *
 * **`page` has to be in the dependencies.** The mark parks under whichever link
 * carries `aria-current` and that is measured in an effect, so navigating has
 * to re-run it. Without this the underline stays under the last page you were
 * on after clicking the wordmark.
 *
 * Native `pointerout` with a `relatedTarget` check, not React's
 * `onPointerLeave`: `pointerleave` does not bubble, so React simulates it and
 * "leave the row" came out unreliable.
 *
 * No `requestAnimationFrame` for arming the transition. rAF is throttled to
 * nothing in a background tab, which left the underline permanently
 * un-animated. Whether it may animate is tracked as state instead.
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
   * Whether the mark is currently somewhere, so the next move can animate from
   * it. Going from nowhere to somewhere must not animate: with no previous
   * position it would slide in from the left edge of the list, which reads as a
   * stray element rather than as an underline arriving.
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
