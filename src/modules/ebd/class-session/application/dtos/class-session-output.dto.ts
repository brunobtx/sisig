import { ClassSessionEntity } from '../../domain/entities/class-session.entity';

export type ClassSessionOutputDto = {
  id: number | string;
  uuid: string;
  id_turma: number;
  dt_session: Date;
  nr_lesson: number;
  trimester: number;
  topic: string;
  id_teacher: number;
  notes?: string;
  id_person: number;
};

export class ClassSessionOutputMapper {
  static toOutput(entity: ClassSessionEntity): ClassSessionOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      id_turma: entity.id_turma,
      dt_session: entity.dt_session,
      nr_lesson: entity.nr_lesson,
      trimester: entity.trimester,
      topic: entity.topic,
      id_teacher: entity.id_teacher,
      notes: entity.notes,
      id_person: entity.id_person,
    };
  }
}
