import { Entity } from '../../../../../shared/domain/entities/entity';

export type AcademicPeriodProps = {
  databaseId?: number;
  id_academy_year: number;
  name: string;
  dt_start: Date;
  dt_end: Date;
  id_person_create: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class AcademicPeriodEntity extends Entity<AcademicPeriodProps> {
  constructor(props: AcademicPeriodProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get id_academy_year() {
    return this.props.id_academy_year;
  }

  get name() {
    return this.props.name;
  }

  get dt_start() {
    return this.props.dt_start;
  }

  get dt_end() {
    return this.props.dt_end;
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
