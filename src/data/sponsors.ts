/**
 * Who has sponsored Gryt (GRYT-271). A file rather than the API: the tiers promise a
 * placement, not a live feed, and money has arrived through Ko-fi and directly too.
 */

export interface Sponsor {
  /** As they want to be shown. Not necessarily a GitHub handle. */
  name: string;
  /** Theirs to choose. The tier says "linked wherever you want". */
  href?: string;
  /**
   * Path under `public/`, for the logo tiers. SVG or a 2x PNG that holds up on a dark
   * background — there is no light appearance to fall back to.
   */
  logo?: string;
  /**
   * `recurring` is a sponsorship still running; `once` is a single payment, listed
   * separately, because somebody who gave once has not stopped.
   */
  kind: "recurring" | "once";
  /**
   * `YYYY-MM`. When a recurring sponsorship started, or when a one-off arrived. Shown as a
   * month and a year, so nobody has to publish the day they sent money.
   */
  since: string;
  /** Sorts to the front of the logos. */
  featured?: boolean;
}

export const sponsors: Sponsor[] = [
  // Listed by first name and no link, which is what he asked for. There is no amount field
  // on purpose: being listed is what the tiers promise.
  { name: "Carlo", kind: "once", since: "2026-03" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** `2026-03` as `March 2026`. Returns the input unchanged if it is not that shape. */
export function formatSince(since: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(since);
  if (!match) return since;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : since;
}
