import { AcademicPeriodEntity } from '../entities/academic-period.entity';
import { AcademicYearEntity } from '../entities/academic-year.entity';

export interface AcademicYearRepository {
  createAcademicYear(data: AcademicYearEntity): Promise<AcademicYearEntity>;
  findAll(): Promise<AcademicYearEntity[]>;
  academicYearExists(id: number): Promise<boolean>;
  findOverlappingPeriod(id_academy_year: number, dt_start: Date, dt_end: Date): Promise<boolean>;
  createAcademicPeriod(data: AcademicPeriodEntity): Promise<AcademicPeriodEntity>;
}
