import prismaClient from '../../../../../prisma';
import { HomeEntity } from '../../domain/entities/home.entity';
import { HomeRepository } from '../../domain/repositories/home.repository';
import { HomePrismaMapper } from '../prisma/mappers/home-prisma.mapper';

const modelName = 'home';

export class PrismaHomeRepository implements HomeRepository {
  async findByName(name: string): Promise<HomeEntity | null> {
    const model = (prismaClient as any)[modelName];
    const row = await model.findFirst({ where: { name } });
    return row ? HomePrismaMapper.toEntity(row) : null;
  }

  async create(entity: HomeEntity): Promise<HomeEntity> {
    const model = (prismaClient as any)[modelName];
    const row = await model.create({
      data: {
        uuid: entity.id,
        name: entity.name,
      },
    });

    return HomePrismaMapper.toEntity(row);
  }
}
