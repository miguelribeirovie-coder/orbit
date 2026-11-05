#!/usr/bin/env node
// Baixa as skills de terceiros que o método orbit usa, direto das fontes originais,
// na versão (commit) fixada em skills.lock.json. Leva a licença de cada autor junto.
//
//   node ferramentas/baixar-skills.mjs                 # instala em ~/.claude/skills
//   node ferramentas/baixar-skills.mjs --dentro        # instala dentro de orbit/skills
//   node ferramentas/baixar-skills.mjs --destino <dir> # instala onde você quiser
//   node ferramentas/baixar-skills.mjs --verificar     # só confere o que já está instalado
//   node ferramentas/baixar-skills.mjs --listar        # mostra as skills, autores e licenças
//
// Outras opções: --forcar (substitui pastas que não foram instaladas por aqui),
// --mais-recente (usa a versão mais nova de cada fonte em vez da fixada),
// --apenas animate,impeccable (só algumas).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PASTA_SKILL, MARCADOR, SKILLS_USUARIO, lerLock, lerArgs, expandirCasa, temComando, rodar,
  copiarPasta, apagar, versaoNodeOk, acharSkill, verde, amarelo, vermelho, cinza, negrito,
} from "./lib.mjs";

const AJUDA = `
${negrito("baixar-skills")}: baixa as skills de terceiros usadas pelo orbit.

  --destino <pasta>   onde instalar (padrão: ${SKILLS_USUARIO})
  --dentro            instala dentro de orbit/skills (não aparecem como skills soltas)
  --apenas a,b        só as skills com esses nomes
  --forcar            substitui pastas que já existem e não foram instaladas por aqui
  --mais-recente      usa a versão mais nova de cada fonte (sem garantia de compatibilidade)
  --verificar         só confere se todas estão instaladas
  --listar            lista as skills, autores e licenças
  --ajuda             mostra esta ajuda
`;

export async function baixarSkills(opcoes = {}) {
  const lock = lerLock();
  const destino = opcoes.dentro
    ? path.join(PASTA_SKILL, "skills")
    : expandirCasa(opcoes.destino) || SKILLS_USUARIO;
  const apenas = opcoes.apenas ? new Set(String(opcoes.apenas).split(",").map((s) => s.trim())) : null;
  fs.mkdirSync(destino, { recursive: true });

  console.log(`\n${negrito("Skills incluídas")} ${cinza("→ " + destino)}`);
  const resumo = { instaladas: 0, puladas: 0, falhas: 0 };

  for (const fonte of lock.fontes) {
    const skills = fonte.skills.filter((s) => !apenas || apenas.has(s.nome));
    if (!skills.length) continue;
    const ref = opcoes["mais-recente"] ? "HEAD" : fonte.commit;
    process.stdout.write(`\n${negrito(fonte.repo)} ${cinza(`(${fonte.licenca}, ${fonte.autor})`)} baixando… `);

    let baixado;
    try {
      baixado = await baixarFonte(fonte, skills, ref);
      console.log(verde("ok") + cinza(` ${baixado.commit.slice(0, 7)} via ${baixado.metodo}`));
    } catch (e) {
      console.log(vermelho("falhou"));
      console.log(vermelho(`  ${e.message}`));
      resumo.falhas += skills.length;
      continue;
    }

    try {
      for (const s of skills) {
        const origem = path.join(baixado.raiz, s.caminho);
        const alvo = path.join(destino, s.nome);
        if (!fs.existsSync(path.join(origem, "SKILL.md"))) {
          console.log(`  ${vermelho("✗")} ${s.nome} ${cinza("(não achei " + s.caminho + " na fonte)")}`);
          resumo.falhas++;
          continue;
        }
        if (fs.existsSync(alvo) && !fs.existsSync(path.join(alvo, MARCADOR)) && !opcoes.forcar) {
          console.log(`  ${amarelo("•")} ${s.nome} ${cinza("já existe e não foi instalada por aqui; mantive a sua (use --forcar para trocar)")}`);
          resumo.puladas++;
          continue;
        }
        apagar(alvo);
        copiarPasta(origem, alvo);
        for (const arq of fonte.arquivosLicenca ?? []) {
          const de = path.join(baixado.raiz, arq);
          const para = path.join(alvo, arq);
          if (fs.existsSync(de) && !fs.existsSync(para)) fs.copyFileSync(de, para);
        }
        fs.writeFileSync(path.join(alvo, MARCADOR), JSON.stringify({
          instaladoPor: "orbit",
          repo: fonte.repo,
          commit: baixado.commit,
          caminho: s.caminho,
          licenca: fonte.licenca,
          autor: fonte.autor,
          fonte: `https://github.com/${fonte.repo}/tree/${baixado.commit}/${s.caminho}`,
          baixadoEm: new Date().toISOString(),
        }, null, 2) + "\n");
        console.log(`  ${verde("✓")} ${s.nome}`);
        resumo.instaladas++;
      }
    } finally {
      apagar(baixado.temporario);
    }
  }

  console.log(`\n${verde(resumo.instaladas + " instaladas")}` +
    (resumo.puladas ? `, ${amarelo(resumo.puladas + " mantidas")}` : "") +
    (resumo.falhas ? `, ${vermelho(resumo.falhas + " com problema")}` : ""));
  if (resumo.falhas) {
    console.log(cinza("Confira a internet e rode de novo. Se o git não estiver instalado, o download usa o arquivo .tar.gz do GitHub."));
  }
  return resumo;
}

