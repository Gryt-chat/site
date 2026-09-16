// detectOS against real user agents. A phone read as a Mac or as Linux was handed a
// .dmg or an AppImage, and /download started it on its own (GRYT-1271).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  detectOS,
  downloadTarget,
  fileAskedFor,
  isDesktop,
  PACKAGE_MANAGERS,
  packageManagersFor,
  STORES,
  storesFor,
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

const PLATFORMS = ["windows", "macos", "linux", "ios", "android", null];

test("every platform gets every store and every package manager", () => {
  for (const os of PLATFORMS) {
    assert.deepEqual(new Set(storesFor(os)), new Set(STORES), `stores for ${os}`);
    assert.equal(storesFor(os).length, STORES.length, `stores for ${os}`);
    assert.deepEqual(new Set(packageManagersFor(os)), new Set(PACKAGE_MANAGERS), `commands for ${os}`);
    assert.equal(packageManagersFor(os).length, PACKAGE_MANAGERS.length, `commands for ${os}`);
  }
});

test("your own platform leads, then its Apple twin, then what's open, then what's coming", () => {
  const name = (s) => `${s.badge.src.replace(/^\/badges\/|\.\w+$/g, "")}${s.url ? "" : " (soon)"}`;
  const row = (os) => storesFor(os).map(name);
  const rest = ["flathub (soon)", "mac-app-store (soon)", "app-store (soon)", "google-play (soon)", "f-droid (soon)"];

  assert.deepEqual(row("windows"), ["microsoft-store", "snap-store", ...rest]);
  assert.deepEqual(row(null), ["microsoft-store", "snap-store", ...rest]);
  assert.deepEqual(row("linux"), ["snap-store", "flathub (soon)", "microsoft-store", ...rest.slice(1)]);
  assert.deepEqual(row("macos"), [
    "mac-app-store (soon)", "app-store (soon)", "microsoft-store", "snap-store",
    "flathub (soon)", "google-play (soon)", "f-droid (soon)",
  ]);
  assert.deepEqual(row("ios"), [
    "app-store (soon)", "mac-app-store (soon)", "microsoft-store", "snap-store",
    "flathub (soon)", "google-play (soon)", "f-droid (soon)",
  ]);
  assert.deepEqual(row("android"), [
    "google-play (soon)", "f-droid (soon)", "microsoft-store", "snap-store",
    "flathub (soon)", "mac-app-store (soon)", "app-store (soon)",
  ]);
});

test("the commands follow the same order, so Windows leads with the ones on their way", () => {
  const terminal = (os) => packageManagersFor(os).map((p) => `${p.label}${p.command ? "" : " (soon)"}`);
  const coming = ["winget · Windows (soon)", "Scoop · Windows (soon)", "Chocolatey · Windows (soon)"];

  assert.deepEqual(terminal("windows"), [...coming, "Homebrew · macOS", "snap · Linux", "AUR · Arch Linux"]);
  assert.deepEqual(terminal("linux"), ["snap · Linux", "AUR · Arch Linux", "Homebrew · macOS", ...coming]);
  assert.deepEqual(terminal("macos"), ["Homebrew · macOS", "snap · Linux", "AUR · Arch Linux", ...coming]);
  assert.deepEqual(terminal("android"), terminal("macos"));
});

test("the file download starts closed, and only a link to it opens it", () => {
  assert.equal(fileAskedFor("", true), false);
  assert.equal(fileAskedFor("#download", true), false);
  assert.equal(fileAskedFor("#download-file", true), true);
  /* The prerender and the render that hydrates it have no hash to go on. */
  assert.equal(fileAskedFor("#download-file", false), false);
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
