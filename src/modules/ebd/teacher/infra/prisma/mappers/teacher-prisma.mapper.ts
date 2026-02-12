import { TeacherEntity } from '../../../domain/entities/teacher.entity';

export class TeacherPrismaMapper {
  static toEntity(teacher: any): TeacherEntity {
    return new TeacherEntity(
      {
        databaseId: teacher.id,
        uuid: teacher.uuid,
        id_person: teacher.id_person,
        bo_situacao: teacher.bo_situacao,
        created_at: teacher.created_at,
      },
      teacher.uuid,
    );
  }
}
