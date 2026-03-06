import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationEntity } from '../../domain/entities/organization.entity';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { OrganizationInputDto, OrganizationType } from '../dtos/organization-input.dto';

export class UpdateOrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  async execute(uuid: string, data: OrganizationInputDto): Promise<OrganizationEntity> {
    const { name, type, parent_uuid, bo_situacao } = data;

    const existing = await this.repository.findByUUID(uuid);

    if (!existing) {
      throw new AppError('Organização não encontrada.', 404);
    }

    if (parent_uuid && parent_uuid === uuid) {
      throw new AppError('Uma organização não pode ser vinculada a ela mesma.', 400);
    }

    const parent = parent_uuid ? await this.repository.findByUUID(parent_uuid) : null;

    if (parent_uuid && !parent) {
      throw new AppError('Organização pai não encontrada.', 404);
    }

    this.validateHierarchy(type, parent?.type ?? null, !!parent_uuid);

    const nameAlreadyExists = await this.repository.nameExistsForAnother(
      uuid,
      name,
      parent?.databaseId ?? null,
    );

    if (nameAlreadyExists) {
      throw new AppError('Já existe uma organização com esse nome neste nível.', 400);
    }

    const organization = new OrganizationEntity(
      {
        databaseId: existing.databaseId,
        uuid,
        name,
        type,
        id_parent: parent?.databaseId ?? null,
        parent_uuid: parent?.uuid ?? null,
        bo_situacao,
        createdAt: existing.createdAt,
      },
      uuid,
    );

    return this.repository.update(organization);
  }

  private validateHierarchy(type: OrganizationType, parentType: OrganizationType | null, hasParent: boolean): void {
    if (type === 'area' && hasParent) {
      throw new AppError('Área não pode possuir organização pai.', 400);
    }

    if (type === 'headquarters' && hasParent && parentType !== 'area') {
      throw new AppError('Igreja sede só pode ser vinculada a uma área.', 400);
    }

    if (type === 'congregation') {
      if (!hasParent) {
        throw new AppError('Congregação deve possuir igreja sede vinculada.', 400);
      }

      if (parentType !== 'headquarters') {
        throw new AppError('Congregação só pode ser vinculada a uma igreja sede.', 400);
      }
    }
  }
}
