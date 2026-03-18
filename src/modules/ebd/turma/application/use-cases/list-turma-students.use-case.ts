import { AppError } from '../../../../../shared/errors/AppError';
import { StudentTurmaRelation, TurmaRepository } from '../../domain/repositories/turma.repository';

export class ListTurmaStudentsUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute(id_turma: number, id_organization?: number | null): Promise<StudentTurmaRelation[]> {
    if (!id_turma) {
      throw new AppError('É obrigatório selecionar uma turma', 400);
    }

    const turmaExists = await this.repository.findById(id_turma, id_organization);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    return this.repository.listStudentsByTurma(id_turma);
  }
}
