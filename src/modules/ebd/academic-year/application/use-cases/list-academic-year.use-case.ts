import { AcademicYearOutputDto, AcademicYearOutputMapper } from '../dtos/academic-year-output.dto';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';

export class ListAcademicYearUseCase {
  constructor(private readonly repository: AcademicYearRepository) {}

  async execute(id_organization?: number | null): Promise<AcademicYearOutputDto[]> {
    const years = await this.repository.findAll(id_organization);
    return years.map((year) => AcademicYearOutputMapper.toAcademicYearOutput(year));
  }
}
