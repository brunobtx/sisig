import { AppError } from '../../../../../shared/errors/AppError';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto } from '../dtos/user-output.dto';

export class DetailUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(userUuid: string, id_organization?: number | null): Promise<UserOutputDto> {
    const user = await this.userRepository.findByUuid(userUuid, id_organization);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const person = await this.personRepository.findById(user.id_person, id_organization);

    if (!person) {
      throw new AppError('Pessoa vinculada ao usuário não encontrada', 404);
    }

    return {
      uuid: user.uuid ?? user.id,
      email: person.email,
      situacao: person.situacao,
    };
  }
}
