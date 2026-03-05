import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlRepository } from '../../../../settings/access-control/domain/repositories/access-control.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserAccessControlsInputDto } from '../dtos/update-user-access-controls-input.dto';

export class UpdateUserAccessControlsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessControlRepository: AccessControlRepository,
  ) {}

  async execute(userUuid: string, data: UpdateUserAccessControlsInputDto): Promise<void> {
    const user = await this.userRepository.findByUuid(userUuid);

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const groupUuids = Array.from(new Set((data.groupUuids ?? []).filter(Boolean)));

    await this.accessControlRepository.replaceUserGroups(userUuid, groupUuids);
  }
}
