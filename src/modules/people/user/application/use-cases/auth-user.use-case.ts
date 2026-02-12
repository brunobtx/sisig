import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AppError } from '../../../../../shared/errors/AppError';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthUserInputDto } from '../dtos/auth-user-input.dto';
import { AuthUserOutputDto } from '../dtos/user-output.dto';

export class AuthUserUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ email, password }: AuthUserInputDto): Promise<AuthUserOutputDto> {
    const person = await this.personRepository.findByEmail(email);

    if (!person) {
      throw new AppError('E-mail não cadastrado no sistema.', 400);
    }

    if (!person.databaseId) {
      throw new AppError('Pessoa inválida para autenticação.', 400);
    }

    const user = await this.userRepository.findByIdPerson(person.databaseId);

    if (!user) {
      throw new AppError('Usuário não existe no sistema.', 400);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Usuário ou senha incorretos.', 400);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET não configurado.', 500);
    }

    const token = sign(
      {
        name: person.name,
        email: person.email,
      },
      process.env.JWT_SECRET,
      {
        subject: String(user.uuid ?? user.id),
        expiresIn: '30d',
      },
    );

    return {
      id: user.uuid ?? user.id,
      name: person.name,
      email: person.email,
      token,
    };
  }
}
