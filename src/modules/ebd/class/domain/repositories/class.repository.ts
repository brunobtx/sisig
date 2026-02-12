import { ClassEntity } from '../entities/class.entity';

export type TeacherClassRelation = {
  uuid: string;
  id_teacher: number;
  id_class: number;
  teacher: {
    id: number;
    uuid: string;
    person: {
      id: number;
      name: string;
      email: string;
      cpf: string;
    };
  };
  class: {
    id: number;
    uuid: string;
    name: string;
  };
};

export type StudentClassRelation = {
  uuid: string;
  id_student: number;
  id_class: number;
  student: {
    id: number;
    uuid: string;
    person: {
      id: number;
      name: string;
      email: string;
      cpf: string;
    };
  };
  class: {
    id: number;
    uuid: string;
    name: string;
  };
};

export interface ClassRepository {
  findById(id: number): Promise<ClassEntity | null>;
  create(data: ClassEntity): Promise<ClassEntity>;
  teacherExists(id: number): Promise<boolean>;
  studentExists(id: number): Promise<boolean>;
  isTeacherLinkedToClass(id_teacher: number, id_class: number): Promise<boolean>;
  findStudentClassLink(id_student: number): Promise<{ id_class: number } | null>;
  createTeacherLink(id_teacher: number, id_class: number): Promise<TeacherClassRelation>;
  createStudentLink(id_student: number, id_class: number): Promise<StudentClassRelation>;
}
