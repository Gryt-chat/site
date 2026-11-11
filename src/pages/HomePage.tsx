import { Features, Involved, News, Releases, SponsorBar, Why } from "../components/home/Front";
import { Hero } from "../components/home/Hero";
import { Motivation } from "../components/home/Motivation";
import { Voice } from "../components/home/Voice";

/** One video in the hero, what is new, what Gryt is, why it exists, then how to take part. */
export function HomePage() {
  return (
    <main>
      <Hero />
      <News />
      <Releases />
      <Why />
      <Voice />
      <Features />
      <Motivation />
      <Involved />
      <SponsorBar />
    </main>
  );
}
