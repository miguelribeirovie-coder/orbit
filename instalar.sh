#!/usr/bin/env sh
# Instala a skill orbit no Claude Code (Mac e Linux).
#
#   curl -fsSL https://raw.githubusercontent.com/miguelribeirovie-coder/orbit/main/instalar.sh | sh
#   curl -fsSL https://raw.githubusercontent.com/miguelribeirovie-coder/orbit/main/instalar.sh | sh -s -- --dentro
#
# Dentro de uma cópia do repositório, é o mesmo que: node instalar.mjs [opções]
set -eu

REPO="miguelribeirovie-coder/orbit"

if ! command -v node >/dev/null 2>&1; then
  echo "Preciso do Node.js 18 ou mais novo. Baixe em https://nodejs.org e rode de novo." >&2
  exit 1
fi

AQUI="$(cd "$(dirname "$0")" 2>/dev/null && pwd || echo .)"
if [ -f "$AQUI/instalar.mjs" ] && [ -d "$AQUI/skills/orbit" ]; then
  exec node "$AQUI/instalar.mjs" "$@"
fi

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t orbit)"
trap 'rm -rf "$TMP"' EXIT INT TERM

echo "Baixando $REPO…"
if command -v git >/dev/null 2>&1; then
  git clone -q --depth 1 "https://github.com/$REPO.git" "$TMP/orbit"
else
  curl -fsSL "https://github.com/$REPO/archive/HEAD.tar.gz" | tar -xz -C "$TMP"
  mv "$TMP"/orbit-* "$TMP/orbit"
fi

node "$TMP/orbit/instalar.mjs" "$@"
