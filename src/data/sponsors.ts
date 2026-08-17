/**
 * Who is currently sponsoring Gryt (GRYT-271).
 *
 * The list the $25 and $100 tiers on GitHub Sponsors promise a place in. Kept
 * as a file rather than read from the GitHub API at build time, because the
 * tiers promise a placement and not a live feed: somebody sponsoring under a
 * handle they would rather not publish, or wanting a different logo from their
 * GitHub avatar, is a thing to honour by editing this file.
 *
 * Nothing here is published automatically. A sponsor asks to be listed, or
 * opens a pull request against this file.
 *
 * Names appear from $25 a month, logos from $100. See the README for the tiers.
 */

export interface Sponsor {
  /** As they want to be shown. Not necessarily their GitHub handle. */
  name: string;
  /** Optional, and theirs to choose — "linked wherever you want". */
  href?: string;
  /**
   * Path under `public/`, for the $100 tier and above. A name-tier sponsor has
   * none, and renders as text.
   *
   * SVG or a 2x PNG, and it has to hold up on a dark background — this section
   * has no light half to fall back to.
   */
  logo?: string;
  /** $500 and above sort to the front. */
  featured?: boolean;
}

export const sponsors: Sponsor[] = [];
