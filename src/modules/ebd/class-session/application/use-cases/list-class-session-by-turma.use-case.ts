import { AppError } from '../../../../../shared/errors/AppError';
import { ClassSessionRepository, ClassSessionWithTeacher } from '../../domain/repositories/class-session.repository';

export class ListClassSessionByTurmaUseCase {
  constructor(private readonly repository: ClassSessionRepository) {}

  async execute(id_turma: number): Promise<ClassSessionWithTeacher[]> {
    if (!id_turma) {
      throw new AppError('É obrigatório informar a turma', 400);
    }

    const turmaExists = await this.repository.turmaExists(id_turma);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    return this.repository.listByTurma(id_turma);
  }
}
