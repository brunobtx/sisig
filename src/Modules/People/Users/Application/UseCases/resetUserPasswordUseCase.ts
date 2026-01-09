// Application/UseCases/resetUserPasswordUseCase.ts
import { hash } from 'bcryptjs';
import { UserRepository } from '../../Domain/Repository/userRepository';
import { PersonRepository } from '../../../People/Domain/Repository/personRepository';
import { BadRequestError } from '../../../../../Common/Application/Errors/badRequestError';

export class ResetUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personRepository: PersonRepository
  ) {}

  async execute(email: string): Promise<void> {

    // 1️⃣ Busca pessoa pelo email
    const person = await this.personRepository.findByEmail(email);

    if (!person) {
      throw new BadRequestError('Usuário não encontrado');
    }

    // 2️⃣ Busca usuário pelo id_person
    const user = await this.userRepository.findByIdPerson(person.id);

    if (!user) {
      throw new BadRequestError('Usuário não possui acesso ao sistema');
    }


    const temporaryPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hash(temporaryPassword, 8);

    // 5️⃣ Atualiza SOMENTE a senha na entidade
    user.changePassword(passwordHash); // método da entidade 👈

    // 6️⃣ Persiste
    await this.userRepository.update(user);

    // 7️⃣ Side effect fora do domínio
    console.log('Senha temporária:', temporaryPassword);
  }
}
