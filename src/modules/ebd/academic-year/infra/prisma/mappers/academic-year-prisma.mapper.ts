import { AcademicPeriodEntity } from '../../../domain/entities/academic-period.entity';
import { AcademicYearEntity } from '../../../domain/entities/academic-year.entity';

export class AcademicYearPrismaMapper {
  static toAcademicYearEntity(data: any): AcademicYearEntity {
    return new AcademicYearEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        year: data.year,
        id_person_create: data.id_person_create,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.uuid,
    );
  }

  static toAcademicPeriodEntity(data: any): AcademicPeriodEntity {
    return new AcademicPeriodEntity(
      {
        databaseId: data.id,
        id_academy_year: data.id_academy_year,
        name: data.name,
        dt_start: data.dt_start,
        dt_end: data.dt_end,
        id_person_create: data.id_person_create,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      String(data.id),
    );
  }
}
