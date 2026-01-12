import { PersonEntity } from '../../Domain/Entity/personEntity'

export type PersonOutput = {
  id: string;    // UUID
  name: string;
  email: string;
  cpf: string;
  situacao?: boolean;
}

export class PersonOutputMapper {
  static toOutput(entity: PersonEntity): PersonOutput {
     return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      cpf: entity.cpf,
      situacao: entity.situacao,
    }
  }
}
