// Gera as versões web das fotos de arquivo: recorte, preto e branco com contraste, WebP.
// Originais em media/ (com credits.json); saídas em public/media/.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const out = "public/media";
mkdirSync(out, { recursive: true });

const jobs = [
  // Armazém Caravella, Rio: faixa da fachada com o letreiro e os cartazes de preço.
  { src: "armazem-caravella-na-rua-catumbi-acervo-do.jpg", name: "armazem", extract: { left: 60, top: 150, width: 1800, height: 1100 }, widths: [1800, 1000] },
  // Armazém, recorte fechado nos cartazes pintados (rodapé).
  { src: "armazem-caravella-na-rua-catumbi-acervo-do.jpg", name: "armazem-cartazes", extract: { left: 560, top: 420, width: 720, height: 860 }, widths: [1200, 700] },
  // Casa Colombo, 1926: os cartazes "Não é liquidação! Porque tão barato?".
  { src: "fachada-da-confeitaria-colombo-acervo-do-instituto.jpg", name: "colombo", extract: { left: 640, top: 1330, width: 1160, height: 980 }, widths: [1160, 700] },
  // A Elegante: letreiro e vitrine, sem o passe-partout.
  { src: "fachada-da-loja-a-elegante-001fe001.jpg", name: "elegante", extract: { left: 560, top: 880, width: 900, height: 960 }, widths: [900, 600] },
  // Padaria Mar e Terra: o salão com os pães e o carrinho de entrega.
  { src: "padaria-mar-e-terra-acervo-do-instituto.jpg", name: "padaria", extract: { left: 0, top: 0, width: 1920, height: 1437 }, widths: [1600, 900] },
  // Pôster do vídeo.
  { src: "hunt-and-peck-typing-monkeytype-benchmark-poster.jpg", name: "digitando-poster", widths: [1600, 900] },
];

for (const j of jobs) {
  for (const w of j.widths) {
    let img = sharp(`media/${j.src}`);
    if (j.extract) img = img.extract(j.extract);
    await img
      .resize({ width: w, withoutEnlargement: true })
      .grayscale()
      .linear(1.18, -18)
      .webp({ quality: 72 })
      .toFile(`${out}/${j.name}-${w}.webp`);
  }
  console.log("ok", j.name);
}
