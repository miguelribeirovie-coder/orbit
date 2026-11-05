#!/usr/bin/env node
// Confere se a skill orbit está inteira: frontmatter, links internos, lock das skills
// de terceiros e, com --completo, se cada caminho citado nas instruções existe de verdade.
//
//   node ferramentas/verificar.mjs              # checa só o que é deste repositório
//   node ferramentas/verificar.mjs --completo   # também as skills de terceiros instaladas

import fs from "node:fs";
import path from "node:path";
import { PASTA_SKILL, lerLock, lerArgs, lerFrontmatter, acharSkill, verde, vermelho, amarelo, cinza, negrito } from "./lib.mjs";

const args = lerArgs(process.argv.slice(2), ["projeto"]);
const projeto = args.projeto ? path.resolve(args.projeto) : process.cwd();
const erros = [];
const avisos = [];
const ok = (msg) => console.log(`  ${verde("✓")} ${msg}`);
const erro = (msg) => { erros.push(msg); console.log(`  ${vermelho("✗")} ${msg}`); };
const aviso = (msg) => { avisos.push(msg); console.log(`  ${amarelo("•")} ${msg}`); };

function arquivosMd(pasta) {
  const lista = [];
  for (const item of fs.readdirSync(pasta, { withFileTypes: true })) {
    const p = path.join(pasta, item.name);
    if (item.isDirectory()) {
      if (path.relative(PASTA_SKILL, p) === "skills" || item.name === "node_modules") continue;
      lista.push(...arquivosMd(p));
    } else if (item.name.endsWith(".md")) lista.push(p);
  }
  return lista;
}

// 1. Frontmatter
console.log(`\n${negrito("SKILL.md")}`);
const skillMd = fs.readFileSync(path.join(PASTA_SKILL, "SKILL.md"), "utf8");
const fm = lerFrontmatter(skillMd);
if (!fm) erro("SKILL.md sem frontmatter (--- name / description ---)");
else {
  fm.name === path.basename(PASTA_SKILL) || fm.name === "orbit"
    ? ok(`name: ${fm.name}`)
    : erro(`name "${fm.name}" diferente da pasta`);
  if (!fm.description) erro("description vazia");
  else if (fm.description.length > 1024) erro(`description com ${fm.description.length} caracteres (máximo 1024)`);
  else ok(`description com ${fm.description.length} caracteres`);
}
if (/\r\n/.test(skillMd)) aviso("SKILL.md com quebras de linha do Windows (CRLF)");

// 2. Links internos (references/ e templates/)
console.log(`\n${negrito("Arquivos citados")}`);
const mds = arquivosMd(PASTA_SKILL);
const citados = new Map();
for (const md of mds) {
  const texto = fs.readFileSync(md, "utf8");
  for (const m of texto.matchAll(/(?<![\w./-])((?:references|templates|ferramentas)\/[\w./-]*\w)/g)) {
    const rel = m[1];
    if (!citados.has(rel)) citados.set(rel, path.relative(PASTA_SKILL, md));
  }
}
let citadosOk = 0;
for (const [rel, onde] of citados) {
  const candidatos = [path.join(PASTA_SKILL, rel), path.join(PASTA_SKILL, "templates", rel)];
  if (candidatos.some((c) => fs.existsSync(c))) citadosOk++;
  else if (/\.(md|mjs|js|ts|tsx|css|json|html)$/.test(rel) || !path.extname(rel)) erro(`${rel} (citado em ${onde}) não existe`);
}
ok(`${citadosOk} de ${citados.size} caminhos citados existem`);

// 3. Lock das skills de terceiros
console.log(`\n${negrito("skills.lock.json")}`);
let lock;
try {
  lock = lerLock();
  const nomes = new Set();
  for (const f of lock.fontes) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(f.repo)) erro(`repo inválido: ${f.repo}`);
    if (!/^[0-9a-f]{40}$/.test(f.commit)) erro(`${f.repo}: commit precisa ter 40 caracteres hexadecimais`);
    if (!f.licenca) erro(`${f.repo}: falta a licença`);
    for (const s of f.skills) {
      if (nomes.has(s.nome)) erro(`skill repetida: ${s.nome}`);
      nomes.add(s.nome);
    }
  }
  ok(`${lock.fontes.length} fontes, ${nomes.size} skills, todas com commit fixo e licença`);
} catch (e) {
  erro(`não consegui ler: ${e.message}`);
}

// 4. Skills citadas nas instruções precisam estar no lock
if (lock) {
  const doLock = new Set(lock.fontes.flatMap((f) => f.skills.map((s) => s.nome)));
  const usadas = new Map();
  for (const md of mds) {
    const texto = fs.readFileSync(md, "utf8");
    for (const m of texto.matchAll(/(?<![\w.~-])(?:<skill>\/)?skills\/([a-z0-9-]+)(\/[\w./-]*\w)?/g)) {
      const linha = texto.slice(Math.max(0, m.index - 12), m.index);
      if (/\.claude[\\/]$/.test(linha)) continue; // ~/.claude/skills/... é caminho de instalação
      const chave = m[1] + (m[2] ?? "");
      if (!usadas.has(chave)) usadas.set(chave, path.relative(PASTA_SKILL, md));
    }
  }
  console.log(`\n${negrito("Skills citadas nas instruções")}`);
  const semLock = [...new Set([...usadas.keys()].map((k) => k.split("/")[0]))].filter((n) => !doLock.has(n));
  semLock.length ? semLock.forEach((n) => erro(`skills/${n} é citada mas não está no skills.lock.json`)) : ok(`${usadas.size} citações, todas de skills do lock`);

  // 5. Com --completo, cada arquivo citado precisa existir na skill instalada
  if (args.completo) {
    console.log(`\n${negrito("Skills de terceiros instaladas")}`);
    let faltaram = 0;
    for (const nome of doLock) {
      const onde = acharSkill(nome, PASTA_SKILL, projeto);
      if (!onde) { erro(`${nome} não está instalada`); faltaram++; continue; }
      for (const [chave, md] of usadas) {
        const [n, ...resto] = chave.split("/");
        if (n !== nome || !resto.length) continue;
        if (!fs.existsSync(path.join(onde, ...resto))) erro(`${chave} (citado em ${md}) não existe em ${onde}`);
      }
    }
    if (!faltaram) ok(`as ${doLock.size} skills estão instaladas e todos os arquivos citados existem`);
  }
}

console.log(erros.length
  ? `\n${vermelho(`${erros.length} problema(s).`)}`
  : `\n${verde("Tudo certo.")}${avisos.length ? cinza(` (${avisos.length} aviso(s))`) : ""}`);
process.exit(erros.length ? 1 : 0);
