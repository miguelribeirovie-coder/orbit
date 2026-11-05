# Perguntas frequentes

**Funciona fora do Claude Code?**
O método foi feito para o Claude Code. As skills seguem o formato aberto de Agent Skills (`SKILL.md`),
então outros agentes que leem esse formato conseguem usar, mas os comandos e o fluxo foram testados
no Claude Code.

**Preciso saber programar?**
Não para pedir. A skill conduz o projeto e explica o que fez em português simples. Para publicar, você
precisa de uma conta na Vercel (grátis) e, se quiser, no GitHub.

**Por que as 16 skills não vêm dentro do repositório?**
Porque são trabalho de outras pessoas. Elas têm licenças abertas, mas o jeito mais correto e mais fácil
de manter é baixar cada uma da fonte original, com a licença junto. O instalador faz isso em menos de
um minuto, e a lista exata está em `skills/orbit/skills.lock.json`.

**As skills ficam aparecendo soltas na lista do Claude. Dá para esconder?**
Sim: instale com `--dentro`. Elas vão para `orbit/skills/` e só entram quando o método chama.

**Eu já tinha a impeccable (ou outra) instalada. O instalador vai apagar a minha?**
Não. Ele só troca pastas que ele mesmo instalou (as que têm `.orbit.json` dentro). Para trocar a
sua pela versão testada com o método, use `--forcar`.

**Quero a versão mais nova das skills de terceiros.**
Use `--mais-recente`. Funciona, mas sem garantia: o método cita comandos (como `draw.mjs`) que podem
mudar de nome nas versões novas. A versão fixada é a que foi testada.

**Deu erro ao baixar as skills.**
Confira a internet e rode de novo. O instalador usa o `git` se ele existir e, se não, baixa o pacote
`.tar.gz` do GitHub (precisa do `tar`, que já vem no Windows 10+, Mac e Linux). Para ver o erro
completo, rode com a variável `ORBIT_DEBUG=1`.

**Os scripts de direção de arte não rodam.**
Eles precisam do Node 22+ e do Chrome, Edge ou Chromium instalados. Confira com `node -v`.

**Como confiro se está tudo certo?**
```bash
node ~/.claude/skills/orbit/ferramentas/baixar-skills.mjs --verificar
node ~/.claude/skills/orbit/ferramentas/verificar.mjs --completo
```

**Posso usar nos sites dos meus clientes?**
Pode. O método é MIT e as skills de terceiros também permitem uso comercial (MIT e Apache 2.0). Os
sites que você cria são seus.
