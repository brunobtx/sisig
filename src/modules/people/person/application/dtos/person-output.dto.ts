import { PersonEntity } from '../../domain/entities/person.entity';

export type PersonOutputDto = {
  uuid: string;
  id: number | string;
  name: string;
  email: string;
  phone: string;
  sexo: string;
  cpf: string;
  situacao?: boolean;
  dt_nasc: Date;
};

export class PersonOutputMapper {
  static toOutput(entity: PersonEntity): PersonOutputDto {
    return {
      uuid: entity.uuid,
      id: entity.databaseId ?? entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      sexo: entity.sexo,
      cpf: entity.cpf,
      situacao: entity.situacao,
      dt_nasc: entity.dt_nasc,
    };
  }
}
