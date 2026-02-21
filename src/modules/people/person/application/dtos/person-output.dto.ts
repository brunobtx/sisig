import { PersonEntity } from '../../domain/entities/person.entity';

export type PersonOutputDto = {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  sexo: string;
  cpf: string;
  situacao?: boolean;
};

export class PersonOutputMapper {
  static toOutput(entity: PersonEntity): PersonOutputDto {
    return {
      id: entity.databaseId ?? entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      sexo: entity.sexo,
      cpf: entity.cpf,
      situacao: entity.situacao,
    };
  }
}
