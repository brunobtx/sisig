import { ClassSessionEntity } from '../../domain/entities/class-session.entity';

export type ClassSessionOutputDto = {
  id_class: number;
  dt_session: Date;
  nr_lesson: number;
};

export class ClassSessionOutputMapper {
  static toOutput(entity: ClassSessionEntity): ClassSessionOutputDto {
    return {
      id_class: entity.id_class,
      dt_session: entity.dt_session,
      nr_lesson: entity.nr_lesson,
    };
  }
}
