import { Entity } from '../../../../../shared/domain/entities/entity';

export type UserProps = {
  databaseId?: number;
  uuid?: string;
  id_person: number;
  password: string;
  role?: string;
  custom_permissions?: string[];
  created_at?: Date | null;
};

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
    this.props.role = this.props.role ?? 'viewer';
    this.props.custom_permissions = this.props.custom_permissions ?? [];
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get id_person() {
    return this.props.id_person;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get custom_permissions() {
    return this.props.custom_permissions ?? [];
  }

  get created_at() {
    return this.props.created_at;
  }

  changePassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
