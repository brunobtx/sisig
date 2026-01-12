import { hash } from 'bcryptjs';
import prismaClient from '../../../../../prisma';
import { UserEntity } from '../Entity/userEntity';

// Conversão entre resultado do Prisma e entidade de domínio
function toEntity(user: any): UserEntity {
  return new UserEntity(
    {
      id_person: user.id_person,
      uuid: user.uuid,
      password: user.password,
      created_at: user.created_at
    },
    user.id
  );
}

// Interface do repositório
export interface UserRepository {
  findById(id: number): Promise<UserEntity | null>;
  findByUuid(uuid: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  findByIdPerson(id_person: number): Promise<UserEntity | null>;
}

// Implementação concreta com Prisma
export class PrismaUserRepository implements UserRepository {

  async findById(id: number): Promise<UserEntity | null> {
    const user = await prismaClient.user.findUnique({ where: { id } });
    return user ? toEntity(user) : null;
  }

   async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = await prismaClient.user.findUnique({ where: { uuid } });
    return user ? toEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await prismaClient.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    return users.map(toEntity);
  }

  async create(user: UserEntity): Promise<UserEntity> {

    const created = await prismaClient.user.create({
      data: {
        id_person: user.id_person,
        password: user.password,
      },
      include: { person: true },
    });

    return toEntity(created);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updated = await prismaClient.user.update({
      where: { uuid: user.id },
      data: {
        id_person: user.id_person,
        password: user.password,
      },
      include: { person: true },
    });

    return toEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }

  async findByIdPerson(id_person: number): Promise<UserEntity | null> {
    const user = await prismaClient.user.findFirst({
      where:{
        id_person: id_person
      }
    });
    return user ? toEntity(user) : null;
  }
}
