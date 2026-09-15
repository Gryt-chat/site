/**
 * Content dates are calendar days, like "2026-08-26", and parse as midnight UTC. Formatted in
 * the visitor's own zone they came out a day early anywhere west of UTC, unlike the prerender.
 */
const MONTH_DAY_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const DAY_MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "August 26, 2026". */
export function monthDayYear(date: string): string {
  return MONTH_DAY_YEAR.format(new Date(date));
}

/** "26 August 2026". */
export function dayMonthYear(date: string): string {
  return DAY_MONTH_YEAR.format(new Date(date));
}

/** "2026". */
export function yearOf(date: string): string {
  return String(new Date(date).getUTCFullYear());
}
