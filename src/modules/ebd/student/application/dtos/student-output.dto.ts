import { StudentEntity } from '../../domain/entities/student.entity';

export type StudentOutputDto = {
  id: number | string;
  id_person: number;
};

export class StudentOutputMapper {
  static toOutput(entity: StudentEntity): StudentOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      id_person: entity.id_person,
    };
  }
}
