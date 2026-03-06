import { OrganizationEntity, OrganizationType } from '../../domain/entities/organization.entity';

export type OrganizationOutputDto = {
  uuid: string;
  id: number | string;
  name: string;
  type: OrganizationType;
  parent_uuid?: string | null;
  bo_situacao: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export class OrganizationOutputMapper {
  static toOutput(entity: OrganizationEntity): OrganizationOutputDto {
    return {
      uuid: entity.uuid,
      id: entity.databaseId ?? entity.id,
      name: entity.name,
      type: entity.type,
      parent_uuid: entity.parent_uuid,
      bo_situacao: entity.bo_situacao,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
