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
import { WhyGryt } from "./pages/WhyGryt";

const pageTitles: Record<string, string> = {
  '/': 'Gryt — Voice, Text & Video Chat',
  '/why-gryt': 'Why Gryt? | Gryt',
  '/blog': 'Blog | Gryt',
  '/privacy': 'Privacy Policy | Gryt',
  '/privacy-policy': 'Privacy Policy | Gryt',
  '/community-guidelines': 'Community Guidelines | Gryt',
  '/guidelines': 'Community Guidelines | Gryt',
  '/invite': 'Invite | Gryt',
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

export default function App() {
  return (
    <>
      <ScrollAndTitle />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/why-gryt" element={<WhyGryt />} />
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
