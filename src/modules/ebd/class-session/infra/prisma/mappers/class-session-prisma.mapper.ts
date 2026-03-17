import { ClassSessionEntity } from '../../../domain/entities/class-session.entity';

export class ClassSessionPrismaMapper {
  static toEntity(data: any): ClassSessionEntity {
    return new ClassSessionEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        id_turma: data.id_turma,
        dt_session: data.dt_session,
        nr_lesson: data.nr_lesson,
        trimester: data.trimester,
        topic: data.topic,
        id_teacher: data.id_teacher,
        notes: data.notes,
        id_person: data.id_person,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.uuid,
    );
  }
}
