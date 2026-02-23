import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CommunityGuidelines } from "./pages/CommunityGuidelines";
import { InvitePage } from "./pages/InvitePage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/guidelines" element={<CommunityGuidelines />} />
        <Route path="/invite" element={<InvitePage />} />
      </Routes>
      <Footer />
    </>
  );
}
