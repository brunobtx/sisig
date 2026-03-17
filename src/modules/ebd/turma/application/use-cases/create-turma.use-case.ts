import { AppError } from '../../../../../shared/errors/AppError';
import { TurmaEntity } from '../../domain/entities/turma.entity';
import { TurmaRepository } from '../../domain/repositories/turma.repository';
import { CreateTurmaInputDto } from '../dtos/create-turma-input.dto';

export class CreateTurmaUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute(data: CreateTurmaInputDto): Promise<TurmaEntity> {
    const { id_class, id_academic_year, isActive } = data;

    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    if (!id_academic_year) {
      throw new AppError('É obrigatório selecionar um ano letivo', 400);
    }

    const classExists = await this.repository.classExists(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const academicYearExists = await this.repository.academicYearExists(id_academic_year);
    if (!academicYearExists) {
      throw new AppError('Ano letivo não encontrado', 404);
    }

    const existingTurmas = await this.repository.findAll({
      id_class,
      id_academic_year,
    });
    if (existingTurmas.length > 0) {
      throw new AppError('Já existe turma para esta classe e ano letivo', 400);
    }

    const turma = new TurmaEntity({
      id_class,
      id_academic_year,
      bo_situacao: isActive,
    });

    return this.repository.create(turma);
  }
}
