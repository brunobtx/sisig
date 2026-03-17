import prismaClient from '../../../../../prisma';
import { ClassSessionEntity } from '../../domain/entities/class-session.entity';
import {
  ClassSessionAttendanceStudent,
  ClassSessionRepository,
  ClassSessionWithTeacher,
  SaveClassSessionAttendanceItem,
} from '../../domain/repositories/class-session.repository';
import { ClassSessionPrismaMapper } from '../prisma/mappers/class-session-prisma.mapper';

export class PrismaClassSessionRepository implements ClassSessionRepository {
  async turmaExists(id_turma: number): Promise<boolean> {
    const turma = await prismaClient.turma.findUnique({ where: { id: id_turma } });
    return !!turma;
  }

  async teacherExists(id_teacher: number): Promise<boolean> {
    const teacher = await prismaClient.teacher.findUnique({ where: { id: id_teacher } });
    return !!teacher;
  }

  async personExists(id_person: number): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { id: id_person } });
    return !!person;
  }

  async isTeacherLinkedToTurma(id_teacher: number, id_turma: number): Promise<boolean> {
    const linked = await prismaClient.turmaTeacher.findFirst({
      where: { id_teacher, id_turma },
    });

    return !!linked;
  }

  async lessonNumberExists(id_turma: number, nr_lesson: number): Promise<boolean> {
    const session = await prismaClient.classSession.findFirst({
      where: { id_turma, nr_lesson },
      select: { id: true },
    });

    return !!session;
  }

  async findById(id: number): Promise<ClassSessionEntity | null> {
    const classSession = await prismaClient.classSession.findUnique({ where: { id } });
    return classSession ? ClassSessionPrismaMapper.toEntity(classSession) : null;
  }

  async findDetailedById(id: number): Promise<ClassSessionWithTeacher | null> {
    const classSession = await prismaClient.classSession.findUnique({
      where: { id },
      include: {
        turma: {
          select: {
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
        teacher: {
          include: {
            person: {
              select: { id: true, name: true, email: true, cpf: true },
            },
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    return classSession ? this.mapDetailedSession(classSession) : null;
  }

  async listByTurma(id_turma: number): Promise<ClassSessionWithTeacher[]> {
    const [sessions, enrolledStudentsCount] = await Promise.all([
      prismaClient.classSession.findMany({
        where: { id_turma },
        include: {
          teacher: {
            include: {
              person: {
                select: { id: true, name: true, email: true, cpf: true },
              },
            },
          },
          _count: {
            select: {
              attendances: true,
            },
          },
        },
        orderBy: [{ dt_session: 'desc' }, { nr_lesson: 'desc' }],
      }),
      prismaClient.turmaStudent.count({
        where: { id_turma },
      }),
    ]);

    return sessions.map((session) => this.mapDetailedSession(session, enrolledStudentsCount));
  }

  async listAttendanceByClassSession(id_class_session: number): Promise<ClassSessionAttendanceStudent[]> {
    const classSession = await prismaClient.classSession.findUnique({
      where: { id: id_class_session },
      select: { id_turma: true },
    });

    if (!classSession) {
      return [];
    }

    const [students, attendances] = await Promise.all([
      prismaClient.turmaStudent.findMany({
        where: { id_turma: classSession.id_turma },
        include: {
          student: {
            include: {
              person: {
                select: { id: true, name: true, email: true, cpf: true },
              },
            },
          },
        },
        orderBy: { id: 'desc' },
      }),
      prismaClient.classSessionAttendance.findMany({
        where: { id_class_session: id_class_session },
      }),
    ]);

    const attendanceByStudentId = new Map(
      attendances.map((attendance) => [attendance.id_student, attendance]),
    );

    return students.map((relation) => {
      const attendance = attendanceByStudentId.get(relation.student.id);

      return {
        uuid: attendance?.uuid ?? null,
        id_class_session: id_class_session,
        id_student: relation.student.id,
        is_present: attendance?.is_present ?? null,
        notes: attendance?.notes ?? null,
        student: {
          id: relation.student.id,
          uuid: relation.student.uuid,
          person: relation.student.person,
        },
      };
    });
  }

  async saveAttendance(
    id_class_session: number,
    items: SaveClassSessionAttendanceItem[],
  ): Promise<ClassSessionAttendanceStudent[]> {
    await prismaClient.$transaction(
      items.map((item) =>
        prismaClient.classSessionAttendance.upsert({
          where: {
            id_class_session_id_student: {
              id_class_session: id_class_session,
              id_student: item.id_student,
            },
          },
          create: {
            id_class_session: id_class_session,
            id_student: item.id_student,
            is_present: item.is_present,
            notes: item.notes ?? null,
          },
          update: {
            is_present: item.is_present,
            notes: item.notes ?? null,
          },
        }),
      ),
    );

    return this.listAttendanceByClassSession(id_class_session);
  }

  async create(data: ClassSessionEntity): Promise<ClassSessionEntity> {
    const classSession = await prismaClient.classSession.create({
      data: {
        id_turma: data.id_turma,
        dt_session: data.dt_session,
        nr_lesson: data.nr_lesson,
        trimester: data.trimester,
        topic: data.topic,
        id_teacher: data.id_teacher,
        notes: data.notes,
        id_person: data.id_person,
      },
    });

    return ClassSessionPrismaMapper.toEntity(classSession);
  }

  private mapDetailedSession(data: any, enrolledStudentsCount?: number): ClassSessionWithTeacher {
    const attendanceStudentsCount = data._count?.attendances ?? 0;
    const totalEnrolledStudents = enrolledStudentsCount ?? data.turma?._count?.students ?? 0;

    return {
      id: data.id,
      uuid: data.uuid,
      id_turma: data.id_turma,
      dt_session: data.dt_session,
      nr_lesson: data.nr_lesson,
      trimester: data.trimester,
      topic: data.topic,
      id_teacher: data.id_teacher,
      notes: data.notes ?? null,
      id_person: data.id_person,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      attendance_status: this.resolveAttendanceStatus(
        attendanceStudentsCount,
        totalEnrolledStudents,
      ),
      attendance_students_count: attendanceStudentsCount,
      enrolled_students_count: totalEnrolledStudents,
      teacher: {
        id: data.teacher.id,
        uuid: data.teacher.uuid,
        person: data.teacher.person,
      },
    };
  }

  private resolveAttendanceStatus(
    attendanceStudentsCount: number,
    enrolledStudentsCount: number,
  ): 'pending' | 'partial' | 'completed' {
    if (attendanceStudentsCount === 0) {
      return 'pending';
    }

    if (enrolledStudentsCount > 0 && attendanceStudentsCount >= enrolledStudentsCount) {
      return 'completed';
    }

    return 'partial';
  }
}
