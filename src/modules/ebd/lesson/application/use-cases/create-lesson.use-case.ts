import { AppError } from '../../../../../shared/errors/AppError';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { LessonRepository } from '../../domain/repositories/lesson.repository';
import { CreateLessonInputDto } from '../dtos/create-lesson-input.dto';

export class CreateLessonUseCase {
  constructor(private readonly repository: LessonRepository) {}

  async execute(data: CreateLessonInputDto, id_organization?: number | null): Promise<LessonEntity> {
    const { id_turma, dt_lesson, nr_lesson, title, description, id_period, id_person_create } =
      data;

    const turmaExists = await this.repository.turmaExists(id_turma, id_organization);
    if (!turmaExists) {
      throw new AppError('Turma não encontrada', 404);
    }

    const periodExists = await this.repository.periodExists(id_period, id_organization);
    if (!periodExists) {
      throw new AppError('Período não encontrado', 404);
    }

    const personExists = await this.repository.personExists(id_person_create, id_organization);
    if (!personExists) {
      throw new AppError('Pessoa criadora não encontrada', 404);
    }

    const lesson = new LessonEntity({
      id_turma,
      dt_lesson: new Date(dt_lesson),
      nr_lesson,
      title,
      description,
      id_period,
      id_person_create,
    });

    return this.repository.create(lesson);
  }
}
