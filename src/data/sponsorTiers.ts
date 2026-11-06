/**
 * The sponsorship tiers, and where each Sponsor button goes. The amount and the id are
 * declared together, or a button promises $100 and charges $500 with nothing to catch it.
 */

/** The tier list, in the order the sponsor page shows them. */
export interface SponsorTier {
  /** As written on the page. The id below must be the id of *this* amount. */
  amount: string;
  title: string;
  gets: string;
  /** A picture of what you get, under `public/`. */
  example?: { src: string; alt: string; width: number; height: number };
  /** GitHub's `tier_id`. Absent means "we do not know it yet", not "no tier". */
  tierId?: number;
}

export const SPONSOR_URL = "https://github.com/sponsors/Gryt-chat";

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    amount: "$5 a month",
    title: "The badge",
    gets: "An “I sponsor Gryt” badge for your README or your site.",
    example: { src: "/badges/sponsor.svg", alt: "I sponsor Gryt", width: 176, height: 36 },
  },
  {
    amount: "$25 a month",
    title: "Your name",
    gets: "Your name or handle in Gryt's README, plus the badge.",
    example: {
      src: "/sponsor/readme-name.png",
      alt: "Gryt's README on GitHub with a sponsor's name under Sponsors",
      width: 906,
      height: 172,
    },
  },
  {
    amount: "$100 a month",
    title: "Your logo",
    gets: "Your logo on gryt.chat, linked wherever you want, plus everything above.",
    example: {
      src: "/sponsor/logo-row.png",
      alt: "The sponsor row on gryt.chat's front page with a sponsor's logo in it",
      width: 620,
      height: 110,
    },
    tierId: 647033,
  },
  {
    amount: "$500 a month",
    title: "Top of the list",
    gets: "Your logo first, and your team's bug reports go to the front of the queue, plus everything above.",
    example: {
      src: "/sponsor/logo-first-row.png",
      alt: "The sponsor row on gryt.chat's front page with a larger logo first",
      width: 620,
      height: 110,
    },
  },
];

/** The one-off tier, shown apart from the monthly packs. */
export const ONCE_TIER: SponsorTier = {
  amount: "$50 once",
  title: "Release notes",
  gets: "Your name in the notes for the next release.",
  example: {
    src: "/sponsor/release-thanks.png",
    alt: "A Gryt release note on gryt.chat thanking a sponsor by name",
    width: 882,
    height: 257,
  },
};

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
