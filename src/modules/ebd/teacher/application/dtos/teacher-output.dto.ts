import { TeacherEntity } from '../../domain/entities/teacher.entity';

export type TeacherOutputDto = {
  id: number | string;
  uuid: string;
  id_person: number;
  bo_situacao?: boolean;
  person?: {
    id: number;
    name: string;
    email: string;
    cpf: string;
  };
};

export class TeacherOutputMapper {
  static toOutput(entity: TeacherEntity): TeacherOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      id_person: entity.id_person,
      bo_situacao: entity.bo_situacao ?? true,
    };
  }
}
