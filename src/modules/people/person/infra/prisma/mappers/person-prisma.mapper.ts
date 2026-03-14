import { PersonEntity } from '../../../domain/entities/person.entity';

export class PersonPrismaMapper {
  static toEntity(person: any): PersonEntity {
    return new PersonEntity(
      {
        databaseId: person.id,
        uuid: person.uuid,
        name: person.name,
        cpf: person.cpf,
        email: person.email,
        phone: person.phone,
        dt_nasc: person.dt_nasc,
        sexo: person.sexo,
        situacao: person.situacao,
        id_organization: person.id_organization,
        createdAt: person.created_at,
      },
      person.uuid,
    );
  }
}
