/**
 * Reads "N% towards $X per month goal" off the public GitHub Sponsors page at build time,
 * into a committed file, and only on success. No token: GitHub shows the goal to anyone.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "sponsorGoal.json");
const PAGE = "https://github.com/sponsors/Gryt-chat";
const TIMEOUT_MS = 8000;

function keepExisting(why: string) {
  let current = "unreadable";
  try {
    current = readFileSync(OUT, "utf8").trim();
  } catch {
    /* Reported below; the build carries on either way. */
  }
  console.warn(`fetch-sponsor-goal: ${why}. Keeping ${current}.`);
}

export function parseGoal(html: string): { percent: number; monthlyGoalUsd: number } | null {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const m = /(\d+)% towards \$([\d,]+) per month goal/.exec(text);
  if (!m) return null;
  const percent = Number(m[1]);
  const monthlyGoalUsd = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(percent) || !(monthlyGoalUsd > 0)) return null;
  return { percent, monthlyGoalUsd };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const response = await fetch(PAGE, {
      headers: { "user-agent": "gryt-site-build" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      keepExisting(`GitHub answered ${response.status}`);
    } else {
      const goal = parseGoal(await response.text());
      if (!goal) {
        keepExisting("no money goal on the page");
      } else {
        writeFileSync(OUT, `${JSON.stringify(goal, null, 2)}\n`);
        console.log(`fetch-sponsor-goal: ${goal.percent}% of $${goal.monthlyGoalUsd} a month.`);
      }
    }
  } catch (error) {
    keepExisting(`could not reach GitHub (${error instanceof Error ? error.message : error})`);
  }
}
