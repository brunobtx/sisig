import { TurmaEntity } from '../entities/turma.entity';

export type TeacherTurmaRelation = {
  uuid: string;
  id_teacher: number;
  id_turma: number;
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
  turma: {
    id: number;
    uuid: string;
    class: {
      id: number;
      uuid: string;
      name: string;
    };
    academicYear: {
      id: number;
      year: number;
    };
  };
};

export type StudentTurmaRelation = {
  uuid: string;
  id_student: number;
  id_turma: number;
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
  turma: {
    id: number;
    uuid: string;
    class: {
      id: number;
      uuid: string;
      name: string;
    };
    academicYear: {
      id: number;
      year: number;
    };
  };
};

export type TurmaFilters = {
  id_class?: number;
  id_academic_year?: number;
};

export interface TurmaRepository {
  findById(id: number, id_organization?: number | null): Promise<TurmaEntity | null>;
  findAll(filters?: TurmaFilters, id_organization?: number | null): Promise<TurmaEntity[]>;
  create(data: TurmaEntity): Promise<TurmaEntity>;
  classExists(id: number, id_organization?: number | null): Promise<boolean>;
  academicYearExists(id: number, id_organization?: number | null): Promise<boolean>;
  teacherExists(id: number): Promise<boolean>;
  studentExists(id: number): Promise<boolean>;
  isTeacherLinkedToTurma(id_teacher: number, id_turma: number): Promise<boolean>;
  findStudentTurmaLinkByYear(
    id_student: number,
    id_academic_year: number,
    id_organization?: number | null,
  ): Promise<{ id_turma: number } | null>;
  createTeacherLink(id_teacher: number, id_turma: number): Promise<TeacherTurmaRelation>;
  createStudentLink(id_student: number, id_turma: number): Promise<StudentTurmaRelation>;
  listTeachersByTurma(id_turma: number): Promise<TeacherTurmaRelation[]>;
  listStudentsByTurma(id_turma: number): Promise<StudentTurmaRelation[]>;
}
