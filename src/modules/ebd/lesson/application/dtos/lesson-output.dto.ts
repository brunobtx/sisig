import { LessonEntity } from '../../domain/entities/lesson.entity';

export type LessonOutputDto = {
  id_turma: number;
  dt_lesson: Date;
  nr_lesson: number;
};

export class LessonOutputMapper {
  static toOutput(entity: LessonEntity): LessonOutputDto {
    return {
      id_turma: entity.id_turma,
      dt_lesson: entity.dt_lesson,
      nr_lesson: entity.nr_lesson,
    };
  }
}
