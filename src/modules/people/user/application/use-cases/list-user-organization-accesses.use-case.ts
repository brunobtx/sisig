import { AppError } from '../../../../../shared/errors/AppError';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  UserOrganizationAccessesOutputDto,
  UserOrganizationAccessOutputMapper,
} from '../dtos/user-organization-access.dto';
import { UserOrganizationContextService } from '../services/user-organization-context.service';

export class ListUserOrganizationAccessesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userOrganizationContextService: UserOrganizationContextService,
  ) {}

  async execute(
    userUuid: string,
    id_organization?: number | null,
  ): Promise<UserOrganizationAccessesOutputDto> {
    const user = await this.userRepository.findByUuid(userUuid, id_organization);

    if (!user || !user.databaseId) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const accesses = await this.userOrganizationContextService.listByUser(
      user.databaseId,
      user.id_person,
    );

    return {
      userUuid,
      mode: accesses.length > 0 ? 'scoped' : 'legacy',
      organizationAccesses: accesses.map((access) => UserOrganizationAccessOutputMapper.toOutput(access)),
    };
  }
}
