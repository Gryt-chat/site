/**
 * Document titles: every page reads `<name> | Gryt`. `scripts/prerender-blog.mjs` has its
 * own copy of `SITE_NAME` and `pageTitle` for the static HTML — change one, change both.
 */

export const SITE_NAME = 'Gryt'

/** The home page leads with the brand, since there is no page name to lead with. */
export const HOME_TITLE = `${SITE_NAME} | Voice, Text & Video Chat`

export function pageTitle(name: string): string {
  return `${name} | ${SITE_NAME}`
}
