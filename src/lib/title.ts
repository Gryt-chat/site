/**
 * Document titles.
 *
 * Every page reads `<name> | Gryt`, so a tab strip with four Gryt pages open
 * is still readable and a search result carries the brand without the page
 * having to repeat it in its own heading.
 *
 * The crawlers never run this code. `scripts/prerender-blog.mjs` writes the
 * same titles into the static HTML it emits per route, and it has its own copy
 * of `SITE_NAME` and `pageTitle` for that reason. Change one, change the other.
 */

export const SITE_NAME = 'Gryt'

/** The home page leads with the brand, since there is no page name to lead with. */
export const HOME_TITLE = `${SITE_NAME} | Voice, Text & Video Chat`

export function pageTitle(name: string): string {
  return `${name} | ${SITE_NAME}`
}
