# Template de Módulo

Use este template para criar novos módulos seguindo o padrão do projeto (Clean Architecture + DDD).

## 1) Estrutura de Pastas

Substitua `{dominio}` pelo nome do módulo (ex.: `visitor`, `event`, `finance`).

```txt
src/modules/{dominio}/
  domain/
    entities/
      {dominio}.entity.ts
    value-objects/
    repositories/
      {dominio}.repository.ts
  application/
    dtos/
      create-{dominio}-input.dto.ts
      {dominio}-output.dto.ts
    use-cases/
      create-{dominio}.use-case.ts
  infra/
    prisma/
      mappers/
        {dominio}-prisma.mapper.ts
    repositories/
      prisma-{dominio}.repository.ts
  presentation/
    validators/
      {dominio}.validator.ts
    controllers/
      create-{dominio}.controller.ts
    routes/
      {dominio}.routes.ts
```

## 2) Contrato de Dependências

- `domain` não depende de framework.
- `application` depende de interfaces do `domain`.
- `infra` implementa contratos do `domain` usando Prisma.
- `presentation` chama `use-case` e retorna JSON.

Fluxo:
- `presentation -> application -> domain`
- `infra -> domain`

## 3) Checklist de Implementação

1. Criar `Entity` com invariantes/comportamento.
2. Criar interface `Repository` no domínio.
3. Criar DTOs de entrada/saída em `application/dtos`.
4. Criar `UseCase` com método único `execute()`.
5. Criar `PrismaMapper` e `PrismaRepository` em `infra`.
6. Criar `Validator` em `presentation/validators`.
7. Criar `Controller` fino em `presentation/controllers`.
8. Criar `Routes` com DI manual em `presentation/routes`.
9. Registrar rota em `src/routes.ts`.
10. Validar com `npx tsc --noEmit`.

## 4) Exemplo de Skeleton

### Entity
```ts
export type ExampleProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  createdAt?: Date;
};

export class ExampleEntity {
  constructor(private props: ExampleProps) {
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }
}
```

### Repository Interface
```ts
export interface ExampleRepository {
  findByName(name: string): Promise<ExampleEntity | null>;
  create(entity: ExampleEntity): Promise<ExampleEntity>;
}
```

### Use Case
```ts
export class CreateExampleUseCase {
  constructor(private readonly repository: ExampleRepository) {}

  async execute(input: CreateExampleInputDto): Promise<ExampleEntity> {
    const exists = await this.repository.findByName(input.name);
    if (exists) {
      throw new AppError('Registro já existe', 400);
    }

    const entity = new ExampleEntity({ name: input.name });
    return this.repository.create(entity);
  }
}
```

### Prisma Repository
```ts
export class PrismaExampleRepository implements ExampleRepository {
  async findByName(name: string) {
    const row = await prismaClient.example.findFirst({ where: { name } });
    return row ? ExamplePrismaMapper.toEntity(row) : null;
  }

  async create(entity: ExampleEntity) {
    const row = await prismaClient.example.create({
      data: { name: entity.name },
    });

    return ExamplePrismaMapper.toEntity(row);
  }
}
```

### Controller
```ts
export class CreateExampleController {
  constructor(
    private readonly useCase: CreateExampleUseCase,
    private readonly validator: ExampleValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    if (!this.validator.validate(req.body)) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const entity = await this.useCase.execute(req.body);
      return res.status(201).json(ExampleOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
```

### Route (DI Manual)
```ts
const exampleRoutes = Router();

const repository = new PrismaExampleRepository();
const controller = new CreateExampleController(
  new CreateExampleUseCase(repository),
  ExampleValidatorFactory.create(),
);

exampleRoutes.post('/examples', controller.handle);

export { exampleRoutes };
```

## 5) Convenções do Projeto

- Arquivos: `*.entity.ts`, `*.repository.ts`, `*.use-case.ts`, `*.dto.ts`, `*.controller.ts`, `*.routes.ts`, `*.validator.ts`.
- Usar `AppError` para erros esperados.
- Controller não contém regra de negócio.
- Prisma somente em `infra`.

## 6) Critério de Pronto

Um módulo está pronto quando:
- segue estrutura por camadas,
- compila (`npx tsc --noEmit`),
- rota registrada em `src/routes.ts`,
- sem import indevido entre camadas,
- payloads/rotas existentes preservados (em migração incremental).
