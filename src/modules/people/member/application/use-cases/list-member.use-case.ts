import { MemberRepository } from '../../domain/repositories/member.repository';
import { MemberOutputDto, MemberOutputMapper } from '../dtos/member-output.dto';

export class ListMemberUseCase {
  constructor(private readonly repository: MemberRepository) {}

  async execute(id_organization?: number | null): Promise<MemberOutputDto[]> {
    const members = await this.repository.findAll(id_organization);
    return members.map((member) => MemberOutputMapper.toOutput(member));
  }
}
