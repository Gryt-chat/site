import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog } from "@gryt/ui";
import { MdMenu, MdClose, MdArrowDownward } from "react-icons/md";
import { GrytLogo } from "./GrytLogo";
import { actions, community, navBar, reading, type SiteLink } from "../data/siteLinks";
import { useLatestDownload } from "../lib/useLatestDownload";
import { useTravellingUnderline } from "./useTravellingUnderline";
import styles from "./Navbar.module.css";

/**
 * Both lists come out of `src/data/siteLinks.ts`.
 *
 * The bar carries four, because two buttons sit beside them and six links plus
 * two buttons is a directory rather than a decision. Blog, Changelog and
 * `Compared` are for people who already use Gryt, so they wait in the sheet and
 * the footer.
 *
 * Everything sits hard right against the viewport edge, with the wordmark hard
 * left and nothing in between. `Navbar.module.css` has the reasoning.
 */
const navLinks = navBar.map((l) => ({
  href: l.href,
  label: l.label,
  external: !l.route,
  isRoute: !!l.route,
}));

/**
 * By label rather than by index. `getGoing[3]` would keep compiling and quietly
 * point somewhere else the day somebody reorders the list, which is the class of
 * drift this file was made to stop.
 */
const pick = (from: SiteLink[], label: string): SiteLink | null => {
  const hit = from.find((l) => l.label === label);
  if (!hit) {
    // Warn and drop, rather than throw. Throwing was the first version, and it
    // took the whole site down over one renamed footer link — while `yarn build`
    // stayed green, because the build writes meta shells and never renders a
    // component. A missing nav link is a bad afternoon; a white page is worse.
    console.warn(`siteLinks has no "${label}" — the navbar expected one and dropped it`);
    return null;
  }
  return hit;
};

const asNav = (l: SiteLink) => ({
  href: l.href,
  label: l.label,
  external: !l.route,
  isRoute: !!l.route,
});

/* The sheet keeps everything the bar dropped. There is no width argument on a
   full-height sheet, so nothing has to lose. */
const sheetLinks = [
  ...navLinks,
  ...[
    pick(reading, "Compared"),
    pick(reading, "Blog"),
    pick(reading, "Changelog"),
    pick(community, "Feedback"),
  ]
    .filter((l): l is SiteLink => l !== null)
    .map(asNav),
  { href: "https://github.com/Gryt-chat/gryt", label: "GitHub", external: true, isRoute: false },
];

/**
 * The one control on the page that does real work.
 *
 * It knows which platform you are on and which build is current, and it hands
 * you that file rather than scrolling you to a section or dropping you on a
 * releases list to guess. Until the release lands it says "Download" and
 * scrolls to the section, which is also what it does if GitHub rate-limits the
 * call — sixty unauthenticated requests an hour per address, which a shared
 * office will reach.
 */
