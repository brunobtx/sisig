# Guia de Arquitetura

## Objetivo
Manter uma estrutura Clean Architecture + DDD em `src/modules` com limites claros, alta coesão e baixo acoplamento.

## Estrutura Alvo
```txt
src/
  modules/
    {dominio}/
      domain/
        entities/
        value-objects/
        repositories/
      application/
        use-cases/
        dtos/
      infra/
        prisma/
        repositories/
      presentation/
        controllers/
        routes/
        validators/
  shared/
    infra/
      http/
      middlewares/
      errors/
    utils/
```

## Regras por Camada

### 1) Domain
- Não depende de Express, Prisma ou qualquer framework.
- Contém apenas regras de negócio.
- `entities` devem encapsular comportamento/invariantes.
- `repositories` são apenas interfaces.

### 2) Application
- Contém casos de uso e DTOs.
- Cada caso de uso expõe apenas `execute()`.
- Não importa Express.
- Depende de contratos do domínio (interfaces/entities/value-objects).

### 3) Infra
- Implementações concretas de repositórios.
- Acesso ao Prisma somente aqui.
- Adaptadores externos e mapeadores de persistência.

### 4) Presentation
- Ponto de entrada HTTP (controllers/routes/validators do Express).
- Controllers devem ser finos: validar entrada, chamar use case e retornar JSON.
- Não colocar regra de negócio em controller.

## Regra de Dependência (Obrigatória)
Fluxo permitido de dependências:
- `presentation -> application -> domain`
- `infra -> domain`

Proibido:
- `domain -> application|infra|presentation`
- `application -> presentation|infra` (exceto via interfaces)
- `presentation -> prisma`

## Convenções de Nomes
- Pastas: minúsculas, kebab-case quando necessário.
  - Exemplos: `class-session`, `academic-year`
- Arquivos:
  - `*.entity.ts`
  - `*.repository.ts`
  - `*.use-case.ts`
  - `*.controller.ts`
  - `*.routes.ts`
  - `*.validator.ts`
  - `*.dto.ts`

## Padrão de Erros
- Usar `AppError` para erros esperados de negócio/aplicação.
- Use cases devem lançar `AppError` com `statusCode` adequado.
- Controllers mapeiam `AppError` para resposta JSON.

## Padrão de Validação
- Validação de entrada fica em `presentation/validators`.
- Usar validadores com `class-validator`.
- Controller deve retornar `400` com detalhes de validação quando inválido.

## Composição de Rotas
- Cada módulo expõe um arquivo de rota em `presentation/routes`.
- `src/routes.ts` apenas compõe routers dos módulos com `router.use('/api', moduleRoutes)`.
- Injeção de dependência é manual na composição das rotas.

## Checklist por Módulo (Usar em Todo Novo Módulo)
1. Criar estrutura de pastas em `src/modules/{dominio}`.
2. Definir entities e interfaces de repository em `domain`.
3. Definir DTOs e use cases em `application`.
4. Implementar repository Prisma + mapper em `infra`.
5. Implementar validator, controller e routes em `presentation`.
6. Registrar rota em `src/routes.ts`.
7. Garantir que não há imports proibidos entre camadas.
8. Executar `npx tsc --noEmit`.

## Checklist de PR
- [ ] Nenhum import de `prisma` fora de `infra`.
- [ ] Nenhum import de `express` fora de `presentation`.
- [ ] Todos os use cases expõem apenas `execute()`.
- [ ] Controllers são finos e retornam JSON.
- [ ] Domain não depende de framework.
- [ ] `AppError` usado para erros de negócio/aplicação.
- [ ] Build TypeScript passa (`npx tsc --noEmit`).

## Política de Migração
- Refatorar incrementalmente por módulo.
- Manter endpoints e contratos de payload estáveis.
- Migrar um subdomínio por vez.
- Remover pastas legadas somente após trocar as rotas e validar build.
