import { AppError } from '../../../../../shared/errors/AppError';
import { ClassSessionEntity } from '../../domain/entities/class-session.entity';
import { ClassSessionRepository } from '../../domain/repositories/class-session.repository';
import { CreateClassSessionInputDto } from '../dtos/create-class-session-input.dto';

export class CreateClassSessionUseCase {
  constructor(private readonly repository: ClassSessionRepository) {}

  async execute(data: CreateClassSessionInputDto): Promise<ClassSessionEntity> {
    const { id_turma, dt_session, nr_lesson, trimester, topic, id_teacher, notes, id_person } = data;

    const turmaExists = await this.repository.turmaExists(id_turma);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    const teacherExists = await this.repository.teacherExists(id_teacher);
    if (!teacherExists) {
      throw new AppError('Professor não encontrado', 404);
    }

    const teacherLinkedToTurma = await this.repository.isTeacherLinkedToTurma(id_teacher, id_turma);
    if (!teacherLinkedToTurma) {
      throw new AppError('O professor informado não está vinculado a essa turma', 400);
    }

    const personExists = await this.repository.personExists(id_person);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    if (![1, 2, 3, 4].includes(trimester)) {
      throw new AppError('O trimestre deve estar entre 1 e 4', 400);
    }

    const lessonNumberExists = await this.repository.lessonNumberExists(id_turma, nr_lesson);
    if (lessonNumberExists) {
      throw new AppError('Já existe uma aula cadastrada com esse número para a turma', 400);
    }

    const classSession = new ClassSessionEntity({
      id_turma,
      dt_session: new Date(dt_session),
      nr_lesson,
      trimester,
      topic,
      id_teacher,
      notes,
      id_person,
    });

    return this.repository.create(classSession);
  }
}
