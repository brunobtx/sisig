import { StudentEntity } from '../entities/student.entity';

export interface StudentRepository {
  personExists(id_person: number): Promise<boolean>;
  findByIdPerson(id_person: number): Promise<StudentEntity | null>;
  create(student: StudentEntity): Promise<StudentEntity>;
}
