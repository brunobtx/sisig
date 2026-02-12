import { Entity } from '../../../../../shared/domain/entities/entity';

export type LessonProps = {
  databaseId?: number;
  uuid?: string;
  id_class: number;
  dt_lesson: Date;
  nr_lesson: number;
  title: string;
  description?: string;
  id_period: number;
  id_person_create: number;
  created_at?: Date;
  updated_at?: Date;
};

export class LessonEntity extends Entity<LessonProps> {
  constructor(props: LessonProps, id?: string) {
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get databaseId() {
    return this.props.databaseId;
  }

  get uuid() {
    return this.props.uuid;
  }

  get id_class() {
    return this.props.id_class;
  }

  get dt_lesson() {
    return this.props.dt_lesson;
  }

  get nr_lesson() {
    return this.props.nr_lesson;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get id_period() {
    return this.props.id_period;
  }

  get id_person_create() {
    return this.props.id_person_create;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }
}
