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
 * The middle of the page is four features, alternating left and right through
 * `Showcase`. The side each one sits on is written down rather than derived
 * from `:nth-child`, so inserting a section here does not silently flip
 * everything below it.
 *
 * There were nine features to fit and asking for a short page. Four of the nine
 * are facts about voice quality, so they are inside `Voice` as a fact strip
 * rather than four blocks of their own — grouping rather than cutting, which is
 * how everything that was picked stayed on a page that is still readable in one
 * sitting.
 *
 * The avatar upload was its own section between `Voice` and `Themes`. It is
 * inside `Bird` now — it is the same question, what your face is, and asking it
 * twice on one page made the second one read as filler.
 *
 * The technical material that used to accumulate here now has somewhere to go:
 * /developers and /self-hosting. That is what stops this page drifting back
 * into a specification, which it did twice.
 *
 * The security section is deliberately absent. /why-gryt and the docs already
 * answer those questions at length, and four paragraphs of threat model is not
 * what somebody deciding whether to try this needs from a front page.
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
