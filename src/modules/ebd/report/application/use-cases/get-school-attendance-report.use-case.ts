import { AppError } from '../../../../../shared/errors/AppError';
import {
  SchoolAttendanceReport,
  SchoolAttendanceReportFilters,
  SchoolReportRepository,
} from '../../domain/repositories/school-report.repository';

export class GetSchoolAttendanceReportUseCase {
  constructor(private readonly repository: SchoolReportRepository) {}

  async execute(
    filters: SchoolAttendanceReportFilters,
    id_organization?: number | null,
  ): Promise<SchoolAttendanceReport> {
    if (!filters?.id_academic_year) {
      throw new AppError('É obrigatório informar o ano letivo do relatório', 400);
    }

    if (filters.trimester && ![1, 2, 3, 4].includes(filters.trimester)) {
      throw new AppError('O trimestre deve estar entre 1 e 4', 400);
    }

    const academicYearExists = await this.repository.academicYearExists(
      filters.id_academic_year,
      id_organization,
    );
    if (!academicYearExists) {
      throw new AppError('Ano letivo não encontrado', 404);
    }

    if (filters.id_turma) {
      const turmaExists = await this.repository.turmaExists(filters.id_turma, id_organization);
      if (!turmaExists) {
        throw new AppError('Turma não encontrada', 404);
      }
    }

    return this.repository.getAttendanceReport(filters, id_organization);
  }
}
