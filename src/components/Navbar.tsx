import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { MdMenu, MdClose } from "react-icons/md";
import { GrytLogo } from "./GrytLogo";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "/why-gryt", label: "Why Gryt?", external: false, isRoute: true },
  { href: "/blog", label: "Blog", external: false, isRoute: true },
  { href: "https://docs.gryt.chat", label: "Docs", external: true },
  { href: "https://feedback.gryt.chat", label: "Feedback", external: true },
  { href: "https://github.com/Gryt-chat", label: "GitHub", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
              href="https://github.com/Gryt-chat/gryt/releases"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
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
                {navLinks.map((link) => {
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
                  href="https://github.com/Gryt-chat/gryt/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={close}
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
