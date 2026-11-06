import sponsorGoal from "./sponsorGoal.json";

/** What Gryt costs a year, in USD. The working is in GRYT-2030. */
export const RUNNING_COSTS: { what: string; usd: number }[] = [
  // Hetzner SX135 (€289/mo) + GEX45 (€214/mo) on 2026-11-06; a rental includes power.
  { what: "Server and electricity", usd: 7000 },
  { what: "Test devices", usd: 3180 },
  { what: "Services, domains and developer accounts", usd: 1050 },
];

/** What monthly sponsors pay in a year, from the GitHub Sponsors goal at build time. */
export const COVERED_BY_SPONSORS_USD = Math.round(
  (sponsorGoal.percent / 100) * sponsorGoal.monthlyGoalUsd * 12,
);
