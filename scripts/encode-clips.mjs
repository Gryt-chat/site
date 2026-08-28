/**
 * Turn a screen recording into the three files a <Clip> needs.
 *
 * The AV1 + H.264 pair the changelog uses was made by hand outside the repo,
 * which meant the settings lived in somebody's shell history. They live here
 * now.
 *
 *   node scripts/encode-clips.mjs <source> <name> \
 *     [--width 1440] [--fps 30] [--av1-crf 34] [--h264-crf 20] \
 *     [--start 0] [--duration <seconds>] [--poster-at <seconds>]
 *
 * Writes public/home/<name>.av1.mp4, <name>.mp4 and <name>.poster.webp.
 *
 * The CRFs default to what flat UI wants at 30fps. A capture with real motion
 * in it — a game inside a screen share, a fast scroll — wants a lower number,
 * and 60fps wants one too, because a frame gets half the time on screen to hide
 * its own artefacts. The two front-page clips are encoded at `--av1-crf 30
 * --h264-crf 21 --fps 60`; the commands are in Hero.tsx and Voice.tsx beside
 * the constants that name the files.
 *
 * `--start` and `--duration` trim, and they go before `-i` so ffmpeg seeks
 * rather than decoding and throwing away everything up to the in-point.
 *
 * `--poster-at` takes the still from somewhere other than the first frame,
 * counted from the start of the trimmed clip. The poster is what
 * `prefers-reduced-motion` gets *instead of* the video, so it has to be a frame
 * worth looking at on its own — and the first frame of a recording is often a
 * settled empty state or a panel caught mid-transition. The clip still starts
 * where `--start` says.
 *
 * Sources are not committed — they are hundreds of megabytes of raw capture and
 * nothing rebuilds from them. Only the three outputs go in the repo, which is
 * also why this is not part of `yarn build`: on CI there would be nothing to
 * encode.
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
 * Even width, and never an upscale.
 *
 * `force_original_aspect_ratio` is not enough on its own: h264 and AV1 both
 * want even dimensions, and a source whose height goes odd after scaling fails
 * the encode rather than rounding.
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

// AV1 first, because it is what the page tries first. SVT-AV1 rather than
// libaom: Homebrew's ffmpeg ships the former and not the latter, and at this
// size the two are indistinguishable while SVT is minutes faster. `preset 4` is
// slow enough to matter and fast enough to sit through; crf 34 is visually
// clean on flat UI, which is nearly all of a screen recording.
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

// The poster is the first frame unless `--poster-at` says otherwise, and it is
// also the still that prefers-reduced-motion gets instead of the loop — so a
// clip whose first frame is an empty state or a half-drawn panel should say
// otherwise.
//
// Through sharp rather than ffmpeg, because ffmpeg is not reliably built with
// libwebp — Homebrew's is not — and sharp is already a dependency here for the
// image pass.
const framePath = join(OUT_DIR, `${name}.poster.png`);
ff("frame ", `${name}.poster.png`, ["-frames:v", "1"], posterSeek);
const posterPath = join(OUT_DIR, `${name}.poster.webp`);
await sharp(framePath).webp({ quality: 88 }).toFile(posterPath);
rmSync(framePath);
console.log(`  poster -> public/home/${name}.poster.webp (${(statSync(posterPath).size / 1024).toFixed(0)} kB)`);

console.log("done");
