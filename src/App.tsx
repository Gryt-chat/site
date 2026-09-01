import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { HOME_TITLE, pageTitle } from "./lib/title";
import { STATIC_PAGES, ALIAS_PAGES } from "./lib/pages.mjs";

const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage })));
const BlogIndex = lazy(() => import("./pages/BlogIndex").then((m) => ({ default: m.BlogIndex })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const ComparePage = lazy(() => import("./pages/ComparePage").then((m) => ({ default: m.ComparePage })));
const DevelopersPage = lazy(() => import("./pages/DevelopersPage").then((m) => ({ default: m.DevelopersPage })));
const SelfHostingPage = lazy(() => import("./pages/SelfHostingPage").then((m) => ({ default: m.SelfHostingPage })));
const ChangelogIndex = lazy(() => import("./pages/ChangelogIndex").then((m) => ({ default: m.ChangelogIndex })));
const ChangelogEntry = lazy(() => import("./pages/ChangelogEntry").then((m) => ({ default: m.ChangelogEntry })));
const SponsorsPage = lazy(() => import("./pages/SponsorsPage").then((m) => ({ default: m.SponsorsPage })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines").then((m) => ({ default: m.CommunityGuidelines })));
const SecurityPolicy = lazy(() => import("./pages/SecurityPolicy").then((m) => ({ default: m.SecurityPolicy })));
const DownloadPage = lazy(() => import("./pages/DownloadPage").then((m) => ({ default: m.DownloadPage })));
const InvitePage = lazy(() => import("./pages/InvitePage").then((m) => ({ default: m.InvitePage })));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse").then((m) => ({ default: m.TermsOfUse })));
const WhyGryt = lazy(() => import("./pages/WhyGryt").then((m) => ({ default: m.WhyGryt })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

/**
 * Derived from the same list the build scripts read, so a page cannot have a
 * prerendered title and a different client-side one — or, as happened with
 * /changelog, exist in one list and not another.
 */
const pageTitles: Record<string, string> = {
  '/': HOME_TITLE,
  '/auth/callback': HOME_TITLE,
  ...Object.fromEntries(
    STATIC_PAGES.map((p) => [`/${p.path}`, pageTitle(p.title)]),
  ),
  ...Object.fromEntries(
    ALIAS_PAGES.map((a) => {
      const target = STATIC_PAGES.find((p) => p.path === a.of);
      if (!target) throw new Error(`alias /${a.path} points at unknown page ${a.of}`);
      return [`/${a.path}`, pageTitle(target.title)];
    }),
  ),
};

/**
 * How long to keep looking for a `#hash` target after a route change.
 *
 * Pages are lazy behind `Suspense`, so on a cross-route hash link the element
 * does not exist when the effect runs. Following `/#download` from `/download`
 * means waiting for the home page chunk: measured at **573ms** on a dev server
 * with a cold chunk. An earlier version of this gave up after ten frames, which
 * is about 160ms, and therefore never scrolled at all.
 *
 * Three seconds is far more than the measurement and still bounded, so an id
 * that genuinely does not exist stops rather than ambushing somebody who has
 * started reading.
 */
const HASH_TARGET_TIMEOUT_MS = 3000;

/**
 * How long to keep the target in place after arriving at it.
 *
 * The home page is around 54,000px tall and full of images. Landing on
 * `#download` at 573ms means everything above it is still settling, and each
 * image that arrives pushes the target further down — so scrolling once lands
 * you near it and then drifts away from it.
 *
 * Any scroll, wheel, touch or key from the reader cancels this immediately.
 * Correcting a position somebody has deliberately moved away from would be
 * worse than the drift.
 */
const HASH_SETTLE_MS = 1500;

function ScrollAndTitle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const title = pageTitles[pathname];
    if (title) document.title = title;
  }, [pathname]);

  /**
   * Scroll to the `#hash` when there is one, and to the top when there is not.
   *
   * React Router does not scroll to fragments — only a full page load does,
   * which is why pasting `/#download` and pressing Enter always worked while
   * clicking a link to it did not. This used to be an unconditional
   * `scrollTo(0, 0)`, so even something that had scrolled correctly would have
   * been undone by it.
   *
   * The navbar worked around that by calling `scrollIntoView` by hand after
   * navigating, in two places. Anything written without knowing to do that was
   * broken, which is what happened to the link on the download page. Doing it
   * centrally means a plain `<Link to="/#download">` is enough.
   *
   * No offset is applied here: `[id] { scroll-margin-top }` in index.css
   * already clears the fixed navbar, and its comment names the hash case.
   */
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // A hash reaches us percent-encoded, and `getElementById` would miss any id
    // that is not plain ASCII.
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      id = hash.slice(1);
    }
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now();
    let raf = 0;
    let settleUntil = 0;
    let cancelled = false;

    // The reader has taken over. Stop moving the page under them.
    const surrender = () => {
      cancelled = true;
    };
    const events = ["wheel", "touchstart", "keydown"] as const;
    for (const event of events) {
      window.addEventListener(event, surrender, { passive: true, once: true });
    }

    const scrollTo = (target: Element) =>
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });

    const tick = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      const now = performance.now();

      if (!target) {
        if (now - startedAt < HASH_TARGET_TIMEOUT_MS) raf = requestAnimationFrame(tick);
        return;
      }

      // Found it. Scroll, then hold it there while the images above finish
      // arriving and pushing it around.
      if (settleUntil === 0) settleUntil = now + HASH_SETTLE_MS;
      scrollTo(target);
      if (now < settleUntil) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      for (const event of events) window.removeEventListener(event, surrender);
    };
    // `pathname` too: the same `#download` reached from two different routes
    // has to scroll both times, and the hash alone does not change between
    // them.
  }, [pathname, hash]);

  return null;
}

const chromeHiddenRoutes = new Set(["/auth/callback"]);

export default function App() {
  const { pathname } = useLocation();
  const hideChrome = chromeHiddenRoutes.has(pathname);

  return (
    <>
      <ScrollAndTitle />
      {!hideChrome && <Navbar />}
      <Suspense fallback={<main className="routePending" aria-busy="true" aria-label="Loading page" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why-gryt" element={<WhyGryt />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/self-hosting" element={<SelfHostingPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/changelog" element={<ChangelogIndex />} />
          <Route path="/changelog/:version" element={<ChangelogEntry />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/guidelines" element={<CommunityGuidelines />} />
          <Route path="/security" element={<SecurityPolicy />} />
          <Route path="/security-policy" element={<SecurityPolicy />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          {/* Without this, an unmatched URL rendered an empty <Routes>: the footer
              sat directly under the navbar with no content and the page kept the
              template title, so it read as a page that had loaded. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!hideChrome && <Footer />}
    </>
  );
}
