import { AppError } from '../../../../../shared/errors/AppError';
import { PersonOutputDto, PersonOutputMapper } from '../dtos/person-output.dto';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class DetailPersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(uuid: string): Promise<PersonOutputDto> {
    const person = await this.repository.findByUUID(uuid);

    if (!person) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    return PersonOutputMapper.toOutput(person);
  }
}
