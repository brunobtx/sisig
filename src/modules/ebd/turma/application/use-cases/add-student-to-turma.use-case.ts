import { AppError } from '../../../../../shared/errors/AppError';
import { StudentEntity } from '../../../student/domain/entities/student.entity';
import { StudentRepository } from '../../../student/domain/repositories/student.repository';
import { StudentTurmaRelation, TurmaRepository } from '../../domain/repositories/turma.repository';
import { AddStudentToTurmaInputDto } from '../dtos/add-student-to-turma-input.dto';

export class AddStudentToTurmaUseCase {
  constructor(
    private readonly turmaRepository: TurmaRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  async execute({ id_person, id_turma }: AddStudentToTurmaInputDto): Promise<StudentTurmaRelation> {
    if (!id_person) {
      throw new AppError('É obrigatório selecionar uma pessoa', 400);
    }

    if (!id_turma) {
      throw new AppError('É obrigatório selecionar uma turma', 400);
    }

    const turma = await this.turmaRepository.findById(id_turma);
    if (!turma) {
      throw new AppError('Turma não encontrada', 404);
    }

    const personExists = await this.studentRepository.personExists(id_person);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    let student = await this.studentRepository.findByIdPerson(id_person);
    if (!student) {
      student = await this.studentRepository.create(new StudentEntity({ id_person }));
    }

    if (!student.databaseId) {
      throw new AppError('Aluno inválido para matrícula na turma', 400);
    }

    const studentLink = await this.turmaRepository.findStudentTurmaLinkByYear(
      student.databaseId,
      turma.id_academic_year,
    );
    if (studentLink && studentLink.id_turma === id_turma) {
      throw new AppError('Esse aluno já está vinculado a essa turma', 400);
    }

    if (studentLink) {
      throw new AppError('Esse aluno já está vinculado a uma turma nesse ano letivo', 400);
    }

    return this.turmaRepository.createStudentLink(student.databaseId, id_turma);
  }
}
