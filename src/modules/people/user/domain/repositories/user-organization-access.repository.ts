import { UserOrganizationAccessContext, UserOrganizationScope } from '../../../../../shared/auth/organization-access';

export type ReplaceUserOrganizationAccessItem = {
  organizationUuid: string;
  scope: UserOrganizationScope;
  isDefault: boolean;
};

export interface UserOrganizationAccessRepository {
  listByUserDatabaseId(userId: number): Promise<UserOrganizationAccessContext[]>;
  replaceUserOrganizationAccesses(
    userUuid: string,
    items: ReplaceUserOrganizationAccessItem[],
  ): Promise<void>;
}
