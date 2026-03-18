import { AppError } from '../../../../../shared/errors/AppError';
import { TurmaEntity } from '../../domain/entities/turma.entity';
import { TurmaRepository } from '../../domain/repositories/turma.repository';
import { CreateTurmaInputDto } from '../dtos/create-turma-input.dto';

export class CreateTurmaUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute(data: CreateTurmaInputDto, id_organization?: number | null): Promise<TurmaEntity> {
    const { id_class, id_academic_year, isActive } = data;

    if (!id_class) {
      throw new AppError('É obrigatório selecionar uma classe', 400);
    }

    if (!id_academic_year) {
      throw new AppError('É obrigatório selecionar um ano letivo', 400);
    }

    const classExists = await this.repository.classExists(id_class, id_organization);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const academicYearExists = await this.repository.academicYearExists(id_academic_year, id_organization);
    if (!academicYearExists) {
      throw new AppError('Ano letivo não encontrado', 404);
    }

    const existingTurmas = await this.repository.findAll(
      {
        id_class,
        id_academic_year,
      },
      id_organization,
    );
    if (existingTurmas.length > 0) {
      throw new AppError('Já existe turma para esta classe e ano letivo', 400);
    }

    const turma = new TurmaEntity({
      id_class,
      id_academic_year,
      id_organization: typeof id_organization === 'number' ? id_organization : undefined,
      bo_situacao: isActive,
    });

    return this.repository.create(turma);
  }
}
