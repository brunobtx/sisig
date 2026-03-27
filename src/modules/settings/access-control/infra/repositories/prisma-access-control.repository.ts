import prismaClient from '../../../../../prisma';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../../../shared/errors/AppError';
import {
  AccessControlRepository,
  CreateAccessControlRepositoryInput,
} from '../../domain/repositories/access-control.repository';
import { AccessControlEntity } from '../../domain/entities/access-control.entity';
import { AccessControlPrismaMapper } from '../prisma/mappers/access-control-prisma.mapper';

function parsePermissionKey(key: string): { key: string; serviceCode: string; featureCode: string } | null {
  const [serviceCode, featureCode, ...rest] = key.split(':');

  if (!serviceCode || !featureCode || rest.length > 0) {
    return null;
  }

  return {
    key: `${serviceCode}:${featureCode}`,
    serviceCode,
    featureCode,
  };
}

export class PrismaAccessControlRepository implements AccessControlRepository {
  private readonly groupDetailsInclude = {
    permissions: {
      include: {
        permission: true,
      },
    },
    _count: {
      select: {
        userAssignments: true,
      },
    },
  };

  async findByName(name: string): Promise<AccessControlEntity | null> {
    const row = await (prismaClient as any).permissionGroup.findFirst({
      where: { name },
      include: this.groupDetailsInclude,
    });

    return row ? AccessControlPrismaMapper.toEntity(row) : null;
  }

  async findByUuid(uuid: string): Promise<AccessControlEntity | null> {
    const row = await (prismaClient as any).permissionGroup.findUnique({
      where: { uuid },
      include: this.groupDetailsInclude,
    });

    return row ? AccessControlPrismaMapper.toEntity(row) : null;
  }

  async list(): Promise<AccessControlEntity[]> {
    const rows = await (prismaClient as any).permissionGroup.findMany({
      include: this.groupDetailsInclude,
      orderBy: {
        created_at: 'desc',
      },
    });

    return rows.map((row) => AccessControlPrismaMapper.toEntity(row));
  }

  private async resolvePermissionIds(permissionKeys: string[]): Promise<number[]> {
    const normalizedPermissionsMap = new Map<
      string,
      { key: string; serviceCode: string; featureCode: string }
    >();

    const parsedPermissions = permissionKeys
      .map((permission) => parsePermissionKey(permission))
      .filter(
        (permission): permission is { key: string; serviceCode: string; featureCode: string } =>
          Boolean(permission),
      );

    for (const permission of parsedPermissions) {
      normalizedPermissionsMap.set(permission.key, permission);
    }

    const normalizedPermissions = Array.from(normalizedPermissionsMap.values());

    if (!normalizedPermissions.length) {
      throw new AppError('Informe ao menos uma permissao valida no formato servico:funcionalidade.', 400);
    }

    const permissionIds = new Set<number>();

    for (const permission of normalizedPermissions) {
      const service = await (prismaClient as any).service.upsert({
        where: {
          code: permission.serviceCode,
        },
        create: {
          uuid: uuidv4(),
          code: permission.serviceCode,
          name: permission.serviceCode,
        },
        update: {
          name: permission.serviceCode,
        },
        select: {
          id: true,
        },
      });

      const feature = await (prismaClient as any).feature.upsert({
        where: {
          service_id_code: {
            service_id: service.id,
            code: permission.featureCode,
          },
        },
        create: {
          uuid: uuidv4(),
          service_id: service.id,
          code: permission.featureCode,
          name: permission.featureCode,
        },
        update: {
          name: permission.featureCode,
        },
        select: {
          id: true,
        },
      });

      const persistedPermission = await (prismaClient as any).permission.upsert({
        where: {
          key: permission.key,
        },
        create: {
          key: permission.key,
          service_id: service.id,
          feature_id: feature.id,
        },
        update: {
          service_id: service.id,
          feature_id: feature.id,
        },
        select: {
          id: true,
        },
      });

      permissionIds.add(persistedPermission.id);
    }

    return Array.from(permissionIds);
  }

