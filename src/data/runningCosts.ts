import sponsorGoal from "./sponsorGoal.json";

/** What Gryt costs a year in money actually paid, in euros. Devices and rental prices aren't in it. */
export const RUNNING_COSTS: { what: string; eur: number }[] = [
  { what: "Power for the server", eur: 320 },
  { what: "Cloudflare", eur: 250 },
  { what: "Email (Postmark)", eur: 240 },
  { what: "Domains", eur: 120 },
  { what: "Code signing for Windows", eur: 100 },
  { what: "Apple and Google developer accounts", eur: 90 },
  { what: "A small VPS in front of the server", eur: 75 },
];

/** The server itself, bought once and spread over five years. Shown apart from the yearly total. */
export const SERVER_HARDWARE_EUR_PER_YEAR = 3500;

/** The yearly total both pages show, rounded so it doesn't read as more precise than it is. */
export const RUNNING_TOTAL_EUR = Math.round(RUNNING_COSTS.reduce((sum, c) => sum + c.eur, 0) / 100) * 100;

/* GitHub Sponsors only charges in US dollars. A fixed rate, because "about" is all these figures claim. */
export const EUR_PER_USD = 0.85;

export const eur = (n: number) => "€" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** What monthly sponsors pay in a year, in euros, from the GitHub Sponsors goal at build time. */
export const COVERED_BY_SPONSORS_EUR = Math.round(
  (sponsorGoal.percent / 100) * sponsorGoal.monthlyGoalUsd * 12 * EUR_PER_USD,
);
