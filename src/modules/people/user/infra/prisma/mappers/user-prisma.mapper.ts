import { UserEntity } from '../../../domain/entities/user.entity';

export class UserPrismaMapper {
  static toEntity(user: any): UserEntity {
    return new UserEntity(
      {
        databaseId: user.id,
        uuid: user.uuid,
        id_person: user.id_person,
        password: user.password,
        role: user.role,
        created_at: user.created_at,
      },
      user.uuid,
    );
  }
}
