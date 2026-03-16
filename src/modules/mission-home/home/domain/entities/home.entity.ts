import { Entity } from '../../../../../Common/Domain/Entities/entity';

export type HomeProps = {
  databaseId?: number;
  uuid?: string;
  name: string;
  createdAt?: Date;
};

export class HomeEntity extends Entity<HomeProps> {
  constructor(props: HomeProps, id?: string) {
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

  get createdAt() {
    return this.props.createdAt;
  }
}
