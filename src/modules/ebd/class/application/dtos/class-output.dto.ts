import { ClassEntity } from '../../domain/entities/class.entity';

export type ClassOutputDto = {
  id: number | string;
  uuid: string;
  name: string;
  idade_in: number;
  idade_fn: number;
  isActive: boolean;
  academicYearId?: number | null;
  description?: string | null;
};

export class ClassOutputMapper {
  static toOutput(entity: ClassEntity): ClassOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      uuid: entity.uuid ?? entity.id,
      name: entity.name,
      idade_in: entity.idade_in,
      idade_fn: entity.idade_fn,
      isActive: entity.bo_situacao ?? true,
      academicYearId: entity.academicYearId ?? null,
      description: entity.description ?? null,
    };
  }
}
