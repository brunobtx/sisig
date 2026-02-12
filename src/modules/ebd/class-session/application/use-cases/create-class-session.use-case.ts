import { AppError } from '../../../../../shared/errors/AppError';
import { ClassSessionEntity } from '../../domain/entities/class-session.entity';
import { ClassSessionRepository } from '../../domain/repositories/class-session.repository';
import { CreateClassSessionInputDto } from '../dtos/create-class-session-input.dto';

export class CreateClassSessionUseCase {
  constructor(private readonly repository: ClassSessionRepository) {}

  async execute(data: CreateClassSessionInputDto): Promise<ClassSessionEntity> {
    const { id_class, dt_session, nr_lesson, topic, id_teacher, notes, id_person } = data;

    const classExists = await this.repository.classExists(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const teacherExists = await this.repository.teacherExists(id_teacher);
    if (!teacherExists) {
      throw new AppError('Professor não encontrado', 404);
    }

    const personExists = await this.repository.personExists(id_person);
    if (!personExists) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    const classSession = new ClassSessionEntity({
      id_class,
      dt_session: new Date(dt_session),
      nr_lesson,
      topic,
      id_teacher,
      notes,
      id_person,
    });

    return this.repository.create(classSession);
  }
}