function DownloadAction() {
  const { osName, option } = useLatestDownload();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * The button starts as "Download" and becomes "Download for macOS" when the
   * release call comes back, so its width is measured off the content and
   * transitioned to.
   *
   * React writes the pixel value on commit and CSS animates it, rather than
   * framer-motion driving it: motion applies values through a
   * `requestAnimationFrame` loop, and rAF is throttled to nothing in a
   * background tab. The same assumption was a real bug in the nav underline.
   *
   * `settled` is the first-measurement guard, so the button animates from one
   * real width to the next rather than from zero on load.
   *
   * `overflow: clip` on the wrapper rather than `hidden`, because `hidden`
   * makes a scroll container and this one has a `position: fixed` ancestor —
   * the same reason `index.css` clips `html, body`. The clip margin keeps the
   * focus ring from being cut off with the overflow.
   */
  const inner = useRef<HTMLDivElement>(null);
  const measured = useRef(false);
  const [width, setWidth] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);

  /**
   * On commit, synchronously, before the browser paints.
   *
   * A ResizeObserver was the first version and it is the wrong primary: its
   * callbacks are delivered as part of the rendering steps, so in a tab that is
   * not rendering it never fires at all and the width is never written. A
   * layout effect runs whether or not anything is being painted.
   */
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    setSettled(measured.current);
    measured.current = true;
  }, [option, osName]);

  /**
   * And then the reflows React cannot see: the variable font finishing loading
   * and every label getting a pixel wider. Supplementary — everything above
   * still holds if this never runs.
   */
  useEffect(() => {
    const el = inner.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toSection = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/#download");
      return;
    }
    document.getElementById("download")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={styles.downloadSlot}
      data-settled={settled ? "" : undefined}
      style={width != null ? { width } : undefined}
    >
      <div className={styles.downloadInner} ref={inner}>
        {option ? (
          <Button
            render={<a href={option.url} download />}
            size="small"
            className={styles.download}
          >
            <MdArrowDownward size={15} aria-hidden="true" />
            <span>Download for {osName}</span>
          </Button>
        ) : (
          <Button onClick={toSection} render={<a href="#download" />} size="small">
            Download
          </Button>
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { listRef, at, settled } = useTravellingUnderline<HTMLUListElement>(
    location.pathname,
  );

  const close = useCallback(() => setOpen(false), []);

  const scrollToDownload = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/#download");
        return;
      }
      document.getElementById("download")?.scrollIntoView({ behavior: "smooth" });
    },
    [location.pathname, navigate],
  );

  const handleBrandClick = useCallback(
    (e: React.MouseEvent) => {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [location.pathname],
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={handleBrandClick}>
          <GrytLogo size={32} />
          Gryt
        </Link>

        {/* Desktop links.

            The four destinations are their own list so the underline has a
            positioned box to travel inside that stops before the actions —
            "Open in browser" and Download are not places you can be, so the
            mark has no business under them. */}
        <div className={styles.right}>
          <ul className={styles.links} ref={listRef}>
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.isRoute ? (
                  <Link
                    className={styles.navLink}
                    to={link.href}
                    aria-current={location.pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ) : link.external ? (
                  <a
                    className={styles.navLink}
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a className={styles.navLink} href={link.href}>{link.label}</a>
                )}
              </li>
            ))}

            {/* One mark for the whole row, placed in the list's own
                coordinates. `data-settled` is what stops it sliding in from
                the left edge the first time it appears. */}
            <span
              className={styles.underline}
              aria-hidden="true"
              data-on={at ? "" : undefined}
              data-settled={settled ? "" : undefined}
              style={
                at
                  ? ({
                      "--ul-left": `${at.left}px`,
                      "--ul-width": `${at.width}px`,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          </ul>

          <span aria-hidden="true" className={styles.rule} />

          <a href="https://app.gryt.chat" className={styles.openApp}>
            {actions.openApp.label}
          </a>

          {/* shrink-0 on the wrapper, not the button: it is the flex item, and
              a flex item squeezed below its content takes its children with
              it. Gryt UI's small button is a shade wider than the hand-rolled
              one it replaced, which was enough to tip the row over and clip
              the label to "Downloa". */}
          <div className="shrink-0">
            <DownloadAction />
          </div>
        </div>

        {/* Mobile hamburger */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open menu"
            className={styles.hamburger}
            render={<button type="button" />}
          >
            <MdMenu size={22} />
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Backdrop className={styles.overlay} />
            <Dialog.Popup className={styles.sheet} aria-label="Navigation">
              <div className={styles.sheetHeader}>
                <Link
                  to="/"
                  className={styles.brand}
                  onClick={(e) => {
                    handleBrandClick(e);
                    close();
                  }}
                >
                  <GrytLogo size={28} />
                  Gryt
                </Link>
                <Dialog.Close
                  aria-label="Close menu"
                  className={styles.closeBtn}
                  render={<button type="button" />}
                >
                  <MdClose size={22} />
                </Dialog.Close>
              </div>

              <nav className={styles.sheetNav}>
                {sheetLinks.map((link) => {
                  const isActive =
                    link.isRoute && location.pathname === link.href;
                  return link.isRoute ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`${styles.sheetLink} ${isActive ? styles.active : ""}`}
                      onClick={close}
                    >
                      {link.label}
                    </Link>
                  ) : link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.sheetLink}
                      onClick={close}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className={styles.sheetLink}
                      onClick={close}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>

              <div className={styles.sheetFooter}>
                <a
                  href="https://app.gryt.chat"
                  className={`${styles.openApp} ${styles.openAppMobile}`}
                  onClick={close}
                >
                  {actions.openApp.label}
                </a>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    scrollToDownload(e);
                    close();
                  }}
                  render={<a href="#download" />}
                >
                  Download
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
}
