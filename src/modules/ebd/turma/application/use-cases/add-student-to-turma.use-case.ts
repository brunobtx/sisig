import { AppError } from '../../../../../shared/errors/AppError';
import { StudentTurmaRelation, TurmaRepository } from '../../domain/repositories/turma.repository';
import { AddStudentToTurmaInputDto } from '../dtos/add-student-to-turma-input.dto';

export class AddStudentToTurmaUseCase {
  constructor(private readonly repository: TurmaRepository) {}

  async execute({ id_student, id_turma }: AddStudentToTurmaInputDto): Promise<StudentTurmaRelation> {
    if (!id_student) {
      throw new AppError('É obrigatório selecionar um aluno', 400);
    }

    if (!id_turma) {
      throw new AppError('É obrigatório selecionar uma turma', 400);
    }

    const turma = await this.repository.findById(id_turma);
    if (!turma) {
      throw new AppError('Turma não encontrada', 404);
    }

    const studentExists = await this.repository.studentExists(id_student);
    if (!studentExists) {
      throw new AppError('Aluno não encontrado', 404);
    }

    const studentLink = await this.repository.findStudentTurmaLinkByYear(
      id_student,
      turma.id_academic_year,
    );
    if (studentLink && studentLink.id_turma === id_turma) {
      throw new AppError('Esse aluno já está vinculado a essa turma', 400);
    }

    if (studentLink) {
      throw new AppError('Esse aluno já está vinculado a uma turma nesse ano letivo', 400);
    }

    return this.repository.createStudentLink(id_student, id_turma);
  }
}
