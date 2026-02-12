import { ClassEntity } from '../../domain/entities/class.entity';

export type ClassOutputDto = {
  uuid: string;
  name: string;
};

export class ClassOutputMapper {
  static toOutput(entity: ClassEntity): ClassOutputDto {
    return {
      uuid: entity.uuid ?? entity.id,
      name: entity.name,
    };
  }
}
