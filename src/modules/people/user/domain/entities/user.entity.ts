import { Entity } from '../../../../../Common/Domain/Entities/entity';

export type UserProps = {
  databaseId?: number;
  uuid?: string;
  id_person: number;
  password: string;
  created_at?: Date | null;
};

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
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

  get created_at() {
    return this.props.created_at;
  }

  changePassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
