import { Download } from "../components/Download";
import { Addons } from "../components/home/Addons";
import { Bird } from "../components/home/Bird";
import { Emoji } from "../components/home/Emoji";
import { Hero } from "../components/home/Hero";
import { Identity } from "../components/home/Identity";
import { Lan } from "../components/home/Lan";
import { Motivation } from "../components/home/Motivation";
import { SelfHost } from "../components/home/SelfHost";
import { Sponsors } from "../components/home/Sponsors";
import { Themes } from "../components/home/Themes";
import { Voice } from "../components/home/Voice";

/**
 * One claim per section, each shown rather than argued. The middle alternates left and
 * right through `Showcase`, and the sequence lives here: Identity, Emoji, Themes, Lan.
 */
export function HomePage() {
  return (
    <main>
      <Hero />
      <Identity />
      <Bird />
      <Emoji />
      <Voice />
      <Themes />
      <Lan />
      <Addons />
      <Motivation />
      <SelfHost />
      <Download />
      <Sponsors />
    </main>
  );
}
