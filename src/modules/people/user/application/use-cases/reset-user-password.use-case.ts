import { hash } from 'bcryptjs';
import { AppError } from '../../../../../shared/errors/AppError';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

export class ResetUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(email: string): Promise<void> {
    const person = await this.personRepository.findByEmail(email);

    if (!person) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (!person.databaseId) {
      throw new AppError('Pessoa inválida para reset de senha', 400);
    }

    const user = await this.userRepository.findByIdPerson(person.databaseId);

    if (!user) {
      throw new AppError('Usuário não possui acesso ao sistema', 400);
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hash(temporaryPassword, 8);

    user.changePassword(passwordHash);
    await this.userRepository.update(user);

    console.log('Senha temporária:', temporaryPassword);
  }
}
