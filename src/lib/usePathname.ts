import { useLocation } from "react-router-dom";

/**
 * The path without a trailing slash, the form every page is prerendered and linked at.
 * nginx serves /why-gryt/ as the same page, so a comparison has to agree on both.
 */
export function usePathname(): string {
  const { pathname } = useLocation();
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}
