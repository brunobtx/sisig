import { TurmaOutputDto, TurmaOutputMapper } from '../dtos/turma-output.dto';
import { TurmaFilters, TurmaRepository } from '../../domain/repositories/turma.repository';

export class ListTurmaUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute(filters?: TurmaFilters): Promise<TurmaOutputDto[]> {
    const turmas = await this.repository.findAll(filters);
    return turmas.map((turma) => TurmaOutputMapper.toOutput(turma));
  }
}
