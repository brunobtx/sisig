import { AcademicPeriodEntity } from '../../domain/entities/academic-period.entity';
import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';

export type AcademicYearOutputDto = {
  year: number;
  id_person_create: number;
  createdAt: Date;
};

export type AcademicPeriodOutputDto = {
  id_academy_year: number;
  name: string;
  dt_start: Date;
  dt_end: Date;
};

export class AcademicYearOutputMapper {
  static toAcademicYearOutput(entity: AcademicYearEntity): AcademicYearOutputDto {
    return {
      year: entity.year,
      id_person_create: entity.id_person_create,
      createdAt: entity.createdAt as Date,
    };
  }

  static toAcademicPeriodOutput(entity: AcademicPeriodEntity): AcademicPeriodOutputDto {
    return {
      id_academy_year: entity.id_academy_year,
      name: entity.name,
      dt_start: entity.dt_start,
      dt_end: entity.dt_end,
    };
  }
}
