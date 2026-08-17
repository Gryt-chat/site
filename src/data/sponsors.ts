/**
 * Who has sponsored Gryt (GRYT-271).
 *
 * A file rather than the GitHub Sponsors API, for two reasons. The tiers
 * promise a placement and not a live feed, so somebody sponsoring under a
 * handle they would rather not publish is a thing to honour by editing this
 * file. And money has arrived through Ko-fi and directly, which the API does
 * not know about at all.
 *
 * Nothing here is published without asking the person first.
 */

export interface Sponsor {
  /** As they want to be shown. Not necessarily a GitHub handle. */
  name: string;
  /** Theirs to choose. The tier says "linked wherever you want". */
  href?: string;
  /**
   * Path under `public/`, for the logo tiers.
   *
   * SVG or a 2x PNG that holds up on a dark background. There is no light
   * appearance to fall back to.
   */
  logo?: string;
  /**
   * `recurring` is a sponsorship that is still running. `once` is a single
   * payment, which is a different thing and is listed separately: somebody who
   * gave once a year ago has not stopped sponsoring, because there was never
   * anything to stop.
   */
  kind: "recurring" | "once";
  /**
   * `YYYY-MM`. When a recurring sponsorship started, or when a one-off
   * arrived. Shown as a month and a year, so nobody has to publish the day
   * they sent money.
   */
  since: string;
  /** Sorts to the front of the logos. */
  featured?: boolean;
}

export const sponsors: Sponsor[] = [];

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
