import { AppError } from '../../../../../shared/errors/AppError';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { PersonInputDto } from '../dtos/person-input.dto';

export class UpdatePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(
    uuid: string,
    data: PersonInputDto,
    id_organization?: number | null,
  ): Promise<PersonEntity> {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data;

    const existingPerson = await this.repository.findByUUID(uuid, id_organization);
    if (!existingPerson) {
      throw new AppError('Pessoa não encontrada!', 404);
    }

    const emailAlreadyExists = await this.repository.emailExistsForAnother(uuid, email);
    if (emailAlreadyExists) {
      throw new AppError('Email já existe!', 400);
    }

    const cpfAlreadyExists = await this.repository.cpfExistsForAnother(uuid, cpf);
    if (cpfAlreadyExists) {
      throw new AppError('CPF já existe!', 400);
    }

    const personEntity = new PersonEntity(
      {
        databaseId: existingPerson.databaseId,
        uuid,
        name,
        cpf,
        email,
        phone,
        dt_nasc: new Date(dt_nasc),
        sexo,
        situacao,
        id_organization: existingPerson.id_organization,
        createdAt: existingPerson.createdAt,
      },
      uuid,
    );

    return this.repository.update(personEntity);
  }
}
