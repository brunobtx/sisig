import prismaClient from '../../../../../prisma';
import { StudentEntity } from '../../domain/entities/student.entity';
import { StudentRepository } from '../../domain/repositories/student.repository';
import { StudentPrismaMapper } from '../prisma/mappers/student-prisma.mapper';

export class PrismaStudentRepository implements StudentRepository {
  async personExists(id_person: number): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { id: id_person } });
    return !!person;
  }

  async findByIdPerson(id_person: number): Promise<StudentEntity | null> {
    const student = await prismaClient.student.findFirst({ where: { id_person } });
    return student ? StudentPrismaMapper.toEntity(student) : null;
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
