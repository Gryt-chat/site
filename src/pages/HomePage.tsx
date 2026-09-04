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
 * One claim per section, and each one shown rather than argued.
 *
 * The middle of the page alternates left and right through `Showcase`. The side
 * is a prop rather than a `:nth-child` rule, so inserting a section does not
 * silently flip everything below it. Nothing enforces the alternation, and it
 * has drifted once. **The sequence lives here.** Anything with media on a side
 * takes the next value:
 *
 *     Identity  right
 *     Emoji     left
 *     Themes    right
 *     Lan       left
 *
 * `Hero`, `Bird`, `Voice`, `Addons`, `Motivation`, `SelfHost`, `Download` and
 * `Sponsors` are full-width: they do not take a turn and they do not reset it.
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
