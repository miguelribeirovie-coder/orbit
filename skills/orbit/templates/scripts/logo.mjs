// Vetoriza a logo enviada (media/brand/logo-sheet.webp) em SVG.
// Separa as letras (Gelo) da barra (Aço) pela cor, amplia 4x e traça cada camada com potrace.
// Saída: src/components/logo-paths.ts (para o componente) e public/brand/*.svg (arquivos soltos).
import sharp from "sharp";
import potrace from "potrace";
import { mkdirSync, writeFileSync } from "node:fs";

const SRC = "media/brand/logo-sheet.webp";
const S = 4; // ampliação antes de traçar

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const clamp = (v) => Math.max(0, Math.min(1, v));

// Mede a barra (Aço) como retângulo: colunas e linhas onde o tom azulado domina.
async function barRect([x0, y0, x1, y1]) {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, C = info.channels;
  const cols = {}, rows = {};
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * C, r = data[i], g = data[i + 1], b = data[i + 2], l = lum(r, g, b);
      if (b - r >= 17 && l > 90 && l < 170) { cols[x] = (cols[x] || 0) + 1; rows[y] = (rows[y] || 0) + 1; }
    }
  const xs = Object.entries(cols).filter(([, n]) => n > 20).map(([x]) => +x);
  const ys = Object.entries(rows).filter(([, n]) => n > 4).map(([y]) => +y);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) + 1, h: Math.max(...ys) - Math.min(...ys) + 1 };
}

async function layers({ box, bgLum, inkLum }) {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0, h = y1 - y0;
  const { data, info } = await sharp(SRC)
    .extract({ left: x0, top: y0, width: w, height: h })
    .resize({ width: w * S, height: h * S, kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const letters = Buffer.alloc(n, 255);
  const bar = Buffer.alloc(n, 255);
  for (let p = 0; p < n; p++) {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    const tint = b - r; // a barra (Aço) é azulada; letras e fundo são neutros
    const barCov = clamp((tint - 13) / 9);
    const letterCov = tint < 17 ? clamp((lum(r, g, b) - bgLum) / (inkLum - bgLum)) : 0;
    letters[p] = Math.round(255 * (1 - letterCov));
    bar[p] = Math.round(255 * (1 - barCov));
  }
  const toPng = (buf) => sharp(buf, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  return { w: info.width, h: info.height, letters: await toPng(letters), bar: await toPng(bar) };
}

const trace = (buf) =>
  new Promise((res, rej) => {
    const p = new potrace.Potrace({ threshold: 128, turdSize: 8, optTolerance: 0.3, alphaMax: 1 });
    p.loadImage(buf, (err) => {
      if (err) return rej(err);
      const tag = p.getPathTag();
      res(tag.match(/ d="([^"]+)"/)[1].replace(/[0-9]+[.][0-9]+/g, (n) => String(Math.round(+n * 10) / 10)));
    });
  });

// Versão principal (fundo Grafite): letras claras sobre fundo escuro.
const main = await layers({ box: [756, 214, 1244, 348], bgLum: 39, inkLum: 239 });
// Símbolo (fundo Gelo): letras escuras sobre fundo claro (invertemos a escala de luminância).
const sym = await layers({ box: [172, 726, 494, 960], bgLum: 239, inkLum: 39 });

const rect = (r, [bx, by]) => ({ x: (r.x - bx) * S, y: (r.y - by) * S, w: r.w * S, h: r.h * S });
const out = {
  main: { w: main.w, h: main.h, letters: await trace(main.letters), bar: rect(await barRect([1150, 200, 1230, 360]), [756, 214]) },
  symbol: { w: sym.w, h: sym.h, letters: await trace(sym.letters), bar: rect(await barRect([360, 700, 430, 980]), [172, 726]) },
};

writeFileSync(
  "src/components/logo-paths.ts",
  `// Gerado por scripts/logo.mjs a partir de media/brand/logo-sheet.webp. Não editar à mão.\nexport const logo = ${JSON.stringify(out, null, 2)} as const;\n`
);

mkdirSync("public/brand", { recursive: true });
// O vão do desenho original: as letras param a 3px (na escala original) de cada lado da barra.
const GAP = 3 * S;
const gapRects = (v) => [
  { x: 0, w: v.bar.x - GAP },
  { x: v.bar.x + v.bar.w + GAP, w: v.w - (v.bar.x + v.bar.w + GAP) },
];
const svg = (v, letterFill, barFill, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v.w} ${v.h}"><defs><clipPath id="vao">${gapRects(v)
    .map((r) => `<rect x="${r.x}" y="0" width="${r.w}" height="${v.h}"/>`)
    .join("")}</clipPath></defs>${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}<path fill="${letterFill}" fill-rule="evenodd" clip-path="url(#vao)" d="${v.letters}"/><rect fill="${barFill}" x="${v.bar.x}" y="${v.bar.y}" width="${v.bar.w}" height="${v.bar.h}"/></svg>\n`;
writeFileSync("public/brand/word-mnr-grafite.svg", svg(out.main, "#EAF0F5", "#75818D"));
writeFileSync("public/brand/word-mnr-gelo.svg", svg(out.main, "#23272C", "#75818D"));
writeFileSync("public/brand/mnr-simbolo.svg", svg(out.symbol, "#EAF0F5", "#75818D"));
console.log("ok", out.main.w, out.main.h, out.main.letters.length, JSON.stringify(out.main.bar), out.symbol.letters.length, JSON.stringify(out.symbol.bar));
