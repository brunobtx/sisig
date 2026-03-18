import { TurmaEntity } from '../../../domain/entities/turma.entity';

export class TurmaPrismaMapper {
  static toEntity(data: any): TurmaEntity {
    return new TurmaEntity(
      {
        databaseId: data.id,
        uuid: data.uuid,
        id_class: data.id_class,
        id_academic_year: data.id_academic_year,
        id_organization: data.id_organization,
        bo_situacao: data.bo_situacao,
        created_at: data.created_at,
      },
      data.uuid,
    );
  }
}
