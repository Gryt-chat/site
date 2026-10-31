import assert from "node:assert/strict";
import { test } from "node:test";

import { toSupportResults, type DocsHit } from "../src/lib/supportSearch.ts";

const hit = (url: string, content = "text"): DocsHit => ({ type: "text", content, url });

test("drops the API reference and repeated sections", () => {
  const results = toSupportResults([
    hit("/docs/build/server-api#administration"),
    hit("/docs/use/troubleshooting#invite-issues", "first"),
    hit("/docs/use/troubleshooting#invite-issues", "second"),
  ]);
  assert.deepEqual(results, [
    {
      name: "Invite issues",
      page: "Troubleshooting",
      detail: "first",
      href: "https://docs.gryt.chat/docs/use/troubleshooting#invite-issues",
    },
  ]);
});

test("uses a matched heading as the name, with its punctuation", () => {
  const [result] = toSupportResults([
    { type: "heading", content: "My friend can't <mark>connect</mark>", url: "/docs/use/troubleshooting#x" },
  ]);
  assert.equal(result.name, "My friend can't connect");
  assert.equal(result.detail, "");
});

test("removes the highlight tags the endpoint adds", () => {
  const [result] = toSupportResults([hit("/docs/use/troubleshooting#x", "Invalid <mark>invite</mark> code.")]);
  assert.equal(result.detail, "Invalid invite code.");
});

test("drops a page when one of its sections matched", () => {
  const results = toSupportResults([
    hit("/docs/use/troubleshooting", "Troubleshooting"),
    hit("/docs/use/troubleshooting#invite-issues", "Invite issues"),
  ]);
  assert.deepEqual(results.map((r) => r.name), ["Invite issues"]);
});

test("puts help for using Gryt before hosting guides", () => {
  const results = toSupportResults([hit("/docs/host/windows"), hit("/docs/use/faq")]);
  assert.deepEqual(results.map((r) => r.name), ["Faq", "Windows"]);
});

test("removes markdown from the snippet and stops at eight", () => {
  const hits = Array.from({ length: 10 }, (_, i) => hit(`/docs/use/page-${i}`, "`server:invite`  **now**"));
  const results = toSupportResults(hits);
  assert.equal(results.length, 8);
  assert.equal(results[0].detail, "server:invite now");
});
