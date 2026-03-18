import prismaClient from '../../../../../prisma';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { PersonPrismaMapper } from '../prisma/mappers/person-prisma.mapper';

export class PrismaPersonRepository implements PersonRepository {
  async findById(id: number, id_organization?: number | null): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findFirst({
      where: {
        id,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return person ? PersonPrismaMapper.toEntity(person) : null;
  }

  async findByUUID(uuid: string, id_organization?: number | null): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findFirst({
      where: {
        uuid,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return person ? PersonPrismaMapper.toEntity(person) : null;
  }

  async findByEmail(email: string, id_organization?: number | null): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findFirst({
      where: {
        email,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return person ? PersonPrismaMapper.toEntity(person) : null;
  }

  async findByCpf(cpf: string, id_organization?: number | null): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findFirst({
      where: {
        cpf,
        ...(typeof id_organization === 'number' ? { id_organization } : {}),
      },
    });
    return person ? PersonPrismaMapper.toEntity(person) : null;
  }

  async findAll(id_organization?: number | null): Promise<PersonEntity[]> {
    const people = await prismaClient.person.findMany({
      where: typeof id_organization === 'number' ? { id_organization } : undefined,
      orderBy: { created_at: 'desc' },
    });
    return people.map((person) => PersonPrismaMapper.toEntity(person));
  }

  async create(person: PersonEntity): Promise<PersonEntity> {
    const created = await prismaClient.person.create({
      data: {
        uuid: person.id,
        name: person.name,
        cpf: person.cpf,
        email: person.email,
        phone: person.phone,
        dt_nasc: person.dt_nasc,
        sexo: person.sexo,
        situacao: person.situacao,
        id_organization: person.id_organization,
        created_at: person.createdAt ?? new Date(),
      },
    });

    return PersonPrismaMapper.toEntity(created);
  }

  async update(person: PersonEntity): Promise<PersonEntity> {
    const updated = await prismaClient.person.update({
      where: { uuid: person.id },
      data: {
        name: person.name,
        cpf: person.cpf,
        email: person.email,
        phone: person.phone,
        dt_nasc: person.dt_nasc,
        sexo: person.sexo,
        situacao: person.situacao,
        id_organization: person.id_organization,
      },
    });

    return PersonPrismaMapper.toEntity(updated);
  }

  async inactivateByUUID(uuid: string): Promise<void> {
    await prismaClient.person.update({
      where: { uuid },
      data: { situacao: false },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { email } });
    return !!person;
  }

  async emailExistsForAnother(uuid: string, email: string): Promise<boolean> {
    const person = await prismaClient.person.findFirst({
      where: {
        email,
        NOT: { uuid },
      },
    });

    return !!person;
  }

  async cpfExistsForAnother(uuid: string, cpf: string): Promise<boolean> {
    const person = await prismaClient.person.findFirst({
      where: {
        cpf,
        NOT: { uuid },
      },
    });

    return !!person;
  }
}
