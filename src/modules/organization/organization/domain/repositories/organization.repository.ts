import { OrganizationEntity } from '../entities/organization.entity';

export interface OrganizationRepository {
  findByUUID(uuid: string): Promise<OrganizationEntity | null>;
  findById(id: number): Promise<OrganizationEntity | null>;
  findAll(): Promise<OrganizationEntity[]>;
  findByNameAndParent(name: string, parentId: number | null): Promise<OrganizationEntity | null>;
  nameExistsForAnother(uuid: string, name: string, parentId: number | null): Promise<boolean>;
  create(organization: OrganizationEntity): Promise<OrganizationEntity>;
  update(organization: OrganizationEntity): Promise<OrganizationEntity>;
  inactivateByUUID(uuid: string): Promise<void>;
  hasActiveChildren(uuid: string): Promise<boolean>;
  hasLinkedUsers(uuid: string): Promise<boolean>;
}
