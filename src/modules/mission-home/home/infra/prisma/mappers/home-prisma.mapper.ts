import { HomeEntity } from '../../../domain/entities/home.entity';

export class HomePrismaMapper {
  static toEntity(data: any): HomeEntity {
    return new HomeEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        name: data.name,
        createdAt: data.createdAt ?? data.created_at,
      },
      data.uuid,
    );
  }
}
