import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationOutputDto, OrganizationOutputMapper } from '../dtos/organization-output.dto';

export class DetailOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(uuid: string): Promise<OrganizationOutputDto> {
    const organization = await this.repository.findByUUID(uuid);

    if (!organization) {
      throw new AppError('Organização não encontrada.', 404);
    }

    return OrganizationOutputMapper.toOutput(organization);
  }
}
