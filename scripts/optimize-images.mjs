import sharp from "sharp";
import { join, dirname, basename, relative } from "path";
import { fileURLToPath } from "url";
import { readdir, stat } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const previewSrc = join(publicDir, "preview.png");
const full = await sharp(previewSrc)
  .webp({ quality: 82 })
  .toFile(join(publicDir, "preview.webp"));
console.log(
  `  preview.webp  ${full.width}x${full.height}  ${(full.size / 1024).toFixed(1)} KB`,
);

const sm = await sharp(previewSrc)
  .resize(1000)
  .webp({ quality: 80 })
  .toFile(join(publicDir, "preview-sm.webp"));
console.log(
  `  preview-sm.webp  ${sm.width}x${sm.height}  ${(sm.size / 1024).toFixed(1)} KB`,
);

async function findPngs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findPngs(full)));
    } else if (entry.name.endsWith(".png") && entry.name !== "og.png") {
      files.push(full);
    }
  }
  return files;
}

const blogDir = join(publicDir, "blog");
const pngs = await findPngs(blogDir);

let converted = 0;
let savedBytes = 0;

for (const png of pngs) {
  const webpPath = png.replace(/\.png$/, ".webp");
  const webpExists = await stat(webpPath).catch(() => null);
  if (webpExists) continue;

  const pngStat = await stat(png);
  const info = await sharp(png).webp({ quality: 82 }).toFile(webpPath);
  const saved = pngStat.size - info.size;
  savedBytes += saved;
  converted++;
  const rel = relative(publicDir, webpPath);
  console.log(
    `  ${rel}  ${info.width}x${info.height}  ${(pngStat.size / 1024).toFixed(0)}K → ${(info.size / 1024).toFixed(0)}K  (−${(saved / 1024).toFixed(0)}K)`,
  );
}

if (converted > 0) {
  console.log(
    `\nConverted ${converted} blog images, saved ${(savedBytes / 1024).toFixed(0)} KB total.`,
  );
} else {
  console.log("\nAll blog images already optimized.");
}

console.log("Done optimizing images.");
