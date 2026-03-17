import { LessonEntity } from '../entities/lesson.entity';

export interface LessonRepository {
  turmaExists(id_turma: number): Promise<boolean>;
  periodExists(id_period: number): Promise<boolean>;
  personExists(id_person: number): Promise<boolean>;
  create(data: LessonEntity): Promise<LessonEntity>;
}
