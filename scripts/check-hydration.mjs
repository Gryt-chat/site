// Loads the built pages in headless Chrome and fails on any React hydration error.
// Run after `yarn build`. GRYT-1197.

import { spawn } from "node:child_process";
import { createReadStream, existsSync, mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { delimiter, dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

if (!existsSync(join(dist, "index.html"))) {
  console.error("check-hydration: no dist/index.html. Run yarn build first.");
  process.exit(1);
}

/* Two visitors, each unlike the build machine. West of UTC with reduced motion broke the
   dates and the front page; a phone takes the invite page's other branch. */
const PROFILES = [
  { name: "los-angeles, reduced motion", timezone: "America/Los_Angeles", reducedMotion: true },
  { name: "tokyo, phone", timezone: "Asia/Tokyo", phone: true },
];

const firstDir = (dir, skip = () => false) =>
  readdirSync(join(dist, dir), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !skip(d.name))
    .map((d) => d.name)
    .sort()[0];

const noted = new Set(
  readdirSync(join(root, "content", "changelog"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, "")),
);

/* One of each template, without the trailing slash, the way every page is linked. The query
   strings and the hash are what the prerender never sees. */
const PAGES = [
  "/",
  "/#download-file",
  "/why-gryt",
  "/compare",
  "/blog",
  `/blog/${firstDir("blog")}`,
  "/changelog",
  `/changelog/${[...noted].sort()[0]}`,
  `/changelog/${firstDir("changelog", (name) => noted.has(name))}`,
  "/download",
  "/download?os=linux",
  "/invite",
  "/invite?host=example.com&code=abc123",
  "/auth/callback?code=abc&state=def",
  "/auth/callback/",
  "/this-page-does-not-exist",
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".map": "application/json",
};

/* The parts of the Dockerfile's nginx config a page load touches: files, a directory's
   index.html with or without the slash, /auth/callback, and 404.html. */
function serve(req, res) {
  const url = new URL(req.url, "http://localhost");
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    path = url.pathname;
  }
  const file = (p) => normalize(join(dist, p));
  const isFile = (p) => p.startsWith(dist + sep) && existsSync(p) && statSync(p).isFile();
  const reply = (status, p) => {
    res.writeHead(status, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
    createReadStream(p).pipe(res);
  };

  if (path === "/auth/callback") return reply(200, file("/auth/callback/index.html"));
  if (path.endsWith("/") && isFile(file(`${path}index.html`))) return reply(200, file(`${path}index.html`));
  if (isFile(file(path))) return reply(200, file(path));
  if (!path.endsWith("/") && isFile(file(`${path}/index.html`))) return reply(200, file(`${path}/index.html`));
  reply(404, join(dist, "404.html"));
}

function findChrome() {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.platform === "darwin") {
    const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    return existsSync(mac) ? mac : null;
  }
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    for (const name of ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"]) {
      if (existsSync(join(dir, name))) return join(dir, name);
    }
  }
  return null;
}

const chromePath = findChrome();
if (!chromePath) {
  // CI images ship Chrome, so a missing one there is a broken check rather than a skip.
  console.error("check-hydration: no Chrome found. Set CHROME_BIN to run it.");
  process.exit(process.env.CI ? 1 : 0);
}

const server = createServer(serve);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const profileDir = mkdtempSync(join(tmpdir(), "check-hydration-"));
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--remote-debugging-pipe",
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--mute-audio",
    "--disable-dev-shm-usage",
    // Every other host fails to resolve, so GitHub's API and an invite's server answer nothing.
    "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1",
    ...(process.platform === "linux" ? ["--no-sandbox"] : []),
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "ignore", "pipe", "pipe"] },
);

let finished = false;
function cleanUp() {
  if (finished) return;
  finished = true;
  try {
    chrome.kill("SIGKILL");
  } catch {
    // Already gone.
  }
  server.close();
  server.closeAllConnections?.();
  try {
    rmSync(profileDir, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    // Chrome can still be writing into it as it dies. It is a temp directory.
  }
}
process.on("exit", cleanUp);
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    cleanUp();
    process.exit(1);
  });
}

/* CDP over the pipe: JSON messages separated by a NUL byte, written to fd 3 and read from
   fd 4. No port, so there is no other browser to attach to by mistake. */
const toChrome = chrome.stdio[3];
const fromChrome = chrome.stdio[4];
let nextId = 0;
const pending = new Map();
const listeners = new Set();
let buffered = "";

