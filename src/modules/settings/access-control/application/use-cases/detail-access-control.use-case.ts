import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlEntity } from '../../domain/entities/access-control.entity';
import { AccessControlRepository } from '../../domain/repositories/access-control.repository';

export class DetailAccessControlUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute(groupUuid: string): Promise<AccessControlEntity> {
    const group = await this.repository.findByUuid(groupUuid);

    if (!group) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    return group;
  }
}
