import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { HomePage } from "./pages/HomePage";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { ChangelogIndex } from "./pages/ChangelogIndex";
import { ChangelogEntry } from "./pages/ChangelogEntry";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CommunityGuidelines } from "./pages/CommunityGuidelines";
import { InvitePage } from "./pages/InvitePage";
import { TermsOfUse } from "./pages/TermsOfUse";
import { WhyGryt } from "./pages/WhyGryt";
import { NotFound } from "./pages/NotFound";
import { HOME_TITLE, pageTitle } from "./lib/title";
import { STATIC_PAGES, ALIAS_PAGES } from "./lib/pages.mjs";

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

  return (
    <>
      <ScrollAndTitle />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/why-gryt" element={<WhyGryt />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/changelog" element={<ChangelogIndex />} />
        <Route path="/changelog/:version" element={<ChangelogEntry />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/guidelines" element={<CommunityGuidelines />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        {/* Without this, an unmatched URL rendered an empty <Routes>: the footer
            sat directly under the navbar with no content and the page kept the
            template title, so it read as a page that had loaded. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}
