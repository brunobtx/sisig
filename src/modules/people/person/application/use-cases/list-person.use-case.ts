import { PersonOutputDto, PersonOutputMapper } from '../dtos/person-output.dto';
import { PersonRepository } from '../../domain/repositories/person.repository';

export class ListPersonUseCase {
  constructor(private readonly repository: PersonRepository) {}

  async execute(): Promise<PersonOutputDto[]> {
    const people = await this.repository.findAll();
    return people.map((person) => PersonOutputMapper.toOutput(person));
  }
}
