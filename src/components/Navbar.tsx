import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog, Menu } from "@gryt/ui";
import { MdMenu, MdClose, MdArrowDownward, MdArrowDropDown } from "react-icons/md";
import { GrytLogo } from "./GrytLogo";
import { actions, community, navBar, reading, type SiteLink } from "../data/siteLinks";
import { useLatestDownload } from "../lib/useLatestDownload";
import { formatSize, storeOption } from "../lib/releases";
import { useTravellingUnderline } from "./useTravellingUnderline";
import styles from "./Navbar.module.css";

/**
 * Both lists come out of `src/data/siteLinks.ts`. The bar carries four: six links plus two
 * buttons is a directory rather than a decision, so the rest wait in the sheet.
 */
const navLinks = navBar.map((l) => ({
  href: l.href,
  label: l.label,
  external: !l.route,
  isRoute: !!l.route,
}));

/**
 * By label rather than by index. `getGoing[3]` would keep compiling and quietly point
 * somewhere else the day somebody reorders the list.
 */
const pick = (from: SiteLink[], label: string): SiteLink | null => {
  const hit = from.find((l) => l.label === label);
  if (!hit) {
    // Warn and drop, rather than throw. Throwing took the whole site down over one renamed
    // footer link while `yarn build` stayed green, because it never renders a component.
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
 * The one control on the page that does real work: it hands you the file for your platform.
 * Until the release lands, or if GitHub rate-limits, it says "Download" and scrolls.
 */
function DownloadAction() {
  const { os, osName, option, options } = useLatestDownload();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Windows leads with the Microsoft Store: signed, no SmartScreen warning, self-updating,
   * and it needs no release call, so the button can show before the fetch lands.
   */
  const store = os === "windows" ? storeOption() : null;
  const primary = store ?? option;

  /**
   * The two variants of the platform's primary format; slim is the deliberate default. The
   * caret appears once both are known, so a platform shipping one build keeps a plain button.
   */
  const variants = option ? options.filter((o) => o.label === option.label) : [];
  const fullBuild = variants.find((o) => o.withServer);
  const slimBuild = variants.find((o) => !o.withServer);
  const hasChoice = Boolean(fullBuild && slimBuild);

  /**
   * The label grows when the release call lands, so the width is measured and transitioned
   * in CSS — motion's rAF loop is throttled to nothing in a background tab.
   */
  const inner = useRef<HTMLDivElement>(null);
  const measured = useRef(false);
  const [width, setWidth] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);

  /**
   * On commit, synchronously, before the browser paints. A ResizeObserver is delivered as
   * part of the rendering steps, so in a tab that is not rendering it never fires.
   */
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    setSettled(measured.current);
    measured.current = true;
  }, [option, osName]);

  /**
   * And then the reflows React cannot see: the variable font finishing loading and every
   * label getting a pixel wider. Supplementary — everything above holds without it.
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
        {primary ? (
          <div className={styles.downloadGroup}>
            {primary.external ? (
              <Button
                render={<a href={primary.url} target="_blank" rel="noopener noreferrer" />}
                size="small"
                className={styles.download}
              >
                <MdArrowDownward size={15} aria-hidden="true" />
                <span>Get it from Microsoft Store</span>
              </Button>
            ) : (
              <Button
                render={<a href={primary.url} download />}
                size="small"
                className={styles.download}
              >
                <MdArrowDownward size={15} aria-hidden="true" />
                <span>Download for {osName}</span>
              </Button>
            )}
            {hasChoice ? (
              <Menu.Root>
                <Menu.Trigger
                  render={
                    <Button
                      size="small"
                      aria-label="Choose a build"
                      className={styles.downloadCaret}
                    />
                  }
                >
                  <MdArrowDropDown size={18} aria-hidden="true" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end" sideOffset={8}>
                    <Menu.Popup>
                      <Menu.Item render={<a href={slimBuild!.url} download />}>
                        Slim · {formatSize(slimBuild!.size)}
                        <span className={styles.downloadHint}>
                          {store ? "direct .exe, no built-in server" : "the download, without a server"}
                        </span>
                      </Menu.Item>
                      <Menu.Item render={<a href={fullBuild!.url} download />}>
                        Full · {formatSize(fullBuild!.size)}
                        <span className={styles.downloadHint}>
                          {store ? "direct .exe, with the built-in server" : "host a server from the app"}
                        </span>
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item onClick={toSection} render={<a href="#download" />}>
                        All builds and platforms
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            ) : null}
          </div>
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
