import { UserListOutputDto, UserOutputMapperList } from '../dtos/user-output.dto';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';

export class ListUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(): Promise<UserListOutputDto[]> {
    const users = await this.userRepository.findAll();

    const usersWithPerson = await Promise.all(
      users.map(async (user) => {
        const person = await this.personRepository.findById(user.id_person);
        return UserOutputMapperList.toListOutput(user, person);
      }),
    );

    return usersWithPerson;
  }
}
