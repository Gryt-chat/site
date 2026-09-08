/**
 * The sponsorship tiers, and where each Sponsor button goes. The amount and the id are
 * declared together, or a button promises $100 and charges $500 with nothing to catch it.
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
 * The checkout link for one tier, or the tier list when the id is unknown. `preview=false`
 * is carried through from the URL GitHub produces rather than trimmed as redundant.
 */
export function sponsorUrl(tierId?: number): string {
  if (!tierId) return SPONSOR_URL;
  return `${SPONSOR_URL}/sponsorships?tier_id=${tierId}&preview=false`;
}

/**
 * The tier the "Your logo" slot is offering, looked up by amount rather than hardcoded
 * twice. A renamed tier returns undefined and the button falls back to the list.
 */
export const LOGO_TIER = SPONSOR_TIERS.find((t) => t.amount === "$100 a month");