fromChrome.on("data", (chunk) => {
  buffered += chunk.toString("utf8");
  let end;
  while ((end = buffered.indexOf("\0")) !== -1) {
    const message = JSON.parse(buffered.slice(0, end));
    buffered = buffered.slice(end + 1);
    if (message.id !== undefined) {
      const call = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) call.reject(new Error(`${call.method}: ${message.error.message}`));
      else call.resolve(message.result);
    } else {
      for (const listener of listeners) listener(message);
    }
  }
});
chrome.on("exit", (code) => {
  if (finished) return;
  for (const call of pending.values()) call.reject(new Error(`Chrome exited with ${code}`));
});

function send(method, params = {}, sessionId) {
  const id = ++nextId;
  toChrome.write(`${JSON.stringify({ id, method, params, sessionId })}\0`);
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject, method }));
}

const describe = (arg) => (arg.value !== undefined ? String(arg.value) : (arg.description ?? ""));
const HYDRATION = /Minified React error #(418|419|421|422|423|425)\b|hydrat/i;
const PHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

async function visit(page, profile) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const errors = [];
  const inflight = new Set();
  let lastActivity = Date.now();
  let loaded = false;

  const listener = ({ method, params, sessionId: from }) => {
    if (from !== sessionId) return;
    if (method === "Runtime.exceptionThrown") {
      const details = params.exceptionDetails;
      errors.push(details.exception?.description ?? details.text);
    } else if (method === "Runtime.consoleAPICalled" && params.type === "error") {
      errors.push(params.args.map(describe).join(" "));
    } else if (method === "Network.requestWillBeSent" && params.type !== "Media") {
      inflight.add(params.requestId);
      lastActivity = Date.now();
    } else if (method === "Network.loadingFinished" || method === "Network.loadingFailed") {
      inflight.delete(params.requestId);
      lastActivity = Date.now();
    } else if (method === "Page.loadEventFired") {
      loaded = true;
    }
  };
  listeners.add(listener);

  try {
    await send("Runtime.enable", {}, sessionId);
    await send("Network.enable", {}, sessionId);
    await send("Page.enable", {}, sessionId);
    await send("Emulation.setTimezoneOverride", { timezoneId: profile.timezone }, sessionId);
    await send(
      "Emulation.setEmulatedMedia",
      { features: [{ name: "prefers-reduced-motion", value: profile.reducedMotion ? "reduce" : "no-preference" }] },
      sessionId,
    );
    await send(
      "Emulation.setDeviceMetricsOverride",
      profile.phone
        ? { width: 390, height: 844, deviceScaleFactor: 3, mobile: true }
        : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );
    if (profile.phone) await send("Emulation.setUserAgentOverride", { userAgent: PHONE_UA }, sessionId);

    await send("Page.navigate", { url: origin + page }, sessionId);

    // Loaded, then half a second with nothing left to fetch: the route chunk has arrived
    // and hydrated by then. Capped, so one stuck request cannot hang the job.
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
      if (loaded && inflight.size === 0 && Date.now() - lastActivity > 500) break;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const { result } = await send(
      "Runtime.evaluate",
      { expression: "location.pathname + location.search", returnByValue: true },
      sessionId,
    );
    return { page, profile: profile.name, landed: result.value, errors: errors.filter((e) => HYDRATION.test(e)) };
  } finally {
    listeners.delete(listener);
    await send("Target.closeTarget", { targetId }).catch(() => {});
  }
}

const jobs = PROFILES.flatMap((profile) => PAGES.map((page) => ({ page, profile })));
const results = [];
let cursor = 0;

try {
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < jobs.length) {
        const { page, profile } = jobs[cursor++];
        results.push(await visit(page, profile));
      }
    }),
  );
} catch (error) {
  console.error(`check-hydration: ${error.message}`);
  cleanUp();
  process.exit(1);
}

const failed = results.filter((r) => r.errors.length > 0);
for (const r of failed) {
  console.error(`\n${r.page} (${r.profile}, landed on ${r.landed}):`);
  for (const error of r.errors) console.error(`  ${error.split("\n").slice(0, 3).join("\n  ")}`);
}

cleanUp();
if (failed.length > 0) {
  console.error(`\ncheck-hydration: ${failed.length} of ${results.length} page loads failed to hydrate cleanly.`);
  process.exit(1);
}
console.log(`check-hydration: ok, ${results.length} page loads across ${PROFILES.length} visitors, no hydration errors`);
