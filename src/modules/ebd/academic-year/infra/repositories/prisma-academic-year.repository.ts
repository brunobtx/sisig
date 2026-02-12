import prismaClient from '../../../../../prisma';
import { AcademicPeriodEntity } from '../../domain/entities/academic-period.entity';
import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';
import { AcademicYearPrismaMapper } from '../prisma/mappers/academic-year-prisma.mapper';

export class PrismaAcademicYearRepository implements AcademicYearRepository {
  async createAcademicYear(data: AcademicYearEntity): Promise<AcademicYearEntity> {
    const academicYear = await prismaClient.academicYear.create({
      data: {
        year: data.year,
        id_person_create: data.id_person_create,
      },
    });

    return AcademicYearPrismaMapper.toAcademicYearEntity(academicYear);
  }

  async academicYearExists(id: number): Promise<boolean> {
    const year = await prismaClient.academicYear.findUnique({ where: { id } });
    return !!year;
  }

  async findOverlappingPeriod(id_academy_year: number, dt_start: Date, dt_end: Date): Promise<boolean> {
    const existingPeriod = await prismaClient.academicPeriod.findFirst({
      where: {
        id_academy_year,
        dt_start: { lte: dt_start },
        dt_end: { gte: dt_end },
      },
    });

    return !!existingPeriod;
  }

  async createAcademicPeriod(data: AcademicPeriodEntity): Promise<AcademicPeriodEntity> {
    const academicPeriod = await prismaClient.academicPeriod.create({
      data: {
        id_academy_year: data.id_academy_year,
        name: data.name,
        dt_start: data.dt_start,
        dt_end: data.dt_end,
        id_person_create: data.id_person_create,
      },
    });

    return AcademicYearPrismaMapper.toAcademicPeriodEntity(academicPeriod);
  }
}
