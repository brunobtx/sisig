import { StudentEntity } from '../entities/student.entity';

export type StudentWithPerson = {
  id: number;
  uuid: string;
  id_person: number;
  bo_situacao: boolean;
  person: {
    id: number;
    name: string;
    email: string;
    cpf: string;
  };
};

export interface StudentRepository {
  personExists(id_person: number): Promise<boolean>;
  findByIdPerson(id_person: number): Promise<StudentEntity | null>;
  findAllWithPerson(): Promise<StudentWithPerson[]>;
  create(student: StudentEntity): Promise<StudentEntity>;
}
