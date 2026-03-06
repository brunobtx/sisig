import { Entity } from '../../../../../shared/domain/entities/entity';

export type OrganizationType = 'area' | 'headquarters' | 'congregation';

export type OrganizationProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  type: OrganizationType;
  id_parent?: number | null;
  parent_uuid?: string | null;
  bo_situacao: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class OrganizationEntity extends Entity<OrganizationProps> {
  constructor(props: OrganizationProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get name() {
    return this.props.name;
  }

  get type() {
    return this.props.type;
  }

  get id_parent() {
    return this.props.id_parent;
  }

  get parent_uuid() {
    return this.props.parent_uuid;
  }

  get bo_situacao() {
    return this.props.bo_situacao;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
