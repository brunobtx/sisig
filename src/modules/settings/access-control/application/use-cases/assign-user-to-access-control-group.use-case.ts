import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlRepository } from '../../domain/repositories/access-control.repository';

export class AssignUserToAccessControlGroupUseCase {
  constructor(private readonly repository: AccessControlRepository) {}

  async execute({ userUuid, groupUuid }: { userUuid: string; groupUuid: string }): Promise<void> {
    const group = await this.repository.findByUuid(groupUuid);

    if (!group) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    await this.repository.assignUserToGroup(userUuid, groupUuid);
  }
}
