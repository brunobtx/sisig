import { UserListOutputDto, UserOutputMapperList } from '../dtos/user-output.dto';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';

export class ListUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(id_organization?: number | null): Promise<UserListOutputDto[]> {
    const users = await this.userRepository.findAll(id_organization);

    const usersWithPerson = await Promise.all(
      users.map(async (user) => {
        const person = await this.personRepository.findById(user.id_person, id_organization);
        return UserOutputMapperList.toListOutput(user, person);
      }),
    );

    return usersWithPerson;
  }
}
