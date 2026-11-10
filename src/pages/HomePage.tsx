import { Involved, News, Releases, SponsorBar, Why } from "../components/home/Front";
import { Hero } from "../components/home/Hero";

/** v8 of the home page design: one video in the hero, then what is new, and how to take part. */
export function HomePage() {
  return (
    <main>
      <Hero />
      <News />
      <Releases />
      <Why />
      <Involved />
      <SponsorBar />
    </main>
  );
}
