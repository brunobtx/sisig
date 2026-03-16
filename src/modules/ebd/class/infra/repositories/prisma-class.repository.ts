import prismaClient from '../../../../../prisma';
import { ClassEntity } from '../../domain/entities/class.entity';
import {
  ClassRepository,
  StudentClassRelation,
  TeacherClassRelation,
} from '../../domain/repositories/class.repository';
import { ClassPrismaMapper } from '../prisma/mappers/class-prisma.mapper';

export class PrismaClassRepository implements ClassRepository {
  async findById(id: number): Promise<ClassEntity | null> {
    const classe = await prismaClient.class.findUnique({ where: { id } });
    return classe ? ClassPrismaMapper.toEntity(classe) : null;
  }

  async findAll(academicYearId?: number): Promise<ClassEntity[]> {
    const classes = await prismaClient.class.findMany({
      where: academicYearId ? { academicYearId } : undefined,
      orderBy: { created_at: 'desc' },
    });

    return classes.map((classe) => ClassPrismaMapper.toEntity(classe));
  }

  async create(data: ClassEntity): Promise<ClassEntity> {
    const classe = await prismaClient.class.create({
      // Keep compatibility while local Prisma Client types are stale.
      data: {
        uuid: data.id,
        name: data.name,
        idade_in: data.idade_in,
        idade_fn: data.idade_fn,
        bo_situacao: data.bo_situacao ?? true,
        description: data.description,
        academicYearId: data.academicYearId ?? null,
      } as any,
    });

    return ClassPrismaMapper.toEntity(classe);
  }

  async teacherExists(id: number): Promise<boolean> {
    const teacher = await prismaClient.teacher.findUnique({ where: { id } });
    return !!teacher;
  }

  async studentExists(id: number): Promise<boolean> {
    const student = await prismaClient.student.findUnique({ where: { id } });
    return !!student;
  }

  async isTeacherLinkedToClass(id_teacher: number, id_class: number): Promise<boolean> {
    const linked = await prismaClient.classTeacher.findFirst({
      where: { id_teacher, id_class },
    });

    return !!linked;
  }

  async findStudentClassLink(id_student: number): Promise<{ id_class: number } | null> {
    const linked = await prismaClient.classStudent.findFirst({
      where: { id_student },
      select: { id_class: true },
    });

    return linked;
  }

  async createTeacherLink(id_teacher: number, id_class: number): Promise<TeacherClassRelation> {
    const relation = await prismaClient.classTeacher.create({
      data: { id_teacher, id_class },
      include: {
        teacher: {
          include: {
            person: {
              select: { id: true, name: true, email: true, cpf: true },
            },
          },
        },
        class: {
          select: { id: true, uuid: true, name: true },
        },
      },
    });

    return {
      uuid: relation.uuid,
      id_teacher: relation.id_teacher,
      id_class: relation.id_class,
      teacher: {
        id: relation.teacher.id,
        uuid: relation.teacher.uuid,
        person: relation.teacher.person,
      },
      class: relation.class,
    };
  }

  async listTeachersByClass(id_class: number): Promise<TeacherClassRelation[]> {
    const relations = await prismaClient.classTeacher.findMany({
      where: { id_class },
      include: {
        teacher: {
          include: {
            person: {
              select: { id: true, name: true, email: true, cpf: true },
            },
          },
        },
        class: {
          select: { id: true, uuid: true, name: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    return relations.map((relation) => ({
      uuid: relation.uuid,
      id_teacher: relation.id_teacher,
      id_class: relation.id_class,
      teacher: {
        id: relation.teacher.id,
        uuid: relation.teacher.uuid,
        person: relation.teacher.person,
      },
      class: relation.class,
    }));
  }

  async createStudentLink(id_student: number, id_class: number): Promise<StudentClassRelation> {
    const relation = await prismaClient.classStudent.create({
      data: { id_student, id_class },
      include: {
        student: {
          include: {
            person: {
              select: { id: true, name: true, email: true, cpf: true },
            },
          },
        },
        class: {
          select: { id: true, uuid: true, name: true },
        },
      },
    });

    return {
      uuid: relation.uuid,
      id_student: relation.id_student,
      id_class: relation.id_class,
      student: {
        id: relation.student.id,
        uuid: relation.student.uuid,
        person: relation.student.person,
      },
      class: relation.class,
    };
  }

  async listStudentsByClass(id_class: number): Promise<StudentClassRelation[]> {
    const relations = await prismaClient.classStudent.findMany({
      where: { id_class },
      include: {
        student: {
          include: {
            person: {
              select: { id: true, name: true, email: true, cpf: true },
            },
          },
        },
        class: {
          select: { id: true, uuid: true, name: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    return relations.map((relation) => ({
      uuid: relation.uuid,
      id_student: relation.id_student,
      id_class: relation.id_class,
      student: {
        id: relation.student.id,
        uuid: relation.student.uuid,
        person: relation.student.person,
      },
      class: relation.class,
    }));
  }
}
