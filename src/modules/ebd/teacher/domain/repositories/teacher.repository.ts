import { TeacherEntity } from '../entities/teacher.entity';

export type TeacherWithPerson = {
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

export interface TeacherRepository {
  personExists(id_person: number): Promise<boolean>;
  findByIdPerson(id_person: number): Promise<TeacherEntity | null>;
  findAllWithPerson(): Promise<TeacherWithPerson[]>;
  create(teacher: TeacherEntity): Promise<TeacherEntity>;
}
