import prismaClient from '../../../../../prisma';
import { ClassEntity } from '../../domain/entities/class.entity';
import { ClassRepository } from '../../domain/repositories/class.repository';
import { ClassPrismaMapper } from '../prisma/mappers/class-prisma.mapper';

export class PrismaClassRepository implements ClassRepository {
  async findById(id: number, id_organization?: number | null): Promise<ClassEntity | null> {
    const classe = await prismaClient.class.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return classe ? ClassPrismaMapper.toEntity(classe) : null;
  }

  async findAll(id_organization?: number | null): Promise<ClassEntity[]> {
    const classes = await prismaClient.class.findMany({
      where: typeof id_organization === 'number' ? { id_organization } : undefined,
      orderBy: { created_at: 'desc' },
    });

    return classes.map((classe) => ClassPrismaMapper.toEntity(classe));
  }

  async create(data: ClassEntity): Promise<ClassEntity> {
    const classe = await prismaClient.class.create({
      // Keep compatibility while local Prisma Client types are stale.
      data: {
        uuid: data.id,
        name: data.name,
        idade_in: data.idade_in,
        idade_fn: data.idade_fn,
        id_organization: data.id_organization ?? null,
        bo_situacao: data.bo_situacao ?? true,
        description: data.description,
      } as any,
    });

    return ClassPrismaMapper.toEntity(classe);
  }
}
