import { hash } from 'bcryptjs';
import { AppError } from '../../../../../shared/errors/AppError';
import { isValidRole, UserRole } from '../../../../../shared/auth/rbac';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute({
    id_person,
    password,
    role = 'viewer',
    custom_permissions = [],
  }: CreateUserInputDto): Promise<UserEntity> {
    if (!password) {
      throw new AppError('Senha obrigatória!', 400);
    }

    if (!isValidRole(role)) {
      throw new AppError('Role inválido.', 400);
    }

    const userAlreadyExists = await this.repository.findByIdPerson(id_person);
    if (userAlreadyExists) {
      throw new AppError('Usuário já existe para esta pessoa!', 400);
    }

    const passwordHash = await hash(password, 8);

    const userEntity = new UserEntity({
      id_person,
      password: passwordHash,
      role: role as UserRole,
      custom_permissions,
      created_at: new Date(),
    });

    return this.repository.create(userEntity);
  }
}
