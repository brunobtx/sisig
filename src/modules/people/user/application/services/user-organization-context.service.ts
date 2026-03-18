import {
  normalizeUserOrganizationAccesses,
  normalizeUserOrganizationScope,
  resolveDefaultOrganizationId,
  UserOrganizationAccessContext,
} from '../../../../../shared/auth/organization-access';
import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationRepository } from '../../../../organization/organization/domain/repositories/organization.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserOrganizationAccessRepository } from '../../domain/repositories/user-organization-access.repository';

export type UserOrganizationContext = {
  organizationAccessMode: 'scoped';
  activeOrganizationId: number;
  organizationAccesses: UserOrganizationAccessContext[];
};

export class UserOrganizationContextService {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationAccessRepository: UserOrganizationAccessRepository,
  ) {}

  async listByUser(
    userDatabaseId: number,
    idPerson: number,
  ): Promise<UserOrganizationAccessContext[]> {
    const persistedAccesses =
      await this.userOrganizationAccessRepository.listByUserDatabaseId(
        userDatabaseId,
      );

    if (persistedAccesses.length > 0) {
      return normalizeUserOrganizationAccesses(persistedAccesses);
    }

    return this.resolveFallbackAccesses(idPerson);
  }

  async resolveRequiredByUser(
    userDatabaseId: number,
    idPerson: number,
  ): Promise<UserOrganizationContext> {
    const organizationAccesses = await this.listByUser(userDatabaseId, idPerson);
    const activeOrganizationId = resolveDefaultOrganizationId(
      null,
      organizationAccesses,
    );

    if (!activeOrganizationId) {
      throw new AppError(
        'Nenhuma organizacao de acesso foi configurada para este usuario.',
        403,
      );
    }

    return {
      organizationAccessMode: 'scoped',
      activeOrganizationId,
      organizationAccesses,
    };
  }

  private async resolveFallbackAccesses(
    idPerson: number,
  ): Promise<UserOrganizationAccessContext[]> {
    const person = await this.personRepository.findById(idPerson);

    if (!person?.id_organization) {
      return [];
    }

    const organization = await this.organizationRepository.findById(
      person.id_organization,
    );

    if (!organization?.databaseId || !organization.uuid) {
      return [];
    }

    return normalizeUserOrganizationAccesses([
      {
        id_organization: organization.databaseId,
        scope: normalizeUserOrganizationScope('organization'),
        is_default: true,
        organization: {
          id: organization.databaseId,
          uuid: organization.uuid,
          name: organization.name,
          type: organization.type,
        },
      },
    ]);
  }
}
