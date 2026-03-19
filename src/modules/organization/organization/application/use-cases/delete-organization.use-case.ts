import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationOutputDto, OrganizationOutputMapper } from '../dtos/organization-output.dto';

export class DeleteOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(uuid: string): Promise<OrganizationOutputDto> {
    const organization = await this.repository.findByUUID(uuid);

    if (!organization) {
      throw new AppError('Organização não encontrada.', 404);
    }

    const hasActiveChildren = await this.repository.hasActiveChildren(uuid);

    if (hasActiveChildren) {
      throw new AppError('Não é possível inativar organização com unidades ativas vinculadas.', 400);
    }

    const hasLinkedUsers = await this.repository.hasLinkedUsers(uuid);

    if (hasLinkedUsers) {
      throw new AppError('Não é possível inativar organização com usuários vinculados.', 400);
    }

    await this.repository.inactivateByUUID(uuid);

    return {
      ...OrganizationOutputMapper.toOutput(organization),
      bo_situacao: false,
    };
  }
}
