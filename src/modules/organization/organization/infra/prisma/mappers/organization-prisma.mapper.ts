import { OrganizationEntity } from '../../../domain/entities/organization.entity';

export class OrganizationPrismaMapper {
  static toEntity(organization: any): OrganizationEntity {
    return new OrganizationEntity(
      {
        databaseId: organization.id,
        uuid: organization.uuid,
        name: organization.name,
        type: organization.type,
        id_parent: organization.id_parent,
        parent_uuid: organization.parent?.uuid ?? null,
        bo_situacao: organization.bo_situacao,
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
      },
      organization.uuid,
    );
  }
}
