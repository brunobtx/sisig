import { AppError } from '../../../../../shared/errors/AppError';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { PersonInputDto } from '../dtos/person-input.dto';

export class CreatePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(data: PersonInputDto, id_organization?: number | null): Promise<PersonEntity> {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data;

    if (await this.repository.emailExists(email)) {
      throw new AppError('Email já existe!', 400);
    }

    if (await this.repository.findByCpf(cpf)) {
      throw new AppError('CPF já existe!', 400);
    }

    const personEntity = new PersonEntity({
      name,
      cpf,
      email,
      phone,
      dt_nasc: new Date(dt_nasc),
      sexo,
      situacao,
      id_organization: typeof id_organization === 'number' ? id_organization : undefined,
    });

    return this.repository.create(personEntity);
  }
}
