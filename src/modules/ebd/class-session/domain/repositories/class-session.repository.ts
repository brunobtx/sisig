import { ClassSessionEntity } from '../entities/class-session.entity';

export interface ClassSessionRepository {
  classExists(id_class: number): Promise<boolean>;
  teacherExists(id_teacher: number): Promise<boolean>;
  personExists(id_person: number): Promise<boolean>;
  create(data: ClassSessionEntity): Promise<ClassSessionEntity>;
}
