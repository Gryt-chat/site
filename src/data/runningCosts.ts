import sponsorGoal from "./sponsorGoal.json";

/** What Gryt costs a year in money actually paid, in USD. Devices and rental prices aren't in it. */
export const RUNNING_COSTS: { what: string; usd: number }[] = [
  { what: "Power for the server", usd: 390 },
  { what: "Cloudflare", usd: 300 },
  { what: "Email (Postmark)", usd: 288 },
  { what: "Domains", usd: 144 },
  { what: "Code signing for Windows", usd: 120 },
  { what: "Apple and Google developer accounts", usd: 110 },
  { what: "A small VPS in front of the server", usd: 88 },
];

/** The server itself, bought once and spread over five years. Shown apart from the yearly total. */
export const SERVER_HARDWARE_USD_PER_YEAR = 4200;

/** The yearly total both pages show, rounded so it doesn't read as more precise than it is. */
export const RUNNING_TOTAL_USD = Math.round(RUNNING_COSTS.reduce((sum, c) => sum + c.usd, 0) / 100) * 100;

/** What monthly sponsors pay in a year, from the GitHub Sponsors goal at build time. */
export const COVERED_BY_SPONSORS_USD = Math.round(
  (sponsorGoal.percent / 100) * sponsorGoal.monthlyGoalUsd * 12,
);
