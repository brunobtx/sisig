import { PersonEntity } from '../Entity/personEntity'

export type PersonOutput = {
  id: string
  name: string
  email: string
  cpf: string
}

export class PersonOutputMapper {
  static toOutput(entity: PersonEntity): PersonOutput {
     return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      cpf: entity.cpf
    }
  }
}
