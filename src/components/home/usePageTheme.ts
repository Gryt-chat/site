import type { CSSProperties } from "react";
import { useEffect } from "react";

/**
 * Paint a whole theme onto the page, and take it off again on the way out.
 *
 * `src/styles/tokens.css` is what makes this a few lines rather than a rewrite:
 * every one of this site's names is an alias of a `--gryt-` custom property, so
 * setting the design system's variables on `<html>` moves the entire page —
 * navbar, sections, footer, the lot — including the radius, which is why the
 * corners change and not just the colours.
 *
 * **Only the front page does this**, and only after somebody presses an arrow.
 * `Themes` is rendered on `/` and nowhere else, so leaving the page unmounts it
 * and the cleanup puts every property back. A theme that followed you onto
 * `/why-gryt` would be a preference the site had decided to remember, and this
 * is a demonstration rather than a setting.
 *
 * The properties go on `document.documentElement` rather than on `body` because
 * the navbar and the footer live outside the page's own tree, and a variable
 * set on `body` reaches neither.
 *
 * `createGrytTheme` returns `CSSProperties` because it is built to be handed to
 * a `style` prop. Every key in it is a custom property — 233 of them — so the
 * cast is safe and `setProperty` is the only way to write them onto an element
 * this component does not render.
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
