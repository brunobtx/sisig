import { ClassSessionEntity } from '../entities/class-session.entity';

export type ClassSessionAttendanceStatus = 'pending' | 'partial' | 'completed';

export type ClassSessionWithTeacher = {
  id: number;
  uuid: string;
  id_turma: number;
  dt_session: Date;
  nr_lesson: number;
  trimester: number;
  topic: string;
  id_teacher: number;
  notes?: string | null;
  id_person: number;
  createdAt: Date;
  updatedAt: Date;
  attendance_status: ClassSessionAttendanceStatus;
  attendance_students_count: number;
  enrolled_students_count: number;
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
};

export type ClassSessionAttendanceStudent = {
  uuid?: string | null;
  id_class_session: number;
  id_student: number;
  is_present: boolean | null;
  notes?: string | null;
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
};

export type SaveClassSessionAttendanceItem = {
  id_student: number;
  is_present: boolean;
  notes?: string;
};

export interface ClassSessionRepository {
  turmaExists(id_turma: number): Promise<boolean>;
  teacherExists(id_teacher: number): Promise<boolean>;
  personExists(id_person: number): Promise<boolean>;
  isTeacherLinkedToTurma(id_teacher: number, id_turma: number): Promise<boolean>;
  lessonNumberExists(id_turma: number, nr_lesson: number): Promise<boolean>;
  findById(id: number): Promise<ClassSessionEntity | null>;
  findDetailedById(id: number): Promise<ClassSessionWithTeacher | null>;
  listByTurma(id_turma: number): Promise<ClassSessionWithTeacher[]>;
  listAttendanceByClassSession(id_class_session: number): Promise<ClassSessionAttendanceStudent[]>;
  saveAttendance(
    id_class_session: number,
    items: SaveClassSessionAttendanceItem[],
  ): Promise<ClassSessionAttendanceStudent[]>;
  create(data: ClassSessionEntity): Promise<ClassSessionEntity>;
}
