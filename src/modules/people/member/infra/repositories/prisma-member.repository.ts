import prismaClient from '../../../../../prisma';
import { MemberEntity } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { MemberPrismaMapper } from '../prisma/mappers/member-prisma.mapper';

export class PrismaMemberRepository implements MemberRepository {
  async findByEmail(email: string): Promise<MemberEntity | null> {
    const person = await prismaClient.person.findUnique({ where: { email } });
    return person ? MemberPrismaMapper.toEntity(person) : null;
  }

  async findByCpf(cpf: string): Promise<MemberEntity | null> {
    const person = await prismaClient.person.findUnique({ where: { cpf } });
    return person ? MemberPrismaMapper.toEntity(person) : null;
  }

  async create(member: MemberEntity): Promise<MemberEntity> {
    const created = await prismaClient.person.create({
      data: {
        uuid: member.id,
        name: member.name,
        cpf: member.cpf,
        email: member.email,
        phone: member.phone,
        dt_nasc: member.dt_nasc,
        sexo: member.sexo,
        id_organization: member.id_organization ?? null,
        situacao: member.situacao,
        created_at: member.createdAt ?? new Date(),
      },
    });

    return MemberPrismaMapper.toEntity(created);
  }
}
