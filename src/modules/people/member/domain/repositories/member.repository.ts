import { MemberEntity } from '../entities/member.entity';

export interface MemberRepository {
  findAll(id_organization?: number | null): Promise<MemberEntity[]>;
  findByEmail(email: string): Promise<MemberEntity | null>;
  findByCpf(cpf: string): Promise<MemberEntity | null>;
  create(member: MemberEntity): Promise<MemberEntity>;
}
