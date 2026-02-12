import { UserEntity } from '../../domain/entities/user.entity';

export type UserOutputDto = {
  uuid: string;
  email: string;
  situacao: boolean;
};

export type CreateUserOutputDto = {
  uuid: string;
  id_person: number;
  created_at: Date | null | undefined;
};

export type AuthUserOutputDto = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export class UserOutputMapper {
  static toCreateOutput(user: UserEntity): CreateUserOutputDto {
    return {
      uuid: user.uuid ?? user.id,
      id_person: user.id_person,
      created_at: user.created_at,
    };
  }
}
