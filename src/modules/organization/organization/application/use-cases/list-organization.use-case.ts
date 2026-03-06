import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationOutputDto, OrganizationOutputMapper } from '../dtos/organization-output.dto';

export class ListOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(): Promise<OrganizationOutputDto[]> {
    const organizations = await this.repository.findAll();
    return organizations.map((organization) => OrganizationOutputMapper.toOutput(organization));
  }
}
