#!/usr/bin/env node
// Instalador da skill orbit para o Claude Code (Windows, Mac e Linux).
//
//   node instalar.mjs              # instala para o seu usuário (~/.claude/skills)
//   node instalar.mjs --projeto    # instala só neste projeto (./.claude/skills)
//   node instalar.mjs --ajuda      # todas as opções

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const ORIGEM = path.join(RAIZ, "skills", "orbit");
const lib = await import(new URL("./skills/orbit/ferramentas/lib.mjs", import.meta.url));
const { lerArgs, expandirCasa, copiarPasta, versaoNodeOk, temComando, SKILLS_USUARIO, verde, amarelo, vermelho, cinza, negrito } = lib;

const AJUDA = `
${negrito("Instalar a skill orbit")}

  node instalar.mjs [opções]

  --projeto           instala em ./.claude/skills (só neste projeto)
  --destino <pasta>   instala em outra pasta de skills
  --dentro            guarda as skills de terceiros dentro de orbit/skills
                      (assim elas não aparecem soltas na lista de skills do Claude)
  --sem-terceiros     instala só o método, sem baixar as skills de terceiros
  --shadcn            também registra o MCP de componentes shadcn no Claude Code
  --forcar            substitui skills de terceiros que já existem com o mesmo nome
  --mais-recente      baixa a versão mais nova das skills de terceiros (em vez da testada)
  --ajuda             mostra esta ajuda
`;

const args = lerArgs(process.argv.slice(2), ["destino", "apenas"]);
if (args.ajuda || args.help) { console.log(AJUDA); process.exit(0); }
if (!versaoNodeOk(18)) {
  console.error(vermelho(`Preciso do Node 18 ou mais novo (você tem ${process.versions.node}). Baixe em https://nodejs.org`));
  process.exit(1);
}

const base = args.projeto
  ? path.resolve(".claude", "skills")
  : expandirCasa(args.destino) || SKILLS_USUARIO;
const alvo = path.join(base, "orbit");

console.log(`\n${negrito("Orbit")} ${cinza("· o método Word MNR para criar sites")}`);
console.log(cinza(`Instalando em ${alvo}`));

// 1. O método (SKILL.md, references, templates, ferramentas)
if (path.resolve(alvo) !== path.resolve(ORIGEM)) {
  copiarPasta(ORIGEM, alvo, {
    // Mantém as skills de terceiros que já estão em orbit/skills.
    pular: (de) => path.relative(ORIGEM, de).split(path.sep)[0] === "skills" && path.basename(de) !== "skills" && path.basename(de) !== "README.md",
  });
}
console.log(`${verde("✓")} método instalado`);

// 2. As skills de terceiros, baixadas das fontes originais
let falhas = 0;
if (!args["sem-terceiros"]) {
  const { baixarSkills } = await import(pathToFileURL(path.join(alvo, "ferramentas", "baixar-skills.mjs")).href);
  const r = await baixarSkills({
    destino: args.dentro ? path.join(alvo, "skills") : base,
    forcar: args.forcar,
    "mais-recente": args["mais-recente"],
    apenas: args.apenas,
  });
  falhas = r.falhas;
}

// 3. Componentes shadcn (MCP), opcional
if (args.shadcn) {
  if (temComando("claude")) {
    const r = spawnSync("claude", ["mcp", "add", "shadcn", "-s", "user", "--", "npx", "-y", "@jpisnice/shadcn-ui-mcp-server"], { stdio: "inherit", shell: process.platform === "win32" });
    console.log(r.status === 0 ? `${verde("✓")} MCP shadcn registrado` : amarelo("• não consegui registrar o MCP shadcn (talvez já exista)"));
  } else {
    console.log(amarelo("• comando `claude` não encontrado; registre depois com:"));
    console.log(cinza("  claude mcp add shadcn -s user -- npx -y @jpisnice/shadcn-ui-mcp-server"));
  }
}

console.log(`
${falhas ? amarelo("Instalado, mas algumas skills de terceiros não baixaram.") : verde(negrito("Pronto!"))}

  Abra uma sessão ${negrito("nova")} do Claude Code e peça, por exemplo:
    ${cinza('"cria um site para a minha barbearia"')}
    ${cinza('"quero uma landing page futurista para a minha clínica"')}
  ou chame direto: ${negrito("/orbit")}

  Conferir a instalação:  node "${path.join(alvo, "ferramentas", "baixar-skills.mjs")}" --verificar
${args.shadcn ? "" : `  Componentes shadcn:     node instalar.mjs --shadcn   ${cinza("(uma vez por computador)")}\n`}`);
process.exit(falhas ? 1 : 0);
