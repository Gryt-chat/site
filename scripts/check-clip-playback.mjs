/**
 * Runs the real observer callback out of Clip.tsx rather than restating it, so a
 * clip that plays before anybody scrolled to it fails here. GRYT-1068.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SOURCE = "src/components/Clip.tsx";
const source = readFileSync(SOURCE, "utf8");

/** The text between the parens of `new IntersectionObserver(` , brace-matched. */
function observerArguments(text) {
  const open = text.indexOf("new IntersectionObserver(");
  assert.notEqual(
    open,
    -1,
    `${SOURCE} no longer builds an IntersectionObserver. Clips have to start on ` +
      "arrival, not on load — if this moved, move the check with it.",
  );

  let depth = 0;
  for (let i = text.indexOf("(", open); i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return text.slice(text.indexOf("(", open) + 1, i);
  }
  throw new Error(`unbalanced parentheses after new IntersectionObserver( in ${SOURCE}`);
}

/** The first argument on its own: from the arrow's `{` to the brace that closes it. */
function firstArgument(text) {
  const start = text.indexOf("{", text.indexOf("=>"));
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(0, i + 1);
  }
  throw new Error(`unbalanced braces in the observer callback in ${SOURCE}`);
}

const callback = firstArgument(observerArguments(source));

/** A video that records what was asked of it. */
function fakeVideo() {
  const calls = [];
  return {
    calls,
    play: () => {
      calls.push("play");
      return Promise.resolve();
    },
    pause: () => calls.push("pause"),
  };
}

// The callback closes over `el`, which is the only thing it touches outside itself.
const run = (el, entry) => new Function("el", `return (${callback});`)(el)([entry]);

const arriving = fakeVideo();
run(arriving, { isIntersecting: true });
assert.deepEqual(arriving.calls, ["play"], "a clip coming into view has to start playing");

const leaving = fakeVideo();
run(leaving, { isIntersecting: false });
assert.deepEqual(leaving.calls, ["pause"], "a clip leaving the viewport has to stop");

// A rejected play() is normal — the browser is allowed to refuse — and must not throw.
const refusing = {
  play: () => Promise.reject(new Error("NotAllowedError")),
  pause: () => {},
};
await assert.doesNotReject(async () => {
  run(refusing, { isIntersecting: true });
  await new Promise((resolve) => setImmediate(resolve));
}, "a refused play() has to be caught, not left to reject unhandled");

// The bug itself: autoPlay is what made every clip start before anybody arrived.
assert.doesNotMatch(
  source,
  /\bautoPlay\b/,
  `${SOURCE} sets autoPlay again, so every clip on the page starts on load and is part ` +
    "way through by the time somebody scrolls to it.",
);

console.log("clip playback: ok, plays on arrival, pauses on exit, no autoPlay");
