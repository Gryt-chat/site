import { useLocation } from "react-router-dom";

/**
 * The path without a trailing slash. nginx answers /why-gryt with a 301 to /why-gryt/, and
 * every page was prerendered at /why-gryt, so a comparison has to agree on both.
 */
export function usePathname(): string {
  const { pathname } = useLocation();
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}
