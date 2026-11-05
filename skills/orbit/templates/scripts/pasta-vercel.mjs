// Copia só o site pronto (dist/client) para uma pasta separada, pronta para subir na Vercel.
// Uso: npm run vercel:pasta   (gera o build e atualiza ../word-mnr-vercel)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(raiz, "dist", "client");
const destino = resolve(raiz, "..", "word-mnr-vercel");
const fora = new Set(["_ref"]); // material de referência local, não vai para o ar

if (!existsSync(join(origem, "index.html"))) {
  console.error("Falta o build. Rode: npm run build");
  process.exit(1);
}

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });
for (const nome of readdirSync(origem)) {
  if (fora.has(nome)) continue;
  cpSync(join(origem, nome), join(destino, nome), { recursive: true });
}

// Mesmos cabeçalhos de segurança e cache do projeto; o hash do script embutido é recalculado do HTML final.
const projeto = JSON.parse(readFileSync(join(raiz, "vercel.json"), "utf8"));
const html = readFileSync(join(destino, "index.html"), "utf8");
const hashes = [...html.matchAll(/<script>([^<]*)<\/script>/g)].map(
  (m) => "'sha256-" + createHash("sha256").update(m[1], "utf8").digest("base64") + "'",
);
const headers = projeto.headers.map((h) => ({
  ...h,
  headers: h.headers.map((x) =>
    x.key === "Content-Security-Policy"
      ? { ...x, value: x.value.replace(/script-src [^;]*/, "script-src 'self' " + hashes.join(" ")) }
      : x,
  ),
}));
writeFileSync(
  join(destino, "vercel.json"),
  JSON.stringify({ $schema: "https://openapi.vercel.sh/vercel.json", cleanUrls: true, headers }, null, 2) + "\n",
);

writeFileSync(
  join(destino, "LEIA-ME.txt"),
  [
    "Word MNR: site pronto para a Vercel",
    "",
    "Esta pasta já é o site final (HTML, CSS, JS e imagens). Não precisa de build nem de npm install.",
    "",
    "Opção 1, pelo terminal, dentro desta pasta:",
    "  npx vercel        (prévia)",
    "  npx vercel --prod (no ar)",
    "",
    "Opção 2, pelo GitHub: suba o conteúdo desta pasta num repositório e importe na Vercel.",
    "  Framework Preset: Other. Build Command: vazio. Output Directory: vazio (raiz).",
    "",
    "Para mudar textos ou contatos, edite o projeto original (word-mnr/src/content.ts)",
    "e rode lá: npm run vercel:pasta  (isso recria esta pasta).",
    "",
  ].join("\n"),
);

let arquivos = 0;
let bytes = 0;
const contar = (p) => {
  for (const n of readdirSync(p)) {
    const f = join(p, n);
    const s = statSync(f);
    if (s.isDirectory()) contar(f);
    else (arquivos++, (bytes += s.size));
  }
};
contar(destino);
console.log(`Pasta pronta: ${destino}  (${arquivos} arquivos, ${(bytes / 1024 / 1024).toFixed(1)} MB)`);
