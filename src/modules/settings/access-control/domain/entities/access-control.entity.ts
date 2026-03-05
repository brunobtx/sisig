import { Entity } from '../../../../../shared/domain/entities/entity';

export type AccessControlProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class AccessControlEntity extends Entity<AccessControlProps> {
  constructor(props: AccessControlProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? new Date();
    this.props.is_active = this.props.is_active ?? true;
    this.props.permissions = this.props.permissions ?? [];
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

  get description() {
    return this.props.description ?? null;
  }

  get is_active() {
    return this.props.is_active ?? true;
  }

  get permissions() {
    return this.props.permissions ?? [];
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
