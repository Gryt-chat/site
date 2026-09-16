// detectOS against real user agents. A phone read as a Mac or as Linux was handed a
// .dmg or an AppImage, and /download started it on its own (GRYT-1271).

import assert from "node:assert/strict";
import test from "node:test";

import {
  comingSoon,
  detectOS,
  downloadTarget,
  forPlatform,
  isDesktop,
  PACKAGE_MANAGERS,
  STORES,
} from "../src/lib/releases.ts";

const DEVICES = [
  {
    name: "Windows 11, Chrome",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    touch: 0,
    os: "windows",
  },
  {
    name: "Windows, Firefox",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
    touch: 0,
    os: "windows",
  },
  {
    name: "Surface with a touch screen, Edge",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
    touch: 10,
    os: "windows",
  },
  {
    name: "Mac with Apple silicon, Chrome",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    touch: 0,
    os: "macos",
  },
  {
    name: "Mac, Safari",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
    touch: 0,
    os: "macos",
  },
  {
    name: "Linux, Firefox",
    ua: "Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
    touch: 0,
    os: "linux",
  },
  {
    name: "Ubuntu laptop with a touch screen",
    ua: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
    touch: 10,
    os: "linux",
  },
  {
    name: "iPhone, Safari",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
    touch: 5,
    os: "ios",
  },
  {
    name: "iPhone, Chrome",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.101 Mobile/15E148 Safari/604.1",
    touch: 5,
    os: "ios",
  },
  {
    name: "iPad asking for the desktop site, which is the default",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15",
    touch: 5,
    os: "ios",
  },
  {
    name: "iPad asking for the mobile site",
    ua: "Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
    touch: 5,
    os: "ios",
  },
  {
    name: "Android phone, Chrome's reduced user agent",
    ua: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
    touch: 5,
    os: "android",
  },
  {
    name: "Android tablet",
    ua: "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    touch: 10,
    os: "android",
  },
  {
    name: "Android, Firefox",
    ua: "Mozilla/5.0 (Android 15; Mobile; rv:143.0) Gecko/143.0 Firefox/143.0",
    touch: 5,
    os: "android",
  },
];

for (const device of DEVICES) {
  test(`${device.name} is ${device.os}`, () => {
    assert.equal(detectOS(device.ua, device.touch), device.os);
  });
}

test("the build machine's own user agent is not a phone", () => {
  assert.equal(detectOS("Node.js/22", 0), "linux");
});

test("only Windows, macOS and Linux have a file to download", () => {
  assert.deepEqual(
    ["windows", "macos", "linux", "ios", "android", null].map(isDesktop),
    [true, true, true, false, false, false],
  );
});

test("?os= never hands a phone a file", () => {
  assert.equal(downloadTarget("ios", "macos"), "ios");
  assert.equal(downloadTarget("android", "linux"), "android");
  assert.equal(downloadTarget("windows", "linux"), "linux");
  assert.equal(downloadTarget("macos", "ios"), "macos");
  assert.equal(downloadTarget(null, "linux"), null);
});

test("the visitor's own platform comes first, and the rest keep their order", () => {
  const live = (os) => forPlatform(STORES, os).filter((s) => s.listing).map((s) => s.os);
  assert.deepEqual(live("windows"), ["windows", "linux"]);
  assert.deepEqual(live("linux"), ["linux", "windows"]);

  const commands = (os) => forPlatform(PACKAGE_MANAGERS, os).filter((p) => p.command).map((p) => p.name);
  assert.equal(commands("macos")[0], "Homebrew");
  assert.deepEqual(commands("linux").slice(0, 2), ["snap", "the AUR"]);
});

test("a store without a listing is named in the coming-soon line, never drawn as a badge", () => {
  for (const store of STORES.filter((s) => !s.listing)) {
    assert.match(comingSoon("windows") ?? "", new RegExp(store.name));
  }
  assert.match(comingSoon("ios") ?? "", /^the App Store, /);
  assert.match(comingSoon("windows") ?? "", /^the Mac App Store, .* and winget$/);
});
