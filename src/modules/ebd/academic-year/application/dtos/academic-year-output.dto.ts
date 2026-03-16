import { AcademicPeriodEntity } from '../../domain/entities/academic-period.entity';
import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';

export type AcademicYearOutputDto = {
  id: number | string;
  uuid: string;
  year: number;
  id_person_create: number;
  createdAt: Date;
  updatedAt?: Date | null;
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
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      year: entity.year,
      id_person_create: entity.id_person_create,
      createdAt: entity.createdAt as Date,
      updatedAt: entity.updatedAt ?? null,
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
