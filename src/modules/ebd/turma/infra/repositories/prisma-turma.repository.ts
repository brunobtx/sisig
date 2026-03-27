import prismaClient from '../../../../../prisma';
import { TurmaEntity } from '../../domain/entities/turma.entity';
import {
  StudentTurmaRelation,
  TeacherTurmaRelation,
  TurmaFilters,
  TurmaRepository,
} from '../../domain/repositories/turma.repository';
import { TurmaPrismaMapper } from '../prisma/mappers/turma-prisma.mapper';

export class PrismaTurmaRepository implements TurmaRepository {
  async findById(id: number, id_organization?: number | null): Promise<TurmaEntity | null> {
    const turma = await prismaClient.turma.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return turma ? TurmaPrismaMapper.toEntity(turma) : null;
  }

  async findAll(filters?: TurmaFilters, id_organization?: number | null): Promise<TurmaEntity[]> {
    const where: TurmaFilters = {};
    if (filters?.id_class) {
      where.id_class = filters.id_class;
    }
    if (filters?.id_academic_year) {
      where.id_academic_year = filters.id_academic_year;
    }

    const turmas = await prismaClient.turma.findMany({
      where:
        Object.keys(where).length > 0 || typeof id_organization === 'number'
          ? {
              ...where,
              ...(typeof id_organization === 'number' ? { id_organization } : {}),
            }
          : undefined,
      orderBy: { created_at: 'desc' },
    });

    return turmas.map((turma) => TurmaPrismaMapper.toEntity(turma));
  }

  async create(data: TurmaEntity): Promise<TurmaEntity> {
    const turma = await prismaClient.turma.create({
      // Keep compatibility while local Prisma Client types are stale.
      data: {
        uuid: data.id,
        id_class: data.id_class,
        id_academic_year: data.id_academic_year,
        id_organization: data.id_organization ?? null,
        bo_situacao: data.bo_situacao ?? true,
      } as any,
    });

    return TurmaPrismaMapper.toEntity(turma);
  }

  async classExists(id: number, id_organization?: number | null): Promise<boolean> {
    const classe = await prismaClient.class.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return !!classe;
  }

  async academicYearExists(id: number, id_organization?: number | null): Promise<boolean> {
    const year = await prismaClient.academicYear.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return !!year;
  }

  async teacherExists(id: number): Promise<boolean> {
    const teacher = await prismaClient.teacher.findUnique({ where: { id } });
    return !!teacher;
  }

  async studentExists(id: number): Promise<boolean> {
    const student = await prismaClient.student.findUnique({ where: { id } });
    return !!student;
  }

  async isTeacherLinkedToTurma(id_teacher: number, id_turma: number): Promise<boolean> {
    const linked = await prismaClient.turmaTeacher.findFirst({
      where: { id_teacher, id_turma },
    });

    return !!linked;
  }

  async findStudentTurmaLinkByYear(
    id_student: number,
    id_academic_year: number,
    id_organization?: number | null,
  ): Promise<{ id_turma: number } | null> {
    const linked = await prismaClient.turmaStudent.findFirst({
      where: {
        id_student,
        turma: {
          id_academic_year,
          ...(typeof id_organization === 'number' ? { id_organization } : {}),
        },
      },
      select: { id_turma: true },
    });

    return linked;
  }

  async createTeacherLink(id_teacher: number, id_turma: number): Promise<TeacherTurmaRelation> {
    const relation = await prismaClient.turmaTeacher.create({
      data: { id_teacher, id_turma },
      include: {
        teacher: {
          include: {
            person: {
              select: { id: true, name: true },
            },
          },
        },
        turma: {
          include: {
            class: { select: { id: true, uuid: true, name: true } },
            academicYear: { select: { id: true, year: true } },
          },
        },
      },
    });

    return {
      uuid: relation.uuid,
      id_teacher: relation.id_teacher,
      id_turma: relation.id_turma,
      teacher: {
        id: relation.teacher.id,
        uuid: relation.teacher.uuid,
        person: relation.teacher.person,
      },
      turma: {
        id: relation.turma.id,
        uuid: relation.turma.uuid,
        class: relation.turma.class,
        academicYear: relation.turma.academicYear,
      },
    };
  }

  async listTeachersByTurma(id_turma: number): Promise<TeacherTurmaRelation[]> {
    const relations = await prismaClient.turmaTeacher.findMany({
      where: { id_turma },
      include: {
        teacher: {
          include: {
            person: {
              select: { id: true, name: true },
            },
          },
        },
        turma: {
          include: {
            class: { select: { id: true, uuid: true, name: true } },
            academicYear: { select: { id: true, year: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return relations.map((relation) => ({
      uuid: relation.uuid,
      id_teacher: relation.id_teacher,
      id_turma: relation.id_turma,
      teacher: {
        id: relation.teacher.id,
        uuid: relation.teacher.uuid,
        person: relation.teacher.person,
      },
      turma: {
        id: relation.turma.id,
        uuid: relation.turma.uuid,
        class: relation.turma.class,
        academicYear: relation.turma.academicYear,
      },
    }));
  }

  async createStudentLink(id_student: number, id_turma: number): Promise<StudentTurmaRelation> {
    const relation = await prismaClient.turmaStudent.create({
      data: { id_student, id_turma },
      include: {
        student: {
          include: {
            person: {
              select: { id: true, name: true },
            },
          },
        },
        turma: {
          include: {
            class: { select: { id: true, uuid: true, name: true } },
            academicYear: { select: { id: true, year: true } },
          },
        },
      },
    });

    return {
      uuid: relation.uuid,
      id_student: relation.id_student,
      id_turma: relation.id_turma,
      student: {
        id: relation.student.id,
        uuid: relation.student.uuid,
        person: relation.student.person,
      },
      turma: {
        id: relation.turma.id,
        uuid: relation.turma.uuid,
        class: relation.turma.class,
        academicYear: relation.turma.academicYear,
      },
    };
  }

  async listStudentsByTurma(id_turma: number): Promise<StudentTurmaRelation[]> {
    const relations = await prismaClient.turmaStudent.findMany({
      where: { id_turma },
      include: {
        student: {
          include: {
            person: {
              select: { id: true, name: true },
            },
          },
        },
        turma: {
          include: {
            class: { select: { id: true, uuid: true, name: true } },
            academicYear: { select: { id: true, year: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return relations.map((relation) => ({
      uuid: relation.uuid,
      id_student: relation.id_student,
      id_turma: relation.id_turma,
      student: {
        id: relation.student.id,
        uuid: relation.student.uuid,
        person: relation.student.person,
      },
      turma: {
        id: relation.turma.id,
        uuid: relation.turma.uuid,
        class: relation.turma.class,
        academicYear: relation.turma.academicYear,
      },
    }));
  }
}
