import { Entity } from '../../../../../shared/domain/entities/entity';

export type ClassSessionProps = {
  databaseId?: number;
  uuid?: string;
  id_class: number;
  dt_session: Date;
  nr_lesson: number;
  topic: string;
  id_teacher: number;
  notes?: string;
  id_person: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ClassSessionEntity extends Entity<ClassSessionProps> {
  constructor(props: ClassSessionProps, id?: string) {
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
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

  get dt_session() {
    return this.props.dt_session;
  }

  get nr_lesson() {
    return this.props.nr_lesson;
  }

  get topic() {
    return this.props.topic;
  }

  get id_teacher() {
    return this.props.id_teacher;
  }

  get notes() {
    return this.props.notes;
  }

  get id_person() {
    return this.props.id_person;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
