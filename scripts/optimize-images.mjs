import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const src = join(publicDir, "preview.png");

const full = await sharp(src).webp({ quality: 82 }).toFile(join(publicDir, "preview.webp"));
console.log(`  preview.webp  ${full.width}x${full.height}  ${(full.size / 1024).toFixed(1)} KB`);

const sm = await sharp(src).resize(1000).webp({ quality: 80 }).toFile(join(publicDir, "preview-sm.webp"));
console.log(`  preview-sm.webp  ${sm.width}x${sm.height}  ${(sm.size / 1024).toFixed(1)} KB`);

console.log("Done optimizing images.");
