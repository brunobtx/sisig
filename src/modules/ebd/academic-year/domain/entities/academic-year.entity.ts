import { Entity } from '../../../../../shared/domain/entities/entity';

export type AcademicYearProps = {
  databaseId?: number;
  uuid?: string;
  year: number;
  id_organization?: number | null;
  id_person_create: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class AcademicYearEntity extends Entity<AcademicYearProps> {
  constructor(props: AcademicYearProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get year() {
    return this.props.year;
  }

  get id_organization() {
    return this.props.id_organization;
  }

  get id_person_create() {
    return this.props.id_person_create;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
