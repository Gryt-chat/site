import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
/* Throwaway: candidate chrome, tried on the real pages. Goes when one is picked. */
import { ChromeSwitcher } from "./components/chrome/ChromeSwitcher";
import { useChromePreview } from "./components/chrome/useChromePreview";
import { HomePage } from "./pages/HomePage";
import { HOME_TITLE, pageTitle } from "./lib/title";
import { STATIC_PAGES, ALIAS_PAGES } from "./lib/pages.mjs";

const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage })));
const BlogIndex = lazy(() => import("./pages/BlogIndex").then((m) => ({ default: m.BlogIndex })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const ChangelogIndex = lazy(() => import("./pages/ChangelogIndex").then((m) => ({ default: m.ChangelogIndex })));
const ChangelogEntry = lazy(() => import("./pages/ChangelogEntry").then((m) => ({ default: m.ChangelogEntry })));
const SponsorsPage = lazy(() => import("./pages/SponsorsPage").then((m) => ({ default: m.SponsorsPage })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines").then((m) => ({ default: m.CommunityGuidelines })));
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

function ScrollAndTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const title = pageTitles[pathname];
    if (title) document.title = title;
  }, [pathname]);
  return null;
}

const chromeHiddenRoutes = new Set(["/auth/callback"]);

export default function App() {
  const { pathname } = useLocation();
  const hideChrome = chromeHiddenRoutes.has(pathname);

  /* Candidate nav and footer, swapped in across the whole site so they can be
     judged over a real hero, a long post and the changelog rather than over an
     empty page. Off unless ?chrome=1 has been visited. Goes when one is picked. */
  const preview = useChromePreview();

  return (
    <>
      <ScrollAndTitle />
      {!hideChrome && (preview.on ? <preview.Nav /> : <Navbar />)}
      <Suspense fallback={<main className="routePending" aria-busy="true" aria-label="Loading page" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why-gryt" element={<WhyGryt />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/changelog" element={<ChangelogIndex />} />
          <Route path="/changelog/:version" element={<ChangelogEntry />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/guidelines" element={<CommunityGuidelines />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          {/* Without this, an unmatched URL rendered an empty <Routes>: the footer
              sat directly under the navbar with no content and the page kept the
              template title, so it read as a page that had loaded. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!hideChrome && (preview.on ? <preview.Footer /> : <Footer />)}
      {preview.on && (
        <ChromeSwitcher
          nav={preview.nav}
          footer={preview.footer}
          pickNav={preview.pickNav}
          pickFooter={preview.pickFooter}
          off={preview.off}
        />
      )}
    </>
  );
}
