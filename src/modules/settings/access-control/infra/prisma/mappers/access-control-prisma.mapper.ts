import { AccessControlEntity } from '../../../domain/entities/access-control.entity';

export class AccessControlPrismaMapper {
  static toEntity(data: any): AccessControlEntity {
    const permissions =
      data.permissions?.map((permissionLink: any) => permissionLink.permission?.key).filter(Boolean) ?? [];

    return new AccessControlEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        name: data.name,
        description: data.description,
        is_active: data.is_active,
        permissions,
        createdAt: data.createdAt ?? data.created_at,
        updatedAt: data.updatedAt ?? data.updated_at,
      },
      data.uuid,
    );
  }
}
