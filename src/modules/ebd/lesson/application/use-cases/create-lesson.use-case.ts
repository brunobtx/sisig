import { AppError } from '../../../../../shared/errors/AppError';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { LessonRepository } from '../../domain/repositories/lesson.repository';
import { CreateLessonInputDto } from '../dtos/create-lesson-input.dto';

export class CreateLessonUseCase {
  constructor(private readonly repository: LessonRepository) {}

  async execute(data: CreateLessonInputDto): Promise<LessonEntity> {
    const { id_class, dt_lesson, nr_lesson, title, description, id_period, id_person_create } = data;

    const classExists = await this.repository.classExists(id_class);
    if (!classExists) {
      throw new AppError('Classe não encontrada', 404);
    }

    const periodExists = await this.repository.periodExists(id_period);
    if (!periodExists) {
      throw new AppError('Período não encontrado', 404);
    }

    const personExists = await this.repository.personExists(id_person_create);
    if (!personExists) {
      throw new AppError('Pessoa criadora não encontrada', 404);
    }

    const lesson = new LessonEntity({
      id_class,
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
