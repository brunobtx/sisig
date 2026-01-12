import { UserEntity } from '../../Domain/Entity/userEntity';
import { PersonEntity } from '../../../People/Domain/Entity/personEntity';

export type UserOutput = {
    uuid: string;
    email: string;
    situacao: boolean;
  };

export class UserOutputMapper {
  static toOutput(user: UserEntity, person: PersonEntity): UserOutput {
    return {
      uuid: user.uuid,
      email: person.email,
      situacao: person.situacao
    };
  }
}

