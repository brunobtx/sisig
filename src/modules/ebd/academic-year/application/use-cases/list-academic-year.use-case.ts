import { AcademicYearOutputDto, AcademicYearOutputMapper } from '../dtos/academic-year-output.dto';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';

export class ListAcademicYearUseCase {
  constructor(private readonly repository: AcademicYearRepository) {}

  async execute(): Promise<AcademicYearOutputDto[]> {
    const years = await this.repository.findAll();
    return years.map((year) => AcademicYearOutputMapper.toAcademicYearOutput(year));
  }
}
