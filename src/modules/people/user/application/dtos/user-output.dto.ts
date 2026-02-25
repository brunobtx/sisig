import { UserEntity } from '../../domain/entities/user.entity';
import { PersonEntity } from '../../../person/domain/entities/person.entity';

export type UserOutputDto = {
  uuid: string;
  email: string;
  situacao: boolean;
};

export type UserListOutputDto = {
  uuid: string;
  id_person: number;
  role: string;
  name: string | null;
  email: string | null;
  situacao: boolean | null;
  created_at: Date | null | undefined;
};

export type CreateUserOutputDto = {
  uuid: string;
  id_person: number;
  role: string;
  created_at: Date | null | undefined;
};

export type AuthUserOutputDto = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Array<{
    module: string;
    actions: string[];
  }>;
  token: string;
  expiresIn: number;
};

export class UserOutputMapper {
  static toCreateOutput(user: UserEntity): CreateUserOutputDto {
    return {
      uuid: user.uuid ?? user.id,
      id_person: user.id_person,
      role: user.role,
      created_at: user.created_at,
    };
  }
}

export class UserOutputMapperList {
  static toListOutput(user: UserEntity, person: PersonEntity | null): UserListOutputDto {
    return {
      uuid: user.uuid ?? user.id,
      id_person: user.id_person,
      role: user.role,
      name: person?.name ?? null,
      email: person?.email ?? null,
      situacao: person?.situacao ?? null,
      created_at: user.created_at,
    };
  }
}
