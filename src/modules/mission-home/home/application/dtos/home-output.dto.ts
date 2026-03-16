import { HomeEntity } from '../../domain/entities/home';

export type HomeOutputDto = {
  id: number | string;
  name: string;
};

export class HomeOutputMapper {
  static toOutput(entity: HomeEntity): HomeOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      name: entity.name,
    };
  }
}
