import prismaClient from '../../../../../prisma';
import { StudentEntity } from '../../domain/entities/student.entity';
import { StudentRepository } from '../../domain/repositories/student.repository';
import { StudentPrismaMapper } from '../prisma/mappers/student-prisma.mapper';

export class PrismaStudentRepository implements StudentRepository {
  async personExists(id_person: number, id_organization?: number | null): Promise<boolean> {
    const person = await prismaClient.person.findFirst({
      where: {
        id: id_person,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return !!person;
  }

  async findByIdPerson(id_person: number, id_organization?: number | null): Promise<StudentEntity | null> {
    const student = await prismaClient.student.findFirst({
      where: {
        id_person,
        ...(typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : {}),
      },
    });
    return student ? StudentPrismaMapper.toEntity(student) : null;
  }

  async findAllWithPerson(id_organization?: number | null) {
    return prismaClient.student.findMany({
      where:
        typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : undefined,
      include: {
        person: {
          select: { id: true, name: true, email: true, cpf: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(student: StudentEntity): Promise<StudentEntity> {
    const newStudent = await prismaClient.student.create({
      data: {
        id_person: student.id_person,
      },
    });

    return StudentPrismaMapper.toEntity(newStudent);
  }
}
