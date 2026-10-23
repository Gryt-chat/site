import assert from "node:assert/strict";
import test from "node:test";

import rehypeCitations from "./rehype-citations.ts";

const t = (value: string) => ({ type: "text", value });
const el = (tagName: string, ...children: object[]) => ({ type: "element", tagName, properties: {}, children });

test("links [n] in the text to the matching reference", () => {
  const tree = {
    type: "root",
    children: [
      el("p", t("Opus [1] and QUIC [2], not [9]."), el("code", t("a[1]"))),
      el("h2", t("References")),
      t("\n"),
      el("ol", el("li", t("Opus")), t("\n"), el("li", t("QUIC"))),
    ],
  };
  rehypeCitations()(tree);
  const p = tree.children[0] as { children: { tagName?: string; value?: string; properties?: { href?: string }; children?: { value: string }[] }[] };
  const links = p.children.filter((c) => c.tagName === "a");
  assert.deepEqual(links.map((a) => a.properties?.href), ["#ref-1", "#ref-2"]);
  assert.ok(p.children.some((c) => c.value?.includes("[9]")), "out-of-range stays text");
  assert.equal(p.children.at(-1)?.tagName, "code", "code is left alone");
  const ol = tree.children[3] as { children: { tagName?: string; properties?: { id?: string } }[] };
  assert.deepEqual(ol.children.filter((c) => c.tagName === "li").map((li) => li.properties?.id), ["ref-1", "ref-2"]);
});

test("a post without a References heading is untouched", () => {
  const tree = { type: "root", children: [el("p", t("array[1]"))] };
  rehypeCitations()(tree);
  assert.deepEqual(tree.children[0].children, [t("array[1]")]);
});
