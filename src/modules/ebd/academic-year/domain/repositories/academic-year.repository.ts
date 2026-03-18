import { AcademicPeriodEntity } from '../entities/academic-period.entity';
import { AcademicYearEntity } from '../entities/academic-year.entity';

export interface AcademicYearRepository {
  createAcademicYear(data: AcademicYearEntity): Promise<AcademicYearEntity>;
  findAll(id_organization?: number | null): Promise<AcademicYearEntity[]>;
  academicYearExists(id: number, id_organization?: number | null): Promise<boolean>;
  findOverlappingPeriod(
    id_academy_year: number,
    dt_start: Date,
    dt_end: Date,
    id_organization?: number | null,
  ): Promise<boolean>;
  createAcademicPeriod(data: AcademicPeriodEntity): Promise<AcademicPeriodEntity>;
}
