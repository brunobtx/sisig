import { AppError } from '../../../../../shared/errors/AppError';
import { TeacherTurmaRelation, TurmaRepository } from '../../domain/repositories/turma.repository';
import { AddTeacherToTurmaInputDto } from '../dtos/add-teacher-to-turma-input.dto';

export class AddTeacherToTurmaUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute({ id_teacher, id_turma }: AddTeacherToTurmaInputDto): Promise<TeacherTurmaRelation> {
    if (!id_teacher) {
      throw new AppError('É obrigatório selecionar um professor', 400);
    }

    if (!id_turma) {
      throw new AppError('É obrigatório selecionar uma turma', 400);
    }

    const turmaExists = await this.repository.findById(id_turma);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    const teacherExists = await this.repository.teacherExists(id_teacher);
    if (!teacherExists) {
      throw new AppError('Professor não encontrado', 404);
    }

    const alreadyLinked = await this.repository.isTeacherLinkedToTurma(id_teacher, id_turma);
    if (alreadyLinked) {
      throw new AppError('Esse professor já está vinculado a essa turma', 400);
    }

    return this.repository.createTeacherLink(id_teacher, id_turma);
  }
}
