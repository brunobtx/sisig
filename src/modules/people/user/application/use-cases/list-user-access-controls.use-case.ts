import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlRepository } from '../../../../settings/access-control/domain/repositories/access-control.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserAccessControlsOutputDto } from '../dtos/user-access-controls-output.dto';

export class ListUserAccessControlsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessControlRepository: AccessControlRepository,
  ) {}

  async execute(userUuid: string): Promise<UserAccessControlsOutputDto> {
    const user = await this.userRepository.findByUuid(userUuid);

    if (!user || !user.databaseId) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const groupUuids = await this.accessControlRepository.listGroupUuidsByUserDatabaseId(user.databaseId);

    return {
      userUuid,
      groupUuids,
    };
  }
}
