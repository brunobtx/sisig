import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';
import { CreateAcademicYearInputDto } from '../dtos/create-academic-year-input.dto';

export class CreateAcademicYearUseCase {
  constructor(private readonly repository: AcademicYearRepository) {}

  async execute(data: CreateAcademicYearInputDto): Promise<AcademicYearEntity> {
    const academicYear = new AcademicYearEntity({
      year: data.year,
      id_person_create: data.id_person_create,
    });

    return this.repository.createAcademicYear(academicYear);
  }
}
