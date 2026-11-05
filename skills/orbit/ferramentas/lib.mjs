// Funções compartilhadas pelo instalador, pelo baixador de skills e pelo verificador.
// Só usa o que vem com o Node (18+): nada para instalar.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const PASTA_FERRAMENTAS = path.dirname(fileURLToPath(import.meta.url));
export const PASTA_SKILL = path.resolve(PASTA_FERRAMENTAS, "..");
export const MARCADOR = ".orbit.json";
export const SKILLS_USUARIO = path.join(os.homedir(), ".claude", "skills");

const cor = (n) => (t) => (process.stdout.isTTY && !process.env.NO_COLOR ? `\x1b[${n}m${t}\x1b[0m` : t);
export const verde = cor(32);
export const amarelo = cor(33);
export const vermelho = cor(31);
export const cinza = cor(90);
export const negrito = cor(1);

export function lerLock(pastaSkill = PASTA_SKILL) {
  const arquivo = path.join(pastaSkill, "skills.lock.json");
  return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

/** Lê argumentos no formato --chave valor / --chave=valor / --flag. */
export function lerArgs(argv, comValor = []) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { args._.push(a); continue; }
    const [chave, valorIgual] = a.slice(2).split(/=(.*)/s);
    if (valorIgual !== undefined) args[chave] = valorIgual;
    else if (comValor.includes(chave)) args[chave] = argv[++i];
    else args[chave] = true;
  }
  return args;
}

export function expandirCasa(p) {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/") || p.startsWith("~\\")) return path.join(os.homedir(), p.slice(2));
  return path.resolve(p);
}

export function temComando(cmd) {
  const r = spawnSync(cmd, ["--version"], { stdio: "ignore", shell: process.platform === "win32" });
  return r.status === 0;
}

export function rodar(cmd, args, opcoes = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opcoes });
  if (r.status !== 0) {
    const erro = (r.stderr || r.stdout || r.error?.message || "").trim();
    throw new Error(`${cmd} ${args.join(" ")} falhou${erro ? `: ${erro}` : ""}`);
  }
  return (r.stdout || "").trim();
}

/** Copia uma pasta inteira mantendo as permissões (scripts continuam executáveis). */
export function copiarPasta(origem, destino, { pular = () => false } = {}) {
  fs.mkdirSync(destino, { recursive: true });
  for (const item of fs.readdirSync(origem, { withFileTypes: true })) {
    if (item.name === ".git") continue;
    const de = path.join(origem, item.name);
    const para = path.join(destino, item.name);
    if (pular(de, item)) continue;
    if (item.isDirectory()) copiarPasta(de, para, { pular });
    else if (item.isFile()) {
      fs.copyFileSync(de, para);
      try { fs.chmodSync(para, fs.statSync(de).mode & 0o777); } catch { /* Windows */ }
    }
  }
}

export function apagar(pasta) {
  fs.rmSync(pasta, { recursive: true, force: true });
}

export function versaoNodeOk(minimo = 18) {
  return Number(process.versions.node.split(".")[0]) >= minimo;
}

/** Lugares onde uma skill incluída pode estar, na ordem em que o SKILL.md procura. */
export function lugaresDaSkill(nome, pastaSkill = PASTA_SKILL, projeto = process.cwd()) {
  return [
    path.join(pastaSkill, "skills", nome),
    path.join(SKILLS_USUARIO, nome),
    path.join(projeto, ".claude", "skills", nome),
  ];
}

export function acharSkill(nome, pastaSkill, projeto) {
  return lugaresDaSkill(nome, pastaSkill, projeto).find((p) => fs.existsSync(path.join(p, "SKILL.md"))) ?? null;
}

/** Lê o frontmatter simples (chave: valor) de um SKILL.md. */
export function lerFrontmatter(texto) {
  const m = texto.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const dados = {};
  let chaveAtual = null;
  for (const linha of m[1].split("\n")) {
    const kv = linha.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) { chaveAtual = kv[1]; dados[chaveAtual] = kv[2].replace(/^["']|["']$/g, ""); }
    else if (chaveAtual && /^\s+/.test(linha)) dados[chaveAtual] += " " + linha.trim();
  }
  return dados;
}
