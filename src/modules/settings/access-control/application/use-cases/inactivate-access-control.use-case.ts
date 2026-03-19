import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlEntity } from '../../domain/entities/access-control.entity';
import { AccessControlRepository } from '../../domain/repositories/access-control.repository';

export class InactivateAccessControlUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute(groupUuid: string): Promise<AccessControlEntity> {
    const group = await this.repository.findByUuid(groupUuid);

    if (!group) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    if (!group.is_active) {
      throw new AppError('Grupo de permissao ja esta inativo.', 400);
    }

    if (group.linkedUsersCount > 0) {
      throw new AppError('Nao e possivel inativar grupo de permissao com usuarios vinculados.', 400);
    }

    return this.repository.inactivateByUuid(groupUuid);
  }
}
