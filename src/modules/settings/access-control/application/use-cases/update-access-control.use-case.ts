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

export class UpdateAccessControlUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute(groupUuid: string, data: CreateAccessControlInputDto): Promise<AccessControlEntity> {
    const group = await this.repository.findByUuid(groupUuid);

    if (!group) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    const alreadyExists = await this.repository.findByName(data.name);

    if (alreadyExists && alreadyExists.uuid !== groupUuid) {
      throw new AppError('Ja existe outro grupo de permissao com este nome.', 400);
    }

    const normalizedPermissions = normalizePermissionKeys(data.permissions);

    if (!normalizedPermissions.length) {
      throw new AppError('Informe ao menos uma permissao valida.', 400);
    }

    return this.repository.updateByUuid(groupUuid, {
      name: data.name,
      description: data.description,
      permissions: normalizedPermissions,
    });
  }
}
