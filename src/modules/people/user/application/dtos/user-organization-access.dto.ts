import { UserOrganizationAccessContext, UserOrganizationScope } from '../../../../../shared/auth/organization-access';

export type UserOrganizationAccessInputDto = {
  organizationUuid: string;
  scope?: UserOrganizationScope | string;
  isDefault?: boolean;
};

export type UpdateUserOrganizationAccessesInputDto = {
  organizationAccesses?: UserOrganizationAccessInputDto[];
};

export type UserOrganizationAccessOutputDto = {
  id_organization: number;
  organizationUuid: string;
  organizationName: string;
  organizationType: string;
  scope: UserOrganizationScope;
  isDefault: boolean;
};

export type UserOrganizationAccessesOutputDto = {
  userUuid: string;
  mode: 'legacy' | 'scoped';
  organizationAccesses: UserOrganizationAccessOutputDto[];
};

export class UserOrganizationAccessOutputMapper {
  static toOutput(
    access: UserOrganizationAccessContext,
  ): UserOrganizationAccessOutputDto {
    return {
      id_organization: access.id_organization,
      organizationUuid: access.organization?.uuid ?? '',
      organizationName: access.organization?.name ?? '',
      organizationType: access.organization?.type ?? '',
      scope: access.scope,
      isDefault: access.is_default,
    };
  }
}
