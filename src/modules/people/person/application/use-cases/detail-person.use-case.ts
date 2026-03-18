import { AppError } from '../../../../../shared/errors/AppError';
import { PersonOutputDto, PersonOutputMapper } from '../dtos/person-output.dto';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class DetailPersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(uuid: string, id_organization?: number | null): Promise<PersonOutputDto> {
    const person = await this.repository.findByUUID(uuid, id_organization);

    if (!person) {
      throw new AppError('Pessoa não encontrada', 404);
    }

    return PersonOutputMapper.toOutput(person);
  }
}
