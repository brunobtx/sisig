import { PersonOutputDto, PersonOutputMapper } from '../dtos/person-output.dto';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class ListPersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(id_organization?: number | null): Promise<PersonOutputDto[]> {
    const people = await this.repository.findAll(id_organization);
    return people.map((person) => PersonOutputMapper.toOutput(person));
  }
}