  async create(data: CreateAccessControlRepositoryInput): Promise<AccessControlEntity> {
    const permissionIds = await this.resolvePermissionIds(data.permissions);

    const group = await (prismaClient as any).permissionGroup.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission_id: permissionId,
          })),
        },
      },
      include: this.groupDetailsInclude,
    });

    return AccessControlPrismaMapper.toEntity(group);
  }

  async updateByUuid(uuid: string, data: CreateAccessControlRepositoryInput): Promise<AccessControlEntity> {
    const existingGroup = await (prismaClient as any).permissionGroup.findUnique({
      where: { uuid },
      select: { id: true },
    });

    if (!existingGroup) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    const permissionIds = await this.resolvePermissionIds(data.permissions);

    const group = await (prismaClient as any).permissionGroup.update({
      where: { uuid },
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          deleteMany: {},
          create: permissionIds.map((permissionId) => ({
            permission_id: permissionId,
          })),
        },
      },
      include: this.groupDetailsInclude,
    });

    return AccessControlPrismaMapper.toEntity(group);
  }

  async inactivateByUuid(uuid: string): Promise<AccessControlEntity> {
    const group = await (prismaClient as any).permissionGroup.update({
      where: { uuid },
      data: {
        is_active: false,
      },
      include: this.groupDetailsInclude,
    });

    return AccessControlPrismaMapper.toEntity(group);
  }

  async assignUserToGroup(userUuid: string, groupUuid: string): Promise<void> {
    const user = await prismaClient.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const group = await (prismaClient as any).permissionGroup.findUnique({
      where: { uuid: groupUuid },
      select: { id: true, is_active: true },
    });

    if (!group) {
      throw new AppError('Grupo de permissao nao encontrado.', 404);
    }

    if (!group.is_active) {
      throw new AppError('Nao e possivel vincular usuario a um grupo de permissao inativo.', 400);
    }

    await (prismaClient as any).userPermissionGroup.upsert({
      where: {
        user_id_permission_group_id: {
          user_id: user.id,
          permission_group_id: group.id,
        },
      },
      create: {
        user_id: user.id,
        permission_group_id: group.id,
      },
      update: {},
    });
  }

  async replaceUserGroups(userUuid: string, groupUuids: string[]): Promise<void> {
    const user = await prismaClient.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true },
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404);
    }

    const uniqueGroupUuids = Array.from(new Set(groupUuids.filter(Boolean)));
    const numericGroupIds = uniqueGroupUuids
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);

    const groups = uniqueGroupUuids.length
      ? await (prismaClient as any).permissionGroup.findMany({
          where: {
            OR: [
              {
                uuid: {
                  in: uniqueGroupUuids,
                },
              },
              ...(numericGroupIds.length
                ? [
                    {
                      id: {
                        in: numericGroupIds,
                      },
                    },
                  ]
                : []),
            ],
          },
          select: { id: true, uuid: true, is_active: true },
        })
      : [];

    if (uniqueGroupUuids.length && groups.length !== uniqueGroupUuids.length) {
      const foundGroupReferences = new Set(
        groups.flatMap((group) => [group.uuid, String(group.id)]),
      );
      const missingUuids = uniqueGroupUuids.filter((uuid) => !foundGroupReferences.has(uuid));
      throw new AppError(`Grupo(s) de permissao nao encontrado(s): ${missingUuids.join(', ')}`, 404);
    }

    const inactiveGroups = groups.filter((group) => !group.is_active);

    if (inactiveGroups.length) {
      throw new AppError(
        `Nao e possivel vincular grupo(s) de permissao inativo(s): ${inactiveGroups
          .map((group) => group.uuid)
          .join(', ')}`,
        400,
      );
    }

    await (prismaClient as any).$transaction(async (tx: any) => {
      await tx.userPermissionGroup.deleteMany({
        where: {
          user_id: user.id,
        },
      });

      if (groups.length) {
        await tx.userPermissionGroup.createMany({
          data: groups.map((group) => ({
            user_id: user.id,
            permission_group_id: group.id,
          })),
        });
      }
    });
  }

  async listGroupUuidsByUserDatabaseId(userId: number): Promise<string[]> {
    const assignments = await (prismaClient as any).userPermissionGroup.findMany({
      where: {
        user_id: userId,
        permissionGroup: {
          is_active: true,
        },
      },
      select: {
        permissionGroup: {
          select: {
            uuid: true,
          },
        },
      },
    });

    const groupUuids = assignments
      .map((assignment) => assignment.permissionGroup?.uuid)
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set(groupUuids));
  }

  async listPermissionKeysByUserDatabaseId(userId: number): Promise<string[]> {
    const assignments = await (prismaClient as any).userPermissionGroup.findMany({
      where: {
        user_id: userId,
        permissionGroup: {
          is_active: true,
        },
      },
      select: {
        permissionGroup: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: {
                    key: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const keys = assignments.flatMap((assignment) =>
      assignment.permissionGroup.permissions.map((permissionLink) => permissionLink.permission.key),
    );

    return Array.from(new Set(keys));
  }
}
