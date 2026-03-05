import { AccessControlEntity } from '../entities/access-control.entity';

export type CreateAccessControlRepositoryInput = {
  name: string;
  description?: string;
  permissions: string[];
};

export interface AccessControlRepository {
  findByName(name: string): Promise<AccessControlEntity | null>;
  findByUuid(uuid: string): Promise<AccessControlEntity | null>;
  list(): Promise<AccessControlEntity[]>;
  create(data: CreateAccessControlRepositoryInput): Promise<AccessControlEntity>;
  updateByUuid(uuid: string, data: CreateAccessControlRepositoryInput): Promise<AccessControlEntity>;
  assignUserToGroup(userUuid: string, groupUuid: string): Promise<void>;
  replaceUserGroups(userUuid: string, groupUuids: string[]): Promise<void>;
  listGroupUuidsByUserDatabaseId(userId: number): Promise<string[]>;
  listPermissionKeysByUserDatabaseId(userId: number): Promise<string[]>;
}
