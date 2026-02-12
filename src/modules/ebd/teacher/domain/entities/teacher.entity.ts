import { Entity } from '../../../../../Common/Domain/Entities/entity';

export type TeacherProps = {
  databaseId?: number;
  uuid?: string;
  id_person: number;
  bo_situacao?: boolean;
  created_at?: Date;
};

export class TeacherEntity extends Entity<TeacherProps> {
  constructor(props: TeacherProps, id?: string) {
    super(props, id);
    this.props.bo_situacao = this.props.bo_situacao ?? true;
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

  get bo_situacao() {
    return this.props.bo_situacao;
  }

  get created_at() {
    return this.props.created_at;
  }
}
