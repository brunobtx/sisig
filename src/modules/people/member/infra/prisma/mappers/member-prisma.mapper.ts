import { MemberEntity } from '../../../domain/entities/member.entity';

export class MemberPrismaMapper {
  static toEntity(person: any): MemberEntity {
    return new MemberEntity(
      {
        databaseId: person.id,
        uuid: person.uuid,
        name: person.name,
        cpf: person.cpf,
        email: person.email,
        phone: person.phone,
        dt_nasc: person.dt_nasc,
        sexo: person.sexo,
        id_organization: person.id_organization,
        situacao: person.situacao,
        createdAt: person.created_at,
      },
      person.uuid,
    );
  }
}
