import { LessonEntity } from '../entities/lesson.entity';

export interface LessonRepository {
  classExists(id_class: number): Promise<boolean>;
  periodExists(id_period: number): Promise<boolean>;
  personExists(id_person: number): Promise<boolean>;
  create(data: LessonEntity): Promise<LessonEntity>;
}
