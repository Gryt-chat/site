import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, Button, Dialog } from "@gryt/ui";
import { GrytLogo } from "./GrytLogo";
import { actions, footerGroups, legal, navBar, type SiteLink } from "../data/siteLinks";
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

const GITHUB_URL = "https://github.com/Gryt-chat/gryt";

const isAt = (page: string, l: SiteLink) => !!l.route && page === l.href;

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
            <Button render={<Link to="/download" />} size="small">
              Download
            </Button>
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

              {/* The footer's groups. The one holding this page starts open, the rest show a count. */}
              <nav className={styles.sheetNav}>
                <Accordion
                  className={styles.sheetGroups}
                  defaultValue={[
                    (footerGroups.find((g) => g.links.some((l) => isAt(page, l))) ?? footerGroups[0]).title,
                  ]}
                >
                  {footerGroups.map((group) => (
                    <Accordion.Item key={group.title} value={group.title} className={styles.sheetGroup}>
                      <Accordion.Trigger className={styles.sheetGroupTitle}>
                        {group.title}
                        <span className={styles.sheetCount}>{group.links.length}</span>
                      </Accordion.Trigger>
                      <Accordion.Panel>
                        {group.links.map((link) =>
                          link.route ? (
                            <Link
                              key={link.href}
                              to={link.href}
                              className={`${styles.sheetLink} ${isAt(page, link) ? styles.active : ""}`}
                              onClick={close}
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a key={link.href} href={link.href} className={styles.sheetLink} onClick={close}>
                              {link.label}
                            </a>
                          ),
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
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
                <p className={styles.sheetSmall}>
                  {legal.slice(0, 2).map((l) => (
                    <Link key={l.href} to={l.href} onClick={close}>
                      {l.label}
                    </Link>
                  ))}
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </p>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
}
