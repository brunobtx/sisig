import { Entity } from "../../../../../Common/Domain/Entities/entity";

export type UserProps = {
  uuid?: string;
  id_person: number;
  password: string;
  created_at: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get uuid() { return this.props.uuid; }
  get id_person() { return this.props.id_person; }
  get password() { return this.props.password; }   // ✅ adicione isto
  get created_at() { return this.props.created_at; }

  changePassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
