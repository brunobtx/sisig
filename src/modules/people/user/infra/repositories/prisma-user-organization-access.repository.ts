import prismaClient from '../../../../../prisma';
import {
  UserOrganizationAccessContext,
  normalizeUserOrganizationScope,
} from '../../../../../shared/auth/organization-access';
import { AppError } from '../../../../../shared/errors/AppError';
import {
  ReplaceUserOrganizationAccessItem,
  UserOrganizationAccessRepository,
} from '../../domain/repositories/user-organization-access.repository';

export class PrismaUserOrganizationAccessRepository implements UserOrganizationAccessRepository {
  async listByUserDatabaseId(userId: number): Promise<UserOrganizationAccessContext[]> {
    const rows = await prismaClient.userOrganizationAccess.findMany({
      where: { id_user: userId },
      include: {
        organization: {
          select: {
            id: true,
            uuid: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: [{ is_default: 'desc' }, { created_at: 'asc' }],
    });

    return rows.map((row) => ({
      id_organization: row.id_organization,
      scope: normalizeUserOrganizationScope(row.scope),
      is_default: row.is_default,
      organization: row.organization,
    }));
  }

  async replaceUserOrganizationAccesses(
    userUuid: string,
    items: ReplaceUserOrganizationAccessItem[],
  ): Promise<void> {
    const user = await prismaClient.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const normalizedItems = Array.from(
      new Map(
        items
          .filter((item) => item.organizationUuid?.trim())
          .map((item) => [
            `${item.organizationUuid}:${item.scope}`,
            {
              organizationUuid: item.organizationUuid.trim(),
              scope: normalizeUserOrganizationScope(item.scope),
              isDefault: item.isDefault,
            },
          ]),
      ).values(),
    );

    const defaultIndex = normalizedItems.findIndex((item) => item.isDefault);
    if (normalizedItems.length > 0) {
      const resolvedDefaultIndex = defaultIndex === -1 ? 0 : defaultIndex;

      normalizedItems.forEach((item, index) => {
        item.isDefault = index === resolvedDefaultIndex;
      });
    }

    const organizationUuids = normalizedItems.map((item) => item.organizationUuid);
    const organizations =
      organizationUuids.length > 0
        ? await prismaClient.organization.findMany({
            where: {
              uuid: {
                in: organizationUuids,
              },
            },
            select: {
              id: true,
              uuid: true,
            },
          })
        : [];

    const organizationIdByUuid = new Map(organizations.map((organization) => [organization.uuid, organization.id]));

    for (const item of normalizedItems) {
      if (!organizationIdByUuid.has(item.organizationUuid)) {
        throw new AppError('Uma ou mais organizacoes informadas nao existem.', 404);
      }
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.userOrganizationAccess.deleteMany({
        where: { id_user: user.id },
      });

      if (normalizedItems.length === 0) {
        return;
      }

      for (const item of normalizedItems) {
        await tx.userOrganizationAccess.create({
          data: {
            id_user: user.id,
            id_organization:
              organizationIdByUuid.get(item.organizationUuid) as number,
            scope: item.scope,
            is_default: item.isDefault,
          },
        });
      }
    });
  }
}
