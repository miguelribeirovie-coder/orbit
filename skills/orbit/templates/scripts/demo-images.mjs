// Fotos dos sites de exemplo (coloridas), em WebP. Originais em media/demo/ com credits.json.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const out = "public/demo";
mkdirSync(out, { recursive: true });
const jobs = [
  ["croissants-au-beurre-18953292873.jpg", "padaria", { left: 0, top: 200, width: 1200, height: 1100 }],
  ["side-wheat-bread-national-bakery-ooty-aug25.jpg", "padaria-2", { left: 0, top: 0, width: 1920, height: 1100 }],
  ["shelve-with-various-hair-colours-hair-dyes.jpg", "salao", null],
  ["attractive-hairdresser-is-shaving-male-beard-with.jpg", "salao-2", null],
  ["mobile-wash-partner-washing-a-car.jpg", "lava", null],
  ["car-wash.jpg", "lava-2", null],
  ["project-365-180-290614-cleanup-time.jpg", "lava-3", null],
  ["free-close-clothes-rack-image.webp", "loja", null],
  ["a-dental-chair-in-a-dentist-clinic.jpg", "clinica", null],
  ["ley.jpg", "advocacia", null],
];
for (const [src, name, extract] of jobs) {
  for (const w of [1200, 640]) {
    let img = sharp(`media/demo/${src}`);
    if (extract) img = img.extract(extract);
    await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(`${out}/${name}-${w}.webp`);
  }
  console.log("ok", name);
}
