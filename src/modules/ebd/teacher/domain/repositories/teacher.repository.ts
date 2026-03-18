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
  personExists(id_person: number, id_organization?: number | null): Promise<boolean>;
  findByIdPerson(id_person: number, id_organization?: number | null): Promise<TeacherEntity | null>;
  findAllWithPerson(id_organization?: number | null): Promise<TeacherWithPerson[]>;
  create(teacher: TeacherEntity): Promise<TeacherEntity>;
}
