# Como contribuir

Obrigado por querer melhorar o Orbit. O método nasceu de cliente de verdade, então as melhores
contribuições também vêm de projetos reais.

## O que é bem-vindo

- **Lições de cliente:** algo que foi aprovado, rejeitado ou uma armadilha técnica. Vão em
  `skills/orbit/references/licoes.md`.
- **Melhorias numa fase:** cada fase tem a sua página em `skills/orbit/references/`.
- **Modelos de código:** em `skills/orbit/templates/`, sempre testados em 1280×800, 650×540 e 375×812.
- **Skills novas:** abra uma issue com o link, a licença e em qual fase ela entra antes do pull request.

## Regras

1. Escreva em português simples, sem jargão desnecessário, no mesmo tom do resto.
2. Nada inventado nos exemplos: sem depoimentos, números ou clientes falsos.
3. Não copie skills de terceiros para dentro do repositório. Elas entram pelo `skills.lock.json`.
4. Rode a verificação antes de mandar:

```bash
node skills/orbit/ferramentas/verificar.mjs
```

## Atualizar uma skill de terceiros

As versões ficam fixas de propósito: o método cita comandos e arquivos que existem naquelas versões. A
cada segunda-feira, a ação [novidades](.github/workflows/novidades.yml) abre uma issue quando algum autor
publica algo novo. Para atualizar:

1. Instale a versão nova num lugar de teste:
   ```bash
   node instalar.mjs --destino /tmp/teste --dentro --mais-recente --apenas <skill>
   ```
2. Confira se tudo que o método cita continua existindo:
   ```bash
   node /tmp/teste/orbit/ferramentas/verificar.mjs --completo
   ```
3. Se algum comando mudou de nome, ajuste o `SKILL.md` e as `references/` que citam o nome antigo.
4. Troque o `commit` da fonte no `skills/orbit/skills.lock.json` (40 caracteres) e atualize o
   `CREDITOS.md` e o `CHANGELOG.md`.
5. Teste um site de ponta a ponta antes de abrir o pull request.

## Lançar uma versão

1. Atualize `version` em `.claude-plugin/plugin.json` e a seção do `CHANGELOG.md`.
2. Crie a tag: `git tag v1.1.0 && git push --tags`. A ação de lançamento publica o pacote `.zip`.
