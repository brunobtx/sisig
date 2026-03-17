import { ClassSessionEntity } from '../../domain/entities/class-session.entity';

export type ClassSessionOutputDto = {
  id_turma: number;
  dt_session: Date;
  nr_lesson: number;
};

export class ClassSessionOutputMapper {
  static toOutput(entity: ClassSessionEntity): ClassSessionOutputDto {
    return {
      id_turma: entity.id_turma,
      dt_session: entity.dt_session,
      nr_lesson: entity.nr_lesson,
    };
  }
}
