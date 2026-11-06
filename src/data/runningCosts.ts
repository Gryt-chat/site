/** What Gryt costs a year, in USD. The working is in GRYT-2030. */
export const RUNNING_COSTS: { what: string; usd: number }[] = [
  // Hetzner SX135 (€289/mo) + GEX45 (€214/mo), checked 2026-11-06.
  { what: "A comparable server, rented at Hetzner", usd: 7000 },
  { what: "Electricity", usd: 610 },
  { what: "Test devices, spread over three years", usd: 3180 },
  { what: "Services, domains and developer accounts", usd: 1050 },
];

/** What monthly sponsors pay in a year. Set by hand as sponsors come and go. */
export const COVERED_BY_SPONSORS_USD = 0;
