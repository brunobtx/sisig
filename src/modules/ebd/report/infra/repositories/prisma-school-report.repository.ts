import prismaClient from '../../../../../prisma';
import {
  SchoolAttendanceReport,
  SchoolAttendanceReportFilters,
  SchoolAttendanceStudentReport,
  SchoolAttendanceTurmaReport,
  SchoolReportRepository,
} from '../../domain/repositories/school-report.repository';

type TurmaAccumulator = SchoolAttendanceTurmaReport;

export class PrismaSchoolReportRepository implements SchoolReportRepository {
  async academicYearExists(id_academic_year: number, id_organization?: number | null): Promise<boolean> {
    const academicYear = await prismaClient.academicYear.findUnique({
      where: { id: id_academic_year },
      select: { id: true },
    });

    if (!academicYear) {
      return false;
    }

    if (typeof id_organization !== 'number') {
      return true;
    }

    const scopedYear = await prismaClient.academicYear.findFirst({
      where: { id: id_academic_year, id_organization },
      select: { id: true },
    });

    return !!scopedYear;
  }

  async turmaExists(id_turma: number, id_organization?: number | null): Promise<boolean> {
    const turma = await prismaClient.turma.findFirst({
      where: {
        id: id_turma,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
      select: { id: true },
    });

    return !!turma;
  }

  async getAttendanceReport(
    filters: SchoolAttendanceReportFilters,
    id_organization?: number | null,
  ): Promise<SchoolAttendanceReport> {
    const turmaWhere = {
      id_academic_year: filters.id_academic_year,
      ...(typeof id_organization === 'number' ? { id_organization } : {}),
      ...(filters.id_turma ? { id: filters.id_turma } : {}),
    };

    const classSessionWhere = {
      turma: turmaWhere,
      ...(filters.trimester ? { trimester: filters.trimester } : {}),
    };

    const [turmas, classSessions, attendances] = await Promise.all([
      prismaClient.turma.findMany({
        where: turmaWhere,
        select: {
          id: true,
          uuid: true,
          class: {
            select: {
              name: true,
            },
          },
          academicYear: {
            select: {
              year: true,
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
      }),
      prismaClient.classSession.findMany({
        where: classSessionWhere as any,
        select: {
          id: true,
          id_turma: true,
          _count: {
            select: {
              attendances: true,
            },
          },
        },
      }),
      prismaClient.classSessionAttendance.findMany({
        where: {
          classSession: classSessionWhere as any,
        } as any,
        select: {
          is_present: true,
          id_student: true,
          classSession: {
            select: {
              id_turma: true,
            },
          },
        },
      }),
    ]);

    const turmaMap = new Map<number, TurmaAccumulator>(
      turmas.map((turma) => [
        turma.id,
        {
          id_turma: turma.id,
          turma_uuid: turma.uuid,
          class_name: turma.class.name,
          academic_year: turma.academicYear.year,
          total_students: turma._count.students,
          total_class_sessions: 0,
          total_completed_class_sessions: 0,
          total_partial_class_sessions: 0,
          total_pending_class_sessions: 0,
          total_attendance_records: 0,
          total_present: 0,
          total_absent: 0,
          attendance_rate: 0,
        },
      ]),
    );

    for (const classSession of classSessions) {
      const turma = turmaMap.get(classSession.id_turma);
      if (!turma) {
        continue;
      }

      turma.total_class_sessions += 1;

      if (classSession._count.attendances === 0) {
        turma.total_pending_class_sessions += 1;
        continue;
      }

      if (turma.total_students > 0 && classSession._count.attendances >= turma.total_students) {
        turma.total_completed_class_sessions += 1;
      } else {
        turma.total_partial_class_sessions += 1;
      }
    }

    for (const attendance of attendances) {
      const turma = turmaMap.get(attendance.classSession.id_turma);
      if (!turma) {
        continue;
      }

      turma.total_attendance_records += 1;
      if (attendance.is_present) {
        turma.total_present += 1;
      } else {
        turma.total_absent += 1;
      }
    }

    const turmaReports = Array.from(turmaMap.values()).map((turma) => ({
      ...turma,
      attendance_rate: this.calculateAttendanceRate(turma.total_present, turma.total_absent),
    }));

    const students = filters.id_turma
      ? await this.buildStudentReports(filters.id_turma, filters.trimester)
      : [];

    const summary = turmaReports.reduce(
      (acc, turma) => {
        acc.total_turmas += 1;
        acc.total_students += turma.total_students;
        acc.total_class_sessions += turma.total_class_sessions;
        acc.total_completed_class_sessions += turma.total_completed_class_sessions;
        acc.total_partial_class_sessions += turma.total_partial_class_sessions;
        acc.total_pending_class_sessions += turma.total_pending_class_sessions;
        acc.total_attendance_records += turma.total_attendance_records;
        acc.total_present += turma.total_present;
        acc.total_absent += turma.total_absent;
        return acc;
      },
      {
        total_turmas: 0,
        total_students: 0,
        total_class_sessions: 0,
        total_completed_class_sessions: 0,
        total_partial_class_sessions: 0,
        total_pending_class_sessions: 0,
        total_attendance_records: 0,
        total_present: 0,
        total_absent: 0,
        attendance_rate: 0,
      },
    );

    summary.attendance_rate = this.calculateAttendanceRate(summary.total_present, summary.total_absent);

    return {
      summary,
      turmas: turmaReports,
      students,
    };
  }

  private async buildStudentReports(
    id_turma: number,
    trimester?: number,
  ): Promise<SchoolAttendanceStudentReport[]> {
    const [turmaStudents, attendances] = await Promise.all([
      prismaClient.turmaStudent.findMany({
        where: { id_turma },
        include: {
          student: {
            include: {
              person: {
                select: {
                  name: true,
                  email: true,
                  cpf: true,
                },
              },
            },
          },
        },
      }),
      prismaClient.classSessionAttendance.findMany({
        where: {
          classSession: {
            turma: {
              id: id_turma,
            },
            ...(trimester ? { trimester } : {}),
          },
        } as any,
        select: {
          id_student: true,
          is_present: true,
        },
      }),
    ]);

    const studentMap = new Map<number, SchoolAttendanceStudentReport>(
      turmaStudents.map((relation) => [
        relation.student.id,
        {
          id_student: relation.student.id,
          student_uuid: relation.student.uuid,
          name: relation.student.person.name,
          email: relation.student.person.email,
          cpf: relation.student.person.cpf,
          total_present: 0,
          total_absent: 0,
          attendance_rate: 0,
        },
      ]),
    );

    for (const attendance of attendances) {
      const student = studentMap.get(attendance.id_student);
      if (!student) {
        continue;
      }

      if (attendance.is_present) {
        student.total_present += 1;
      } else {
        student.total_absent += 1;
      }
    }

    return Array.from(studentMap.values())
      .map((student) => ({
        ...student,
        attendance_rate: this.calculateAttendanceRate(student.total_present, student.total_absent),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private calculateAttendanceRate(totalPresent: number, totalAbsent: number): number {
    const total = totalPresent + totalAbsent;
    if (total === 0) {
      return 0;
    }

    return Number(((totalPresent / total) * 100).toFixed(2));
  }
}
