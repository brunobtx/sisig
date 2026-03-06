import { OrganizationType } from '../../domain/entities/organization.entity';

export type OrganizationInputDto = {
  name: string;
  type: OrganizationType;
  parent_uuid?: string | null;
  bo_situacao: boolean;
};

export type { OrganizationType };
