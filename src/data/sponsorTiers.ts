/**
 * The sponsorship tiers, and where each one's Sponsor button should go.
 *
 * `https://github.com/sponsors/Gryt-chat` is the tier list. Somebody who has
 * already decided — they clicked a button that says "Your logo, $100 a month" —
 * lands there and has to find that tier again and pick it. GitHub accepts a
 * `tier_id` and goes straight to checkout for that amount, which is one screen
 * instead of three.
 *
 * ## Why the amount and the id live together
 *
 * The amounts were written out twice: once in the open slot on the home page
 * and once in the tier list on /sponsors. Attaching ids to those separately is
 * how a button ends up promising $100 and charging $500 — the worst failure
 * this file can have, and one nobody would notice from the page. So the pair is
 * declared once, here, and both pages read it.
 *
 * ## Getting the missing ids
 *
 * Only $100 is known. The ids are not in the public sponsors page HTML, so
 * there is no way to look them up programmatically. To add one: open
 * https://github.com/sponsors/Gryt-chat, click the tier, and copy `tier_id`
 * out of the resulting URL.
 *
 * A tier with no id keeps the generic link, which is exactly what every tier
 * did before this file existed. Adding one is a single line and nothing else
 * has to change.
 */

/** The tier list, in the order the sponsors page shows them. */
export interface SponsorTier {
  /** As written on the page. The id below must be the id of *this* amount. */
  amount: string;
  gets: string;
  /** GitHub's `tier_id`. Absent means "we do not know it yet", not "no tier". */
  tierId?: number;
}

export const SPONSOR_URL = "https://github.com/sponsors/Gryt-chat";

export const SPONSOR_TIERS: SponsorTier[] = [
  { amount: "$5 a month", gets: "A sponsor badge on your GitHub profile." },
  { amount: "$25 a month", gets: "Your name or handle in Gryt's README." },
  { amount: "$50 once", gets: "Your name in the notes for the next release." },
  {
    amount: "$100 a month",
    gets: "Your logo on this site, linked wherever you want.",
    tierId: 647033,
  },
  {
    amount: "$500 a month",
    gets: "Logo at the top of the list, and your team's bug reports go to the front of the queue.",
  },
];

/**
 * The checkout link for one tier, or the tier list when the id is unknown.
 *
 * `preview=false` is carried through from the URL GitHub produces rather than
 * trimmed. It is what the sponsor flow hands out, it is known to work, and
 * guessing that a parameter is redundant is how a link quietly starts landing
 * somewhere else.
 */
export function sponsorUrl(tierId?: number): string {
  if (!tierId) return SPONSOR_URL;
  return `${SPONSOR_URL}/sponsorships?tier_id=${tierId}&preview=false`;
}

/**
 * The tier the "Your logo" slot on the home page is offering.
 *
 * Looked up by amount rather than hardcoded a second time, so the slot and the
 * tier list cannot disagree about what $100 buys. If the tier is ever renamed,
 * this returns undefined and the button falls back to the tier list — worse
 * than a direct link, better than a wrong one.
 */
export const LOGO_TIER = SPONSOR_TIERS.find((t) => t.amount === "$100 a month");
