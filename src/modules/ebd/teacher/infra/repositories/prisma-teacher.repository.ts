import prismaClient from '../../../../../prisma';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { TeacherRepository } from '../../domain/repositories/teacher.repository';
import { TeacherPrismaMapper } from '../prisma/mappers/teacher-prisma.mapper';

export class PrismaTeacherRepository implements TeacherRepository {
  async personExists(id_person: number): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { id: id_person } });
    return !!person;
  }

  async findByIdPerson(id_person: number): Promise<TeacherEntity | null> {
    const teacher = await prismaClient.teacher.findFirst({ where: { id_person } });
    return teacher ? TeacherPrismaMapper.toEntity(teacher) : null;
  }

  async findAllWithPerson() {
    return prismaClient.teacher.findMany({
      include: {
        person: {
          select: { id: true, name: true, email: true, cpf: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(teacher: TeacherEntity): Promise<TeacherEntity> {
    const newTeacher = await prismaClient.teacher.create({
      data: {
        id_person: teacher.id_person,
      },
    });

    return TeacherPrismaMapper.toEntity(newTeacher);
  }
}
