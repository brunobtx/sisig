import { AppError } from '../../../../../shared/errors/AppError';
import { OrganizationRepository } from '../../../../organization/organization/domain/repositories/organization.repository';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class AssignPersonToOrganizationUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute({
    personUuid,
    organizationUuid,
    activeOrganizationId,
  }: {
    personUuid: string;
    organizationUuid: string;
    activeOrganizationId?: number | null;
  }): Promise<PersonEntity> {
    if (!personUuid) {
      throw new AppError('Pessoa inválida.', 400);
    }

    if (!organizationUuid) {
      throw new AppError('Organização inválida.', 400);
    }

    const person = await this.personRepository.findByUUID(personUuid, activeOrganizationId);
    if (!person) {
      throw new AppError('Pessoa não encontrada.', 404);
    }

    const organization = await this.organizationRepository.findByUUID(organizationUuid);
    if (!organization) {
      throw new AppError('Organização não encontrada.', 404);
    }

    if (!organization.bo_situacao) {
      throw new AppError('Organização inativa.', 400);
    }

    if (!organization.databaseId) {
      throw new AppError('Organização inválida para vínculo.', 500);
    }

    if (person.id_organization === organization.databaseId) {
      return person;
    }

    const updatedPerson = new PersonEntity(
      {
        databaseId: person.databaseId,
        uuid: person.uuid ?? person.id,
        name: person.name,
        cpf: person.cpf,
        email: person.email,
        phone: person.phone,
        dt_nasc: person.dt_nasc,
        sexo: person.sexo,
        situacao: person.situacao,
        id_organization: organization.databaseId,
        createdAt: person.createdAt,
      },
      person.id,
    );

    return this.personRepository.update(updatedPerson);
  }
}
