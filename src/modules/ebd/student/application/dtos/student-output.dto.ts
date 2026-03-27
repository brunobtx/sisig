import { StudentEntity } from '../../domain/entities/student.entity';

export type StudentOutputDto = {
  id: number | string;
  uuid: string;
  id_person: number;
  bo_situacao?: boolean;
  person?: {
    id: number;
    name: string;
  };
};

export class StudentOutputMapper {
  static toOutput(entity: StudentEntity): StudentOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      id_person: entity.id_person,
      bo_situacao: entity.bo_situacao ?? true,
    };
  }
}
