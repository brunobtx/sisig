import { AccessControlEntity } from '../../domain/entities/access-control.entity';

export type AccessControlOutputDto = {
  id: number | string;
  uuid: string;
  name: string;
  description: string | null;
  is_active: boolean;
  permissions: string[];
  linked_users_count: number;
  created_at: Date | undefined;
  updated_at: Date | undefined;
};

export class AccessControlOutputMapper {
  static toOutput(entity: AccessControlEntity): AccessControlOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? String(entity.databaseId ?? entity.id ?? ''),
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      permissions: entity.permissions,
      linked_users_count: entity.linkedUsersCount,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
