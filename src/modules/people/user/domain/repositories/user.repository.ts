import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findById(id: number, id_organization?: number | null): Promise<UserEntity | null>;
  findByUuid(uuid: string, id_organization?: number | null): Promise<UserEntity | null>;
  findByIdPerson(id_person: number, id_organization?: number | null): Promise<UserEntity | null>;
  findAll(id_organization?: number | null): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: number): Promise<void>;
}
