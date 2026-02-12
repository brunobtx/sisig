import prismaClient from '../../../../../prisma';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserPrismaMapper } from '../prisma/mappers/user-prisma.mapper';

export class PrismaUserRepository implements UserRepository {
  async findById(id: number): Promise<UserEntity | null> {
    const user = await prismaClient.user.findUnique({ where: { id } });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = await prismaClient.user.findUnique({ where: { uuid } });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findByIdPerson(id_person: number): Promise<UserEntity | null> {
    const user = await prismaClient.user.findFirst({ where: { id_person } });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prismaClient.user.findMany({ orderBy: { created_at: 'desc' } });
    return users.map((user) => UserPrismaMapper.toEntity(user));
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await prismaClient.user.create({
      data: {
        id_person: user.id_person,
        password: user.password,
      },
    });

    return UserPrismaMapper.toEntity(created);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await prismaClient.user.update({
      where: { uuid: user.uuid ?? user.id },
      data: {
        id_person: user.id_person,
        password: user.password,
      },
    });

    return UserPrismaMapper.toEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }
}
