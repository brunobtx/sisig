import { MemberEntity } from '../entities/member.entity';

export interface MemberRepository {
  findByEmail(email: string): Promise<MemberEntity | null>;
  findByCpf(cpf: string): Promise<MemberEntity | null>;
  create(member: MemberEntity): Promise<MemberEntity>;
}
