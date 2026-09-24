// detectOS against real user agents. A phone read as a Mac or as Linux was handed a
// .dmg or an AppImage, and /download started it on its own (GRYT-1271).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  comingLater,
  detectOS,
  downloadTarget,
  isDesktop,
  liveCommands,
  liveStore,
  PACKAGE_MANAGERS,
  standInFor,
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

test("a platform leads with its store only once that store is open", () => {
  assert.equal(liveStore("windows")?.name, "Microsoft Store");
  assert.equal(liveStore("linux")?.name, "Snap Store");
  for (const os of ["macos", "ios", "android", null]) assert.equal(liveStore(os), null, `store for ${os}`);
  assert.equal(standInFor("linux"), "Flatpak");
  assert.equal(standInFor("windows"), undefined);
});

test("only commands that install a current build are offered", () => {
  const names = (os) => liveCommands(os).map((p) => p.name);
  assert.deepEqual(names("linux"), ["snap", "AUR"]);
  assert.deepEqual(names("macos"), ["Homebrew"]);
  assert.deepEqual(names("windows"), []);
});

/* No faded badges: a store that isn't open is a name on the "Coming later" line and nothing else. */
test("everything not open yet is named once, and everything open says why", () => {
  const closed = [...STORES.filter((s) => !s.url), ...PACKAGE_MANAGERS.filter((p) => !p.command)];
  assert.deepEqual(comingLater(), closed.map((x) => x.name));
  assert.equal(new Set(comingLater()).size, comingLater().length);
  for (const store of STORES.filter((s) => s.url)) assert.ok(store.why, `${store.name} has no why`);
});

/* width and height size the img before it loads, so a wrong pair stretches the badge until then. */
test("every badge file is there, drawn at its own proportions", () => {
  for (const { badge } of STORES) {
    const file = readFileSync(new URL(`../public${badge.src}`, import.meta.url));
    let natural;
    if (badge.src.endsWith(".png")) {
      natural = { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
    } else {
      const root = file.toString("utf8").match(/<svg[^>]*>/)[0];
      natural = {
        width: Number(root.match(/\bwidth="([\d.]+)/)[1]),
        height: Number(root.match(/\bheight="([\d.]+)/)[1]),
      };
    }
    const drift = Math.abs(badge.width / badge.height - natural.width / natural.height);
    assert.ok(drift < 0.02, `${badge.src} is ${natural.width}x${natural.height}, STORES says ${badge.width}x${badge.height}`);
  }
});
