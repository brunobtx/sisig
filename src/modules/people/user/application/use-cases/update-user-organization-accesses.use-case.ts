import { normalizeUserOrganizationScope } from '../../../../../shared/auth/organization-access';
import { AppError } from '../../../../../shared/errors/AppError';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOrganizationAccessRepository } from '../../domain/repositories/user-organization-access.repository';
import { UpdateUserOrganizationAccessesInputDto } from '../dtos/user-organization-access.dto';

export class UpdateUserOrganizationAccessesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userOrganizationAccessRepository: UserOrganizationAccessRepository,
  ) {}

  async execute(
    userUuid: string,
    data: UpdateUserOrganizationAccessesInputDto,
    id_organization?: number | null,
  ): Promise<void> {
    const user = await this.userRepository.findByUuid(userUuid, id_organization);

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const organizationAccesses = Array.isArray(data.organizationAccesses)
      ? data.organizationAccesses
      : [];

    const normalizedAccesses = organizationAccesses
      .map((access) => ({
        organizationUuid: String(access.organizationUuid ?? '').trim(),
        scope: normalizeUserOrganizationScope(access.scope),
        isDefault: access.isDefault === true,
      }))
      .filter((access) => access.organizationUuid.length > 0);

    const firstDefaultIndex = normalizedAccesses.findIndex((access) => access.isDefault);
    if (normalizedAccesses.length > 0) {
      const resolvedDefaultIndex = firstDefaultIndex === -1 ? 0 : firstDefaultIndex;

      normalizedAccesses.forEach((access, index) => {
        access.isDefault = index === resolvedDefaultIndex;
      });
    }

    await this.userOrganizationAccessRepository.replaceUserOrganizationAccesses(
      userUuid,
      normalizedAccesses,
    );
  }
}
