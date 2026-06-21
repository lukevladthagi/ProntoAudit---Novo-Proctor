# ProntoAudit

Sistema web para gestao de auditorias internas hospitalares, execucao de checklists, registro de achados, planos de acao, relatorios e acompanhamento de verificacao de eficacia.

## Principais recursos

- Cadastro e execucao de auditorias por unidade, setor, periodo, checklist e auditor responsavel.
- Checklists configuraveis com requisitos, criterios, dimensoes e eixos.
- Importacao de planilhas de visitas setoriais no modelo `DATA`, `SETOR`, `DIMENSAO`, `EIXO`, `PERGUNTA`, `RESPOSTA` e `OBSERVACAO`.
- Acompanhamento de aderencia, conformidades, nao conformidades, parciais e itens nao aplicaveis.
- Telas para achados, planos de acao, relatorios, usuarios, unidades e setores.
- Autenticacao com Better Auth e persistencia em PostgreSQL.

## Estrutura

```text
apps/
  web/        Aplicacao Next.js
config/       Configuracoes compartilhadas do monorepo
publisher/    Utilitarios de publicacao herdados do template
```

## Requisitos

- Node.js compativel com Next.js 16
- Yarn 4 via Corepack
- PostgreSQL

## Variaveis de ambiente

Crie um arquivo `apps/web/.env` com as variaveis abaixo. Nao commite esse arquivo.

```env
BETTER_AUTH_SECRET=sua_chave_secreta
DATABASE_URL=postgresql://usuario:senha@host:porta/banco?sslmode=require
BETTER_AUTH_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:4000
```

Em producao, ajuste as URLs para o dominio publico usado pela aplicacao.

## Desenvolvimento

```bash
corepack enable
YARN_NM_MODE=classic yarn install
YARN_NM_MODE=classic yarn workspace web dev
```

A aplicacao web sobe por padrao na porta `4000`.

## Build

```bash
YARN_NM_MODE=classic yarn workspace web typecheck
YARN_NM_MODE=classic yarn workspace web build
YARN_NM_MODE=classic yarn workspace web start
```

## Importacao de visitas

No sistema, acesse `Cadastros > Checklists` e use o botao `Importar Planilha`.

O importador reconhece as abas:

- `INTERNACAO`
- `CC`
- `CLINICA`

Cada aba gera ou atualiza um checklist de visitas setoriais. Os requisitos sao organizados por dimensao e eixo para facilitar a execucao da auditoria.

## Publicacao

O projeto deve ser publicado em uma pasta propria e executado com um gerenciador de processos, como PM2 ou systemd, sem compartilhar diretorios de build com outros projetos.

Exemplo com PM2:

```bash
YARN_NM_MODE=classic yarn install --immutable
YARN_NM_MODE=classic yarn workspace web build
pm2 start "yarn workspace web start" --name prontoaudit
pm2 save
```

Mantenha as variaveis de ambiente de producao fora do Git.
