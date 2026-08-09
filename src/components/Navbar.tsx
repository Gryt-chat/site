import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { MdMenu, MdClose } from "react-icons/md";
import { GrytLogo } from "./GrytLogo";
import styles from "./Navbar.module.css";

/**
 * The bar carries three links. Blog, Feedback and GitHub moved to the footer,
 * which already listed all three — six links plus two buttons was a directory,
 * and the two things a visitor is actually here to do were competing with it.
 *
 * The mobile sheet keeps the full set, because a sheet has the room and
 * somebody who opened it is looking for something specific.
 */
const navLinks = [
  { href: "/why-gryt", label: "Why Gryt?", external: false, isRoute: true },
  { href: "/changelog", label: "Changelog", external: false, isRoute: true },
  { href: "https://docs.gryt.chat", label: "Docs", external: true },
];

const sheetLinks = [
  ...navLinks,
  { href: "/blog", label: "Blog", external: false, isRoute: true },
  { href: "https://feedback.gryt.chat", label: "Feedback", external: true },
  { href: "https://github.com/Gryt-chat/gryt", label: "GitHub", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const close = useCallback(() => setOpen(false), []);

  /**
   * The pill is transparent over the hero and picks up its surface once you
   * leave the fold, so nothing sits on top of the artwork until it has to.
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={handleBrandClick}>
          <GrytLogo size={32} />
          Gryt
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.isRoute ? (
                <Link to={link.href}>{link.label}</Link>
              ) : link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ) : (
                <a href={link.href}>{link.label}</a>
              )}
            </li>
          ))}
          <li>
            <a
              href="https://app.gryt.chat"
              className={styles.openApp}
            >
              Open App
            </a>
          </li>
          <li>
            <a
              href="#download"
              className="btn btn-primary btn-sm"
              onClick={scrollToDownload}
            >
              Download
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className={styles.hamburger} aria-label="Open menu">
              <MdMenu size={22} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.sheet} aria-label="Navigation">
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
                <Dialog.Close asChild>
                  <button className={styles.closeBtn} aria-label="Close menu">
                    <MdClose size={22} />
                  </button>
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
                  Open App
                </a>
                <a
                  href="#download"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={(e) => {
                    scrollToDownload(e);
                    close();
                  }}
                >
                  Download
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
}
