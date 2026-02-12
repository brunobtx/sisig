import prismaClient from '../../../../../prisma';
import { ClassSessionEntity } from '../../domain/entities/class-session.entity';
import { ClassSessionRepository } from '../../domain/repositories/class-session.repository';
import { ClassSessionPrismaMapper } from '../prisma/mappers/class-session-prisma.mapper';

export class PrismaClassSessionRepository implements ClassSessionRepository {
  async classExists(id_class: number): Promise<boolean> {
    const classe = await prismaClient.class.findUnique({ where: { id: id_class } });
    return !!classe;
  }

  async teacherExists(id_teacher: number): Promise<boolean> {
    const teacher = await prismaClient.teacher.findUnique({ where: { id: id_teacher } });
    return !!teacher;
  }

  async personExists(id_person: number): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { id: id_person } });
    return !!person;
  }

  async create(data: ClassSessionEntity): Promise<ClassSessionEntity> {
    const classSession = await prismaClient.classSession.create({
      data: {
        id_class: data.id_class,
        dt_session: data.dt_session,
        nr_lesson: data.nr_lesson,
        topic: data.topic,
        id_teacher: data.id_teacher,
        notes: data.notes,
        id_person: data.id_person,
      },
    });

    return ClassSessionPrismaMapper.toEntity(classSession);
  }
}
