import { TurmaEntity } from '../../domain/entities/turma.entity';

export type TurmaOutputDto = {
  id: number | string;
  uuid: string;
  id_class: number;
  id_academic_year: number;
  isActive: boolean;
};

export class TurmaOutputMapper {
  static toOutput(entity: TurmaEntity): TurmaOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      id_class: entity.id_class,
      id_academic_year: entity.id_academic_year,
      isActive: entity.bo_situacao ?? true,
    };
  }
}
