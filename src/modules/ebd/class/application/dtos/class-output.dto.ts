import { ClassEntity } from '../../domain/entities/class.entity';

export type ClassOutputDto = {
  uuid: string;
  name: string;
  isActive: boolean;
  description?: string | null;
};

export class ClassOutputMapper {
  static toOutput(entity: ClassEntity): ClassOutputDto {
    return {
      uuid: entity.uuid ?? entity.id,
      name: entity.name,
      isActive: entity.bo_situacao ?? true,
      description: entity.description ?? null,
    };
  }
}
