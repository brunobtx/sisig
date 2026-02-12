import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByUuid(uuid: string): Promise<UserEntity | null>;
  findByIdPerson(id_person: number): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: number): Promise<void>;
}
