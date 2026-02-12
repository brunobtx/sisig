#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function exitWith(msg) {
  console.error(msg);
  process.exit(1);
}

function toPascalCase(value) {
  return value
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(value) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function normalizeModulePath(input) {
  return input
    .trim()
    .replace(/^src\/modules\//, '')
    .replace(/^modules\//, '')
    .replace(/^\/+|\/+$/g, '');
}

function relativeImport(fromDir, toPathNoExt) {
  const rel = path.relative(fromDir, toPathNoExt).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function writeFileIfMissing(filePath, content, force) {
  if (fs.existsSync(filePath) && !force) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const moduleArg = args.find((arg) => !arg.startsWith('--'));

if (!moduleArg) {
  exitWith(
    [
      'Uso: npm run scaffold:module -- <dominio>',
      'Exemplo: npm run scaffold:module -- ebd/visitor',
      'Opcional: --force para sobrescrever arquivos existentes',
    ].join('\n'),
  );
}

const modulePath = normalizeModulePath(moduleArg);
if (!modulePath) {
  exitWith('Nome do modulo invalido.');
}

const moduleDir = path.join(srcDir, 'modules', modulePath);
const moduleSegments = modulePath.split('/');
const moduleName = moduleSegments[moduleSegments.length - 1];
const moduleNamePascal = toPascalCase(moduleName);
const moduleNameCamel = toCamelCase(moduleName);

const entityFileName = `${moduleName}.entity.ts`;
const repositoryFileName = `${moduleName}.repository.ts`;
const createInputDtoFileName = `create-${moduleName}-input.dto.ts`;
const outputDtoFileName = `${moduleName}-output.dto.ts`;
const useCaseFileName = `create-${moduleName}.use-case.ts`;
const mapperFileName = `${moduleName}-prisma.mapper.ts`;
const prismaRepositoryFileName = `prisma-${moduleName}.repository.ts`;
const validatorFileName = `${moduleName}.validator.ts`;
const controllerFileName = `create-${moduleName}.controller.ts`;
const routesFileName = `${moduleName}.routes.ts`;

const files = {
  entity: path.join(moduleDir, 'domain', 'entities', entityFileName),
  repository: path.join(moduleDir, 'domain', 'repositories', repositoryFileName),
  createInputDto: path.join(moduleDir, 'application', 'dtos', createInputDtoFileName),
  outputDto: path.join(moduleDir, 'application', 'dtos', outputDtoFileName),
  useCase: path.join(moduleDir, 'application', 'use-cases', useCaseFileName),
  mapper: path.join(moduleDir, 'infra', 'prisma', 'mappers', mapperFileName),
  prismaRepository: path.join(moduleDir, 'infra', 'repositories', prismaRepositoryFileName),
  validator: path.join(moduleDir, 'presentation', 'validators', validatorFileName),
  controller: path.join(moduleDir, 'presentation', 'controllers', controllerFileName),
  routes: path.join(moduleDir, 'presentation', 'routes', routesFileName),
};

const valueObjectDir = path.join(moduleDir, 'domain', 'value-objects');
fs.mkdirSync(valueObjectDir, { recursive: true });

const importEntityBase = relativeImport(
  path.dirname(files.entity),
  path.join(srcDir, 'Common', 'Domain', 'Entities', 'entity'),
);
const importAppErrorUseCase = relativeImport(
  path.dirname(files.useCase),
  path.join(srcDir, 'shared', 'errors', 'AppError'),
);
const importEntityUseCase = relativeImport(
  path.dirname(files.useCase),
  path.join(moduleDir, 'domain', 'entities', moduleName),
);
const importRepositoryUseCase = relativeImport(
  path.dirname(files.useCase),
  path.join(moduleDir, 'domain', 'repositories', moduleName),
);
const importInputDtoUseCase = relativeImport(
  path.dirname(files.useCase),
  path.join(moduleDir, 'application', 'dtos', `create-${moduleName}-input.dto`),
);
const importEntityOutput = relativeImport(
  path.dirname(files.outputDto),
  path.join(moduleDir, 'domain', 'entities', moduleName),
);
const importEntityRepository = relativeImport(
  path.dirname(files.repository),
  path.join(moduleDir, 'domain', 'entities', moduleName),
);
const importEntityMapper = relativeImport(
  path.dirname(files.mapper),
  path.join(moduleDir, 'domain', 'entities', moduleName),
);
const importPrismaClient = relativeImport(path.dirname(files.prismaRepository), path.join(srcDir, 'prisma', 'index'));
const importEntityPrismaRepository = relativeImport(
  path.dirname(files.prismaRepository),
  path.join(moduleDir, 'domain', 'entities', moduleName),
);
const importRepositoryPrismaRepository = relativeImport(
  path.dirname(files.prismaRepository),
  path.join(moduleDir, 'domain', 'repositories', moduleName),
);
const importMapperPrismaRepository = relativeImport(
  path.dirname(files.prismaRepository),
  path.join(moduleDir, 'infra', 'prisma', 'mappers', moduleName + '-prisma.mapper'),
);
const importClassValidatorFields = relativeImport(
  path.dirname(files.validator),
  path.join(srcDir, 'Common', 'Domain', 'Validators', 'classValidatorFields'),
);
const importCreateInputValidator = relativeImport(
  path.dirname(files.validator),
  path.join(moduleDir, 'application', 'dtos', `create-${moduleName}-input.dto`),
);
const importAppErrorController = relativeImport(
  path.dirname(files.controller),
  path.join(srcDir, 'shared', 'errors', 'AppError'),
);
const importOutputController = relativeImport(
  path.dirname(files.controller),
  path.join(moduleDir, 'application', 'dtos', `${moduleName}-output.dto`),
);
const importUseCaseController = relativeImport(
  path.dirname(files.controller),
  path.join(moduleDir, 'application', 'use-cases', `create-${moduleName}.use-case`),
);
const importValidatorController = relativeImport(
  path.dirname(files.controller),
  path.join(moduleDir, 'presentation', 'validators', moduleName + '.validator'),
);
const importUseCaseRoutes = relativeImport(
  path.dirname(files.routes),
  path.join(moduleDir, 'application', 'use-cases', `create-${moduleName}.use-case`),
);
const importPrismaRepositoryRoutes = relativeImport(
  path.dirname(files.routes),
  path.join(moduleDir, 'infra', 'repositories', `prisma-${moduleName}.repository`),
);
const importControllerRoutes = relativeImport(
  path.dirname(files.routes),
  path.join(moduleDir, 'presentation', 'controllers', `create-${moduleName}.controller`),
);
const importValidatorRoutes = relativeImport(
  path.dirname(files.routes),
  path.join(moduleDir, 'presentation', 'validators', `${moduleName}.validator`),
);

const fileContents = {};

fileContents.entity = `import { Entity } from '${importEntityBase}';

export type ${moduleNamePascal}Props = {
  databaseId?: number;
  uuid?: string;
  name: string;
  createdAt?: Date;
};

export class ${moduleNamePascal}Entity extends Entity<${moduleNamePascal}Props> {
  constructor(props: ${moduleNamePascal}Props, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
`;

fileContents.repository = `import { ${moduleNamePascal}Entity } from '${importEntityRepository}';

export interface ${moduleNamePascal}Repository {
  findByName(name: string): Promise<${moduleNamePascal}Entity | null>;
  create(entity: ${moduleNamePascal}Entity): Promise<${moduleNamePascal}Entity>;
}
`;

fileContents.createInputDto = `export type Create${moduleNamePascal}InputDto = {
  name: string;
};
`;

fileContents.outputDto = `import { ${moduleNamePascal}Entity } from '${importEntityOutput}';

export type ${moduleNamePascal}OutputDto = {
  id: number | string;
  name: string;
};

export class ${moduleNamePascal}OutputMapper {
  static toOutput(entity: ${moduleNamePascal}Entity): ${moduleNamePascal}OutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      name: entity.name,
    };
  }
}
`;

fileContents.useCase = `import { AppError } from '${importAppErrorUseCase}';
import { ${moduleNamePascal}Entity } from '${importEntityUseCase}';
import { ${moduleNamePascal}Repository } from '${importRepositoryUseCase}';
import { Create${moduleNamePascal}InputDto } from '${importInputDtoUseCase}';

export class Create${moduleNamePascal}UseCase {
  constructor(private readonly repository: ${moduleNamePascal}Repository) {}

  async execute(data: Create${moduleNamePascal}InputDto): Promise<${moduleNamePascal}Entity> {
    const alreadyExists = await this.repository.findByName(data.name);
    if (alreadyExists) {
      throw new AppError('${moduleNamePascal} ja existe', 400);
    }

    const entity = new ${moduleNamePascal}Entity({
      name: data.name,
    });

    return this.repository.create(entity);
  }
}
`;

fileContents.mapper = `import { ${moduleNamePascal}Entity } from '${importEntityMapper}';

export class ${moduleNamePascal}PrismaMapper {
  static toEntity(data: any): ${moduleNamePascal}Entity {
    return new ${moduleNamePascal}Entity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        name: data.name,
        createdAt: data.createdAt ?? data.created_at,
      },
      data.uuid,
    );
  }
}
`;

fileContents.prismaRepository = `import prismaClient from '${importPrismaClient}';
import { ${moduleNamePascal}Entity } from '${importEntityPrismaRepository}';
import { ${moduleNamePascal}Repository } from '${importRepositoryPrismaRepository}';
import { ${moduleNamePascal}PrismaMapper } from '${importMapperPrismaRepository}';

const modelName = '${moduleNameCamel}';

export class Prisma${moduleNamePascal}Repository implements ${moduleNamePascal}Repository {
  async findByName(name: string): Promise<${moduleNamePascal}Entity | null> {
    const model = (prismaClient as any)[modelName];
    const row = await model.findFirst({ where: { name } });
    return row ? ${moduleNamePascal}PrismaMapper.toEntity(row) : null;
  }

  async create(entity: ${moduleNamePascal}Entity): Promise<${moduleNamePascal}Entity> {
    const model = (prismaClient as any)[modelName];
    const row = await model.create({
      data: {
        uuid: entity.id,
        name: entity.name,
      },
    });

    return ${moduleNamePascal}PrismaMapper.toEntity(row);
  }
}
`;

fileContents.validator = `import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '${importClassValidatorFields}';
import { Create${moduleNamePascal}InputDto } from '${importCreateInputValidator}';

export class ${moduleNamePascal}Rules {
  @IsString({ message: 'Nome deve ser texto' })
  @MaxLength(255, { message: 'Nome deve ter no maximo 255 caracteres' })
  @IsNotEmpty({ message: 'Nome e obrigatorio' })
  name: string;

  constructor(data: Create${moduleNamePascal}InputDto) {
    Object.assign(this, data);
  }
}

export class ${moduleNamePascal}Validator extends ClassValidatorFields<${moduleNamePascal}Rules> {
  validate(data: Create${moduleNamePascal}InputDto): boolean {
    return super.validate(new ${moduleNamePascal}Rules(data));
  }
}

export class ${moduleNamePascal}ValidatorFactory {
  static create(): ${moduleNamePascal}Validator {
    return new ${moduleNamePascal}Validator();
  }
}
`;

fileContents.controller = `import { Request, Response } from 'express';
import { AppError } from '${importAppErrorController}';
import { ${moduleNamePascal}OutputMapper } from '${importOutputController}';
import { Create${moduleNamePascal}UseCase } from '${importUseCaseController}';
import { ${moduleNamePascal}Validator } from '${importValidatorController}';

export class Create${moduleNamePascal}Controller {
  constructor(
    private readonly useCase: Create${moduleNamePascal}UseCase,
    private readonly validator: ${moduleNamePascal}Validator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const entity = await this.useCase.execute(req.body);
      return res.status(201).json(${moduleNamePascal}OutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
`;

fileContents.routes = `import { Router } from 'express';
import { Create${moduleNamePascal}UseCase } from '${importUseCaseRoutes}';
import { Prisma${moduleNamePascal}Repository } from '${importPrismaRepositoryRoutes}';
import { Create${moduleNamePascal}Controller } from '${importControllerRoutes}';
import { ${moduleNamePascal}ValidatorFactory } from '${importValidatorRoutes}';

const ${moduleNameCamel}Routes = Router();

const repository = new Prisma${moduleNamePascal}Repository();
const create${moduleNamePascal}Controller = new Create${moduleNamePascal}Controller(
  new Create${moduleNamePascal}UseCase(repository),
  ${moduleNamePascal}ValidatorFactory.create(),
);

${moduleNameCamel}Routes.post('/${moduleName}s', create${moduleNamePascal}Controller.handle);

export { ${moduleNameCamel}Routes };
`;

const created = [];
Object.keys(files).forEach((key) => {
  const createdNow = writeFileIfMissing(files[key], fileContents[key], force);
  if (createdNow) {
    created.push(path.relative(rootDir, files[key]));
  }
});

console.log(`Modulo alvo: src/modules/${modulePath}`);
if (!created.length) {
  console.log('Nenhum arquivo criado (todos ja existem). Use --force para sobrescrever.');
} else {
  console.log('Arquivos criados:');
  created.forEach((f) => console.log(`- ${f}`));
}

console.log('\nProximo passo:');
console.log(`1. Ajustar regras de negocio e campos reais do modulo "${moduleName}".`);
console.log(`2. Registrar a rota em src/routes.ts importando ${moduleNameCamel}Routes.`);
console.log('3. Executar: npx tsc --noEmit');
