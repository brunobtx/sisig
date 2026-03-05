import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlEntity } from '../../domain/entities/access-control.entity';
import { AccessControlRepository } from '../../domain/repositories/access-control.repository';
import {
  AccessControlPermissionObjectInput,
  CreateAccessControlInputDto,
} from '../dtos/create-access-control-input.dto';

function normalizePermissionKeys(
  permissions: Array<string | AccessControlPermissionObjectInput>,
): string[] {
  const keys = new Set<string>();

  for (const permission of permissions) {
    if (typeof permission === 'string') {
      keys.add(permission.trim());
      continue;
    }

    const module = permission.module.trim();

    for (const action of permission.actions) {
      keys.add(`${module}:${action.trim()}`);
    }
  }

  return Array.from(keys).filter(Boolean);
}

export class CreateAccessControlUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute(data: CreateAccessControlInputDto): Promise<AccessControlEntity> {
    const alreadyExists = await this.repository.findByName(data.name);

    if (alreadyExists) {
      throw new AppError('Grupo de permissao ja existe.', 400);
    }

    const normalizedPermissions = normalizePermissionKeys(data.permissions);

    if (!normalizedPermissions.length) {
      throw new AppError('Informe ao menos uma permissao valida.', 400);
    }

    return this.repository.create({
      name: data.name,
      description: data.description,
      permissions: normalizedPermissions,
    });
  }
}
