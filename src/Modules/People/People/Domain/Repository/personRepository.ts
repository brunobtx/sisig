import prismaClient from '../../../../../prisma';
import { PersonEntity } from '../Entity/personEntity';

function toEntity(person: any): PersonEntity {
  return new PersonEntity(
    {
      id: person.id,
      name: person.name,
      cpf: person.cpf,
      email: person.email,
      phone: person.phone,
      dt_nasc: person.dt_nasc,
      sexo: person.sexo,
      situacao: person.situacao,
      createdAt: person.created_at,
    },
    person.id
  );
}

export interface PersonRepository {
  findById(id: number): Promise<PersonEntity | null>;
  findByEmail(email: string): Promise<PersonEntity | null>;
  findByCpf(cpf: string): Promise<PersonEntity | null>;
  findAll(): Promise<PersonEntity[]>;
  create(person: PersonEntity): Promise<PersonEntity>;
  update(person: PersonEntity): Promise<PersonEntity>;
  delete(id: string): Promise<void>;
  emailExists(email: string): Promise<boolean>;
}

export class PrismaPersonRepository implements PersonRepository {
  async findById(id: number): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findUnique({ where: { id: id } });
    return person ? toEntity(person) : null;
  }

  async findByEmail(email: string): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findUnique({ where: { email } });
    return person ? toEntity(person) : null;
  }

  async findByCpf(cpf: string): Promise<PersonEntity | null> {
    const person = await prismaClient.person.findUnique({ where: { cpf } });
    return person ? toEntity(person) : null;
  }

  async findAll(): Promise<PersonEntity[]> {
    const people = await prismaClient.person.findMany({ orderBy: { created_at: 'desc' } });
    return people.map(toEntity);
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
        created_at: person.createdAt,
      },
    });
    return toEntity(created);
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
      },
    });
    return toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prismaClient.person.delete({ where: { uuid: id } });
  }

  async emailExists(email: string): Promise<boolean> {
    const person = await prismaClient.person.findUnique({ where: { email } });
    return !!person;
  }
}
