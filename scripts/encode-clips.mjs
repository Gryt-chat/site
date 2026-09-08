/**
 * Turn a screen recording into the three files a <Clip> needs, in public/home/. Sources are
 * not committed and this is not part of `yarn build`; the CRFs assume flat UI at 30fps.
 */

import { execFileSync } from "child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "home");

const args = process.argv.slice(2);
const [source, name] = args;
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};

if (!source || !name) {
  console.error(
    "usage: node scripts/encode-clips.mjs <source> <name> [--width 1440] " +
      "[--fps 30] [--av1-crf 34] [--h264-crf 20] [--start 0] [--duration n] " +
      "[--poster-at n]",
  );
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`no such source: ${source}`);
  process.exit(1);
}

const width = Number(flag("width", 1440));
const fps = Number(flag("fps", 30));
const av1Crf = String(flag("av1-crf", 34));
const h264Crf = String(flag("h264-crf", 20));
const start = flag("start", null);
const duration = flag("duration", null);
const posterAt = flag("poster-at", null);

/** Before `-i`, so ffmpeg seeks instead of decoding up to the in-point. */
const trim = [
  ...(start != null ? ["-ss", String(start)] : []),
  ...(duration != null ? ["-t", String(duration)] : []),
];

mkdirSync(OUT_DIR, { recursive: true });

/**
 * Even width, and never an upscale. `force_original_aspect_ratio` is not enough: h264 and
 * AV1 both want even dimensions, and an odd height fails the encode rather than rounding.
 */
const scale = `scale='min(${width},iw)':-2:flags=lanczos`;

const ff = (label, out, extra, seek = trim) => {
  const target = join(OUT_DIR, out);
  process.stdout.write(`  ${label} -> public/home/${out} `);
  execFileSync("ffmpeg", ["-y", ...seek, "-i", source, "-vf", scale, ...extra, target], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  console.log(`(${(statSync(target).size / 1024).toFixed(0)} kB)`);
};

/** Where the still comes from: the in-point, or `--poster-at` past it. */
const posterSeek =
  posterAt != null
    ? ["-ss", String(Number(start ?? 0) + Number(posterAt))]
    : trim;

console.log(
  `encoding ${source} at ${width}px / ${fps}fps` +
    ` / av1 crf ${av1Crf} / h264 crf ${h264Crf}` +
    (trim.length ? ` / from ${start ?? 0}s${duration ? ` for ${duration}s` : ""}` : ""),
);

// AV1 first, because it is what the page tries first. SVT-AV1 rather than libaom: Homebrew
// ships the former, and at this size the two are indistinguishable while SVT is faster.
ff("av1  ", `${name}.av1.mp4`, [
  "-an",
  "-r", String(fps),
  "-c:v", "libsvtav1",
  "-crf", av1Crf,
  "-preset", "4",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
]);

// The fallback is encoded past the point of visible loss rather than merely
// small — it is what Safari without hardware AV1 actually sees.
ff("h264 ", `${name}.mp4`, [
  "-an",
  "-r", String(fps),
  "-c:v", "libx264",
  "-crf", h264Crf,
  "-preset", "slow",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
]);

// The poster is the first frame unless `--poster-at` says otherwise, and it is what
// prefers-reduced-motion gets instead of the loop. Through sharp, since ffmpeg lacks libwebp.
const framePath = join(OUT_DIR, `${name}.poster.png`);
ff("frame ", `${name}.poster.png`, ["-frames:v", "1"], posterSeek);
const posterPath = join(OUT_DIR, `${name}.poster.webp`);
await sharp(framePath).webp({ quality: 88 }).toFile(posterPath);
rmSync(framePath);
console.log(`  poster -> public/home/${name}.poster.webp (${(statSync(posterPath).size / 1024).toFixed(0)} kB)`);

console.log("done");
