import { AppError } from '../../../../../shared/errors/AppError';
import { TeacherEntity } from '../../../teacher/domain/entities/teacher.entity';
import { TeacherRepository } from '../../../teacher/domain/repositories/teacher.repository';
import { TeacherTurmaRelation, TurmaRepository } from '../../domain/repositories/turma.repository';
import { AddTeacherToTurmaInputDto } from '../dtos/add-teacher-to-turma-input.dto';

export class AddTeacherToTurmaUseCase {
  constructor(
    private readonly turmaRepository: TurmaRepository,
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(
    { id_person, id_turma }: AddTeacherToTurmaInputDto,
    id_organization?: number | null,
  ): Promise<TeacherTurmaRelation> {
    if (!id_person) {
      throw new AppError('É obrigatório selecionar uma pessoa', 400);
    }

    if (!id_turma) {
      throw new AppError('É obrigatório selecionar uma turma', 400);
    }

    const turmaExists = await this.turmaRepository.findById(id_turma, id_organization);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    const personExists = await this.teacherRepository.personExists(id_person, id_organization);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    let teacher = await this.teacherRepository.findByIdPerson(id_person, id_organization);
    if (!teacher) {
      teacher = await this.teacherRepository.create(new TeacherEntity({ id_person }));
    }

    if (!teacher.databaseId) {
      throw new AppError('Professor inválido para vínculo com a turma', 400);
    }

    const alreadyLinked = await this.turmaRepository.isTeacherLinkedToTurma(teacher.databaseId, id_turma);
    if (alreadyLinked) {
      throw new AppError('Esse professor já está vinculado a essa turma', 400);
    }

    return this.turmaRepository.createTeacherLink(teacher.databaseId, id_turma);
  }
}
