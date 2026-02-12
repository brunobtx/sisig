# Plano Incremental: Common -> shared

## Objetivo
Migrar de `src/Common` para `src/shared` sem quebrar imports e sem interromper entregas.

## Estado Atual
- Base `shared` criada para componentes centrais usados pelos módulos.
- Compatibilidade ativa: arquivos em `src/Common` exportam do `src/shared` (re-export).
- Módulos em `src/modules/*` já podem usar `shared` diretamente.

## Estratégia de Migração (Sem Quebra)

### Fase 1: Compatibilidade (concluída)
1. Criar equivalentes em `src/shared` para classes/utilitários centrais.
2. Manter `src/Common` com re-export para os novos arquivos de `shared`.
3. Validar com `npx tsc --noEmit`.

### Fase 2: Migração de Imports (incremental)
1. Ao tocar um módulo, trocar imports de:
- `Common/Domain/Entities/entity` -> `shared/domain/entities/entity`
- `Common/Domain/Validators/classValidatorFields` -> `shared/domain/validators/classValidatorFields`
- `Common/Helper/isCpfDecorator` -> `shared/utils/isCpfDecorator`
- `Common/Middleware/isAuthenticated` -> `shared/infra/middlewares/isAuthenticated`
2. Evitar big-bang: migrar por módulo/subdomínio.
3. Validar após cada lote com `npx tsc --noEmit`.

### Fase 3: Congelamento de Common
1. Não criar novos arquivos em `src/Common`.
2. Novos códigos devem nascer apenas em `src/shared`.

### Fase 4: Remoção segura de Common
Pré-condições:
- `rg -n "Common/" src` sem resultados de código ativo.
- Build TypeScript ok.
Passos:
1. Remover arquivos de re-export de `src/Common`.
2. Remover a pasta `src/Common`.
3. Rodar build e smoke test de endpoints.

## Regras Operacionais
- Sempre usar PR pequeno por subdomínio.
- Não trocar contratos de API durante a migração de import.
- Qualquer mudança estrutural deve manter endpoint e payload.

## Comandos de Verificação
```bash
npx tsc --noEmit
rg -n "Common/" src
rg -n "shared/" src/modules
```

## Critério de Conclusão
- `src/Common` removido.
- Todo código ativo importando apenas de `src/shared`.
- Build e rotas funcionando.
