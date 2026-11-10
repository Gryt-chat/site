import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Dialog } from "@gryt/ui";
import { GrytLogo } from "./GrytLogo";
import { actions, navBar, sheetExtras, type SiteLink } from "../data/siteLinks";
import { usePathname } from "../lib/usePathname";
import { useTravellingUnderline } from "./useTravellingUnderline";
import styles from "./Navbar.module.css";

const asNav = (l: SiteLink) => ({
  href: l.href,
  label: l.label,
  external: !l.route,
  isRoute: !!l.route,
});

const navLinks = navBar.map(asNav);

/* The sheet keeps everything the bar dropped. */
const sheetLinks = [
  ...navLinks,
  ...sheetExtras.map(asNav),
  { href: "https://github.com/Gryt-chat/gryt", label: "GitHub", external: true, isRoute: false },
];

/** The outline heart from the home page design (v8). */
function HeartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19.5 12.6 12 20l-7.5-7.4A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 7.5 6.3z" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const page = usePathname();
  const { listRef, at, settled } = useTravellingUnderline<HTMLUListElement>(
    location.pathname,
  );

  const close = useCallback(() => setOpen(false), []);

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
          <GrytLogo size={30} />
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
                    aria-current={page === link.href ? "page" : undefined}
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

          <div className={styles.actionsRight}>
            <Link to="/sponsor" className={styles.sponsor}>
              <HeartIcon size={14} />
              Sponsor
            </Link>
            <a href="https://app.gryt.chat" className={styles.openApp}>
              {actions.openApp.label}
            </a>
          </div>
        </div>

        {/* On a phone the bar keeps the logo and one action. Everything else
            is in the drawer, opened from the Thumb on the right edge (GRYT-1708). */}
        <Button
          className={styles.mobileDownload}
          render={<Link to="/download" />}
          size="small"
        >
          Download
        </Button>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          {/* A tap opens it, never a swipe: one from the screen edge is the
              phone's own back or forward. Drawn as the drawer's edge peeking in. */}
          <Dialog.Trigger
            aria-label="Menu"
            className={styles.thumb}
            render={<button type="button" />}
          />

          <Dialog.Portal>
            <Dialog.Backdrop className={styles.overlay} />
            <Dialog.Popup className={styles.drawer} aria-label="Navigation">
              {/* The same tab, now on the drawer's edge, so the way out is
                  where the way in was. */}
              <Dialog.Close
                aria-label="Close menu"
                className={styles.drawerThumb}
                render={<button type="button" />}
              />

              <nav className={styles.sheetNav}>
                {sheetLinks.map((link) => {
                  const isActive =
                    link.isRoute && page === link.href;
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
                  onClick={close}
                  render={<Link to="/download" />}
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
