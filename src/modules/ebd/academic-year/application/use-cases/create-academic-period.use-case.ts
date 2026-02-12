import { AppError } from '../../../../../shared/errors/AppError';
import { AcademicPeriodEntity } from '../../domain/entities/academic-period.entity';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';
import { CreateAcademicPeriodInputDto } from '../dtos/create-academic-period-input.dto';

export class CreateAcademicPeriodUseCase {
  constructor(private readonly repository: AcademicYearRepository) {}

  async execute(data: CreateAcademicPeriodInputDto): Promise<AcademicPeriodEntity> {
    const { id_academy_year, name, dt_start, dt_end, id_person_create } = data;

    const start = new Date(dt_start);
    const end = new Date(dt_end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError('Datas inválidas para o período acadêmico', 400);
    }

    if (start.getTime() === end.getTime()) {
      throw new AppError('Data de início do Período não pode ser a mesma do final', 400);
    }

    if (start.getTime() > end.getTime()) {
      throw new AppError('Data de início do Período não pode ser maior que a final', 400);
    }

    const yearExists = await this.repository.academicYearExists(id_academy_year);
    if (!yearExists) {
      throw new AppError('Ano letivo não encontrado', 404);
    }

    const existingPeriod = await this.repository.findOverlappingPeriod(id_academy_year, start, end);
    if (existingPeriod) {
      throw new AppError('Já existe um período acadêmico cadastrado que engloba essas datas.', 400);
    }

    const period = new AcademicPeriodEntity({
      id_academy_year,
      name,
      dt_start: start,
      dt_end: end,
      id_person_create,
    });

    return this.repository.createAcademicPeriod(period);
  }
}