async function baixarFonte(fonte, skills, ref) {
  const temporario = fs.mkdtempSync(path.join(os.tmpdir(), "orbit-"));
  const barra = (c) => "/" + c.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const padroes = [...skills.map((s) => barra(s.caminho) + "/"), ...(fonte.arquivosLicenca ?? []).map(barra)];
  const url = `https://github.com/${fonte.repo}.git`;

  if (temComando("git")) {
    try {
      const raiz = path.join(temporario, "repo");
      fs.mkdirSync(raiz);
      const git = (...a) => rodar("git", ["-c", "advice.detachedHead=false", ...a], { cwd: raiz });
      git("init", "-q");
      git("remote", "add", "origin", url);
      git("config", "core.sparseCheckout", "true");
      fs.writeFileSync(path.join(raiz, ".git", "info", "sparse-checkout"), padroes.join("\n") + "\n");
      git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", ref);
      git("checkout", "-q", "FETCH_HEAD");
      return { raiz, temporario, commit: git("rev-parse", "HEAD"), metodo: "git" };
    } catch (e) {
      // Cai para o download do pacote abaixo.
      if (process.env.ORBIT_DEBUG) console.error(e);
    }
  }

  const arquivo = path.join(temporario, "fonte.tar.gz");
  const resposta = await fetch(`https://github.com/${fonte.repo}/archive/${ref}.tar.gz`, { redirect: "follow" });
  if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status} para ${fonte.repo}@${ref}`);
  fs.writeFileSync(arquivo, Buffer.from(await resposta.arrayBuffer()));
  const extraido = path.join(temporario, "x");
  fs.mkdirSync(extraido);
  if (!temComando("tar")) throw new Error("preciso do git ou do tar para baixar as skills");
  rodar("tar", ["-xzf", arquivo, "-C", extraido]);
  const [pasta] = fs.readdirSync(extraido);
  return { raiz: path.join(extraido, pasta), temporario, commit: ref === "HEAD" ? "mais-recente" : ref, metodo: "tar.gz" };
}

export function verificarSkills({ projeto = process.cwd(), silencioso = false } = {}) {
  const lock = lerLock();
  const faltando = [];
  if (!silencioso) console.log(`\n${negrito("Skills incluídas")}`);
  for (const fonte of lock.fontes) {
    for (const s of fonte.skills) {
      const onde = acharSkill(s.nome, PASTA_SKILL, projeto);
      if (!onde) faltando.push(s.nome);
      if (!silencioso) console.log(`  ${onde ? verde("✓") : vermelho("✗")} ${s.nome.padEnd(30)} ${cinza(onde ?? "não encontrada")}`);
    }
  }
  if (!silencioso) {
    console.log(faltando.length
      ? `\n${vermelho(faltando.length + " faltando.")} Rode: node "${path.join(PASTA_SKILL, "ferramentas", "baixar-skills.mjs")}"`
      : `\n${verde("Tudo certo: as " + lock.fontes.reduce((n, f) => n + f.skills.length, 0) + " skills estão instaladas.")}`);
  }
  return faltando;
}

function listar() {
  const lock = lerLock();
  for (const f of lock.fontes) {
    console.log(`\n${negrito(f.repo)}  ${cinza(`${f.licenca} · ${f.autor} · ${f.site ?? ""}`)}`);
    for (const s of f.skills) console.log(`  ${s.nome.padEnd(30)} ${cinza(s.papel)}`);
  }
}

// Execução direta pela linha de comando.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = lerArgs(process.argv.slice(2), ["destino", "apenas"]);
  if (!versaoNodeOk(18)) {
    console.error(vermelho(`Preciso do Node 18 ou mais novo (você tem ${process.versions.node}). Baixe em https://nodejs.org`));
    process.exit(1);
  }
  if (args.ajuda || args.help) console.log(AJUDA);
  else if (args.listar) listar();
  else if (args.verificar) process.exit(verificarSkills().length ? 1 : 0);
  else {
    const r = await baixarSkills(args);
    process.exit(r.falhas ? 1 : 0);
  }
}
