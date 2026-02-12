import { StudentEntity } from '../../../domain/entities/student.entity';

export class StudentPrismaMapper {
  static toEntity(student: any): StudentEntity {
    return new StudentEntity(
      {
        databaseId: student.id,
        uuid: student.uuid,
        id_person: student.id_person,
        bo_situacao: student.bo_situacao,
        created_at: student.created_at,
      },
      student.uuid,
    );
  }
}
