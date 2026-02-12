import { TeacherEntity } from '../entities/teacher.entity';

export interface TeacherRepository {
  personExists(id_person: number): Promise<boolean>;
  findByIdPerson(id_person: number): Promise<TeacherEntity | null>;
  create(teacher: TeacherEntity): Promise<TeacherEntity>;
}
