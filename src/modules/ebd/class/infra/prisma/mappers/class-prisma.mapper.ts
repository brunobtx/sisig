import { ClassEntity } from '../../../domain/entities/class.entity';

export class ClassPrismaMapper {
  static toEntity(data: any): ClassEntity {
    return new ClassEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        name: data.name,
        idade_in: data.idade_in,
        idade_fn: data.idade_fn,
        bo_situacao: data.bo_situacao,
        created_at: data.created_at,
      },
      data.uuid,
    );
  }
}
