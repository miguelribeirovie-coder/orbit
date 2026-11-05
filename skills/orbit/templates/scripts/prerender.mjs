// Gera o HTML final: renderiza o App no servidor e injeta em dist/client/index.html.
// Também pede ao navegador, logo no início, a fonte principal (Geist, latim) para o título aparecer mais rápido.
import { readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist/server/entry-server.js")).href);
const file = resolve("dist/client/index.html");
let html = readFileSync(file, "utf8").replace("<!--app-html-->", render());

const fonte = readdirSync(resolve("dist/client/assets")).find((n) => /^geist-latin-wght-normal-.*\.woff2$/.test(n));
if (fonte && !html.includes(fonte)) {
  html = html.replace("</head>", `  <link rel="preload" href="/assets/${fonte}" as="font" type="font/woff2" crossorigin />\n  </head>`);
}

writeFileSync(file, html);
rmSync(resolve("dist/server"), { recursive: true, force: true });
console.log("prerender ok →", file, fonte ? `(pré-carrega ${fonte})` : "");
