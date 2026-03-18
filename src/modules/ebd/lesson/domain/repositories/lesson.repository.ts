import { LessonEntity } from '../entities/lesson.entity';

export interface LessonRepository {
  turmaExists(id_turma: number, id_organization?: number | null): Promise<boolean>;
  periodExists(id_period: number, id_organization?: number | null): Promise<boolean>;
  personExists(id_person: number, id_organization?: number | null): Promise<boolean>;
  create(data: LessonEntity): Promise<LessonEntity>;
}
