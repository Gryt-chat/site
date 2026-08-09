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

const pageTitles: Record<string, string> = {
  '/': HOME_TITLE,
  '/why-gryt': pageTitle('Why Gryt?'),
  '/blog': pageTitle('Blog'),
  '/privacy': pageTitle('Privacy Policy'),
  '/privacy-policy': pageTitle('Privacy Policy'),
  '/terms': pageTitle('Terms of Use'),
  '/terms-of-use': pageTitle('Terms of Use'),
  '/community-guidelines': pageTitle('Community Guidelines'),
  '/guidelines': pageTitle('Community Guidelines'),
  '/invite': pageTitle('Invite'),
  '/auth/callback': HOME_TITLE,
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
