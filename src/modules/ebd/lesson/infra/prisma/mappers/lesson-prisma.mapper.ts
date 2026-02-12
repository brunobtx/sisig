import { LessonEntity } from '../../../domain/entities/lesson.entity';

export class LessonPrismaMapper {
  static toEntity(data: any): LessonEntity {
    return new LessonEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        id_class: data.id_class,
        dt_lesson: data.dt_lesson,
        nr_lesson: data.nr_lesson,
        title: data.title,
        description: data.description,
        id_period: data.id_period,
        id_person_create: data.id_person_create,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      data.uuid,
    );
  }
}
