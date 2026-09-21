/**
 * Types for pages.mjs, which is plain ESM so the build scripts can import it
 * without a compile step. See the comment at the top of that file.
 */

export interface StaticPage {
  /** Path without a leading slash, e.g. "why-gryt". */
  path: string;
  title: string;
  description: string;
  /** The page's "Last updated" date, YYYY-MM-DD. The sitemap's lastmod too. */
  updated?: string;
  /** Kept out of search and out of the sitemap, like /invite. */
  noindex?: boolean;
}

export interface AliasPage {
  path: string;
  /** The `path` of the StaticPage this one stands in for. */
  of: string;
}

export declare const STATIC_PAGES: StaticPage[];
export declare const ALIAS_PAGES: AliasPage[];
export declare function lastUpdated(path: string): string;
export declare function primaryFor(path: string): StaticPage | undefined;
