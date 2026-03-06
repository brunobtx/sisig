import prismaClient from '../../../../../prisma';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationPrismaMapper } from '../prisma/mappers/organization-prisma.mapper';

export class PrismaOrganizationRepository implements OrganizationRepository {
  async findByUUID(uuid: string): Promise<OrganizationEntity | null> {
    const organization = await prismaClient.organization.findUnique({
      where: { uuid },
      include: { parent: true },
    });

    return organization ? OrganizationPrismaMapper.toEntity(organization) : null;
  }

  async findById(id: number): Promise<OrganizationEntity | null> {
    const organization = await prismaClient.organization.findUnique({
      where: { id },
      include: { parent: true },
    });

    return organization ? OrganizationPrismaMapper.toEntity(organization) : null;
  }

  async findAll(): Promise<OrganizationEntity[]> {
    const organizations = await prismaClient.organization.findMany({
      include: { parent: true },
      orderBy: { created_at: 'desc' },
    });

    return organizations.map((organization) => OrganizationPrismaMapper.toEntity(organization));
  }

  async findByNameAndParent(name: string, parentId: number | null): Promise<OrganizationEntity | null> {
    const organization = await prismaClient.organization.findFirst({
      where: {
        name,
        id_parent: parentId,
      },
      include: { parent: true },
    });

    return organization ? OrganizationPrismaMapper.toEntity(organization) : null;
  }

  async nameExistsForAnother(uuid: string, name: string, parentId: number | null): Promise<boolean> {
    const organization = await prismaClient.organization.findFirst({
      where: {
        name,
        id_parent: parentId,
        NOT: { uuid },
      },
    });

    return !!organization;
  }

  async create(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const created = await prismaClient.organization.create({
      data: {
        uuid: organization.id,
        name: organization.name,
        type: organization.type,
        id_parent: organization.id_parent ?? null,
        bo_situacao: organization.bo_situacao,
        created_at: organization.createdAt ?? new Date(),
      },
      include: { parent: true },
    });

    return OrganizationPrismaMapper.toEntity(created);
  }

  async update(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const updated = await prismaClient.organization.update({
      where: { uuid: organization.id },
      data: {
        name: organization.name,
        type: organization.type,
        id_parent: organization.id_parent ?? null,
        bo_situacao: organization.bo_situacao,
      },
      include: { parent: true },
    });

    return OrganizationPrismaMapper.toEntity(updated);
  }

  async inactivateByUUID(uuid: string): Promise<void> {
    await prismaClient.organization.update({
      where: { uuid },
      data: { bo_situacao: false },
    });
  }

  async hasActiveChildren(uuid: string): Promise<boolean> {
    const organization = await prismaClient.organization.findUnique({
      where: { uuid },
      select: { id: true },
    });

    if (!organization) {
      return false;
    }

    const child = await prismaClient.organization.findFirst({
      where: {
        id_parent: organization.id,
        bo_situacao: true,
      },
      select: { id: true },
    });

    return !!child;
  }
}
