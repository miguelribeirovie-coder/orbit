# Segurança

## O que o instalador faz

- Copia a pasta `skills/orbit` para a sua pasta de skills do Claude Code.
- Baixa as skills de terceiros **somente** dos repositórios listados em
  `skills/orbit/skills.lock.json`, no commit exato fixado ali (ou no mais novo, se você pedir com
  `--mais-recente`).
- Não pede senha, não envia dados, não mexe em nenhuma configuração do sistema. O MCP shadcn só é
  registrado se você usar `--shadcn`.

Algumas skills de terceiros trazem scripts (por exemplo, a impeccable baixa o próprio executável na
primeira vez que roda). Eles vêm dos autores originais; leia o repositório de cada um em
[CREDITOS.md](CREDITOS.md) se quiser conferir.

## Encontrou um problema de segurança?

Não abra uma issue pública. Use o botão **Report a vulnerability** na aba
[Security](https://github.com/miguelribeirovie-coder/orbit/security) do repositório. Problemas nas
skills de terceiros devem ser enviados também aos autores delas.
