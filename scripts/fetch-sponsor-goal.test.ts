import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGoal } from "./fetch-sponsor-goal.ts";

test("reads the goal through GitHub's markup", () => {
  const html = '<span class="x">12% </span>\n  towards <strong>$1,935</strong> per month goal';
  assert.deepEqual(parseGoal(html), { percent: 12, monthlyGoalUsd: 1935 });
});

test("a sponsor-count goal, or no goal, gives nothing", () => {
  assert.equal(parseGoal("3 out of 10 monthly sponsors"), null);
  assert.equal(parseGoal("<html></html>"), null);
});
