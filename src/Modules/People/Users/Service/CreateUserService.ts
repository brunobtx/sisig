import { hash } from 'bcryptjs';
import { UserRepository } from '../Repository/userRepository';
import { UserEntity } from '../Entity/userEntity';
import { BadRequestError } from '../../../../Common/Application/Errors/badRequestError';

interface UserRequest {
  id_person: number;
  password: string;
}

export class CreateUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id_person, password }: UserRequest) {
    if (!password) {
      throw new BadRequestError('Senha obrigatória!');
    }

    // Verifica se já existe usuário para essa pessoa
    const userAlreadyExists = await this.repository.findByIdPerson(id_person);
    if (userAlreadyExists) {
      throw new BadRequestError('Usuário já existe para esta pessoa!');
    }

    // Criptografa senha
    const passwordHash = await hash(password, 8);

    // Cria entidade de domínio
    const userEntity = new UserEntity({
      id_person,
      password: passwordHash,
      created_at: new Date(),
    });

    // Persiste no banco via repositório
    const createdUser = await this.repository.create(userEntity);

    return createdUser;
  }
}
