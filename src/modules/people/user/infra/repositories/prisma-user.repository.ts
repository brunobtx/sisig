import prismaClient from '../../../../../prisma';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserPrismaMapper } from '../prisma/mappers/user-prisma.mapper';

export class PrismaUserRepository implements UserRepository {
  async findById(id: number, id_organization?: number | null): Promise<UserEntity | null> {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : {}),
      },
    });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findByUuid(uuid: string, id_organization?: number | null): Promise<UserEntity | null> {
    const user = await prismaClient.user.findFirst({
      where: {
        uuid,
        ...(typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : {}),
      },
    });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findByIdPerson(id_person: number, id_organization?: number | null): Promise<UserEntity | null> {
    const user = await prismaClient.user.findFirst({
      where: {
        id_person,
        ...(typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : {}),
      },
    });
    return user ? UserPrismaMapper.toEntity(user) : null;
  }

  async findAll(id_organization?: number | null): Promise<UserEntity[]> {
    const users = await prismaClient.user.findMany({
      where:
        typeof id_organization === 'number'
          ? {
              person: {
                id_organization,
              },
            }
          : undefined,
      orderBy: { created_at: 'desc' },
    });
    return users.map((user) => UserPrismaMapper.toEntity(user));
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const data: any = {
      id_person: user.id_person,
      password: user.password,
      role: user.role,
    };

    const created = await prismaClient.user.create({
      data,
    });

    return UserPrismaMapper.toEntity(created);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data: any = {
      id_person: user.id_person,
      password: user.password,
      role: user.role,
    };

    const updated = await prismaClient.user.update({
      where: { uuid: user.uuid ?? user.id },
      data,
    });

    return UserPrismaMapper.toEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }
}
