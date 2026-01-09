import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { BadRequestError } from '../../../../../Common/Application/Errors/badRequestError';
import { PersonRepository } from '../../../People/Domain/Repository/personRepository';
import { UserRepository } from '../../Domain/Repository/userRepository';

interface AuthRequest {
  email: string;
  password: string;
}

export class AuthUserService {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute({ email, password }: AuthRequest) {
    // 1️⃣ Busca a pessoa pelo e-mail
    const person = await this.personRepository.findByEmail(email);

    if (!person) {
      throw new BadRequestError('E-mail não cadastrado no sistema.');
    }

    // 2️⃣ Busca o usuário vinculado à pessoa
    const user = await this.userRepository.findByIdPerson(person.props.id);

    if (!user) {
      throw new BadRequestError('Usuário não existe no sistema.');
    }

    // 3️⃣ Compara a senha informada com o hash salvo
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestError('Usuário ou senha incorretos.');
    }

    // 4️⃣ Gera o token JWT
    const token = sign(
      {
        name: person.name,
        email: person.email,
      },
      process.env.JWT_SECRET as string, // garante tipagem
      {
        subject: String(user.id), // altere para uuid se existir
        expiresIn: '30d',
      }
    );

    return {
      id: user.id,
      name: person.name,
      email: person.email,
      token,
    };
  }
}
