import prismaClient from '../../../../../prisma';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { LessonRepository } from '../../domain/repositories/lesson.repository';
import { LessonPrismaMapper } from '../prisma/mappers/lesson-prisma.mapper';

export class PrismaLessonRepository implements LessonRepository {
  async turmaExists(id_turma: number, id_organization?: number | null): Promise<boolean> {
    const turma = await prismaClient.turma.findFirst({
      where: {
        id: id_turma,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return !!turma;
  }

  async periodExists(id_period: number, id_organization?: number | null): Promise<boolean> {
    const period = await prismaClient.academicPeriod.findFirst({
      where: {
        id: id_period,
        ...(typeof id_organization === 'number'
          ? {
              academicYear: {
                id_organization,
              },
            }
          : {}),
      },
    });
    return !!period;
  }

  async personExists(id_person: number, id_organization?: number | null): Promise<boolean> {
    const person = await prismaClient.person.findFirst({
      where: {
        id: id_person,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return !!person;
  }

  async create(data: LessonEntity): Promise<LessonEntity> {
    const lesson = await prismaClient.lesson.create({
      data: {
        id_turma: data.id_turma,
        dt_lesson: data.dt_lesson,
        nr_lesson: data.nr_lesson,
        title: data.title,
        description: data.description,
        id_period: data.id_period,
        id_person_create: data.id_person_create,
      },
    });

    return LessonPrismaMapper.toEntity(lesson);
  }
}
