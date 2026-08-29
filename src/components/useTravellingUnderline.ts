import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One underline for a whole row of links, which travels to whichever one you
 * are pointing at.
 *
 * The same idea as `Tabs.Indicator` in `@gryt/ui`: the mark belongs to the
 * list, not to the item, so moving between items is one thing sliding rather
 * than one fading out while another fades in. It borrows that component's
 * timing too — `--gryt-dur-spring` and `--ease-spring`, both already on
 * `:root` from the library's stylesheet — so the nav and the app's tab strips
 * move at the same speed on the same curve.
 *
 * Where it parks:
 *
 *  - under the current page, if one of the links is the page you are on
 *  - under whatever you are hovering or have tabbed to, while you are there
 *  - back to the current page when you leave, or away entirely if there isn't
 *    one — the front page is not in the bar, so on `/` there is nothing to
 *    return to and the underline should not sit under a link you are not on
 *
 * Measured in the list's own coordinates via `offsetLeft`/`offsetWidth`, so the
 * list has to be a positioned ancestor. Measured rather than derived from a
 * class, because the widths are whatever the words happen to be.
 *
 * **It has to be told the page changed.** The mark parks under whichever link
 * carries `aria-current`, and that is measured in an effect — so the effect has
 * to re-run when the current page changes, not only when the pointer moves.
 * Without `page` in the dependencies the underline stayed under the last page
 * you visited after clicking the wordmark, which navigates to `/` and is the
 * one route where the answer is "nowhere". Reported on 2026-08-28.
 *
 * Three things here were written the obvious way first and were wrong:
 *
 * **Native listeners, not React's `onPointerLeave`.** `pointerleave` does not
 * bubble, so React simulates enter and leave from `pointerout` — which is a
 * layer of interpretation between the pointer and this hook that made "leave
 * the row" unreliable. `pointerout` with a `relatedTarget` check is what the
 * browser actually reports.
 *
 * **No `requestAnimationFrame` for arming the transition.** The first version
 * used the two-frame trick to commit a position with transitions off and turn
 * them on a frame later. rAF is throttled to nothing in a background tab, so
 * the underline could be left permanently un-animated by something as ordinary
 * as opening the page in a tab you were not looking at. Whether it may animate
 * is a fact about the state — has it been somewhere before? — so it is tracked
 * as one.
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
