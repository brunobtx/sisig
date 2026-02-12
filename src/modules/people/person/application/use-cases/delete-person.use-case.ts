import { AppError } from '../../../../../shared/errors/AppError';
import { PersonOutputDto } from '../dtos/person-output.dto';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class DeletePersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(uuid: string): Promise<PersonOutputDto> {
    const person = await this.repository.findByUUID(uuid);

    if (!person) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    await this.repository.inactivateByUUID(uuid);

    return {
      id: person.uuid ?? person.id,
      name: person.name,
      email: person.email,
      cpf: person.cpf,
      situacao: person.situacao,
    };
  }
}
