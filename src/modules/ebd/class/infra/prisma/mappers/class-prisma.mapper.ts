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
        id_organization: data.id_organization,
        bo_situacao: data.bo_situacao,
        description: data.description,
        created_at: data.created_at,
      },
      data.uuid,
    );
  }
}
