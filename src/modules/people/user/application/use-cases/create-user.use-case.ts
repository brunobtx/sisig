import { hash } from 'bcryptjs';
import { AppError } from '../../../../../shared/errors/AppError';
import { isValidRole, UserRole } from '../../../../../shared/auth/rbac';
import { AccessControlRepository } from '../../../../settings/access-control/domain/repositories/access-control.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserInputDto } from '../dtos/create-user-input.dto';

export class CreateUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly accessControlRepository: AccessControlRepository,
    private readonly personRepository: PersonRepository,
  ) {}

  async execute({
    id_person,
    password,
    role = 'viewer',
    groupUuids = [],
  }: CreateUserInputDto, id_organization?: number | null): Promise<UserEntity> {
    if (!password) {
      throw new AppError('Senha obrigatória!', 400);
    }

    if (!isValidRole(role)) {
      throw new AppError('Role inválido.', 400);
    }

    const person = await this.personRepository.findById(id_person, id_organization);
    if (!person) {
      throw new AppError('Pessoa nao encontrada para criar usuario.', 404);
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
      created_at: new Date(),
    });

    const createdUser = await this.repository.create(userEntity);

    try {
      const normalizedGroupUuids = Array.from(new Set((groupUuids ?? []).filter(Boolean)));

      if (normalizedGroupUuids.length) {
        if (!createdUser.uuid) {
          throw new AppError('Usuário criado sem UUID válido para vincular grupos.', 500);
        }

        await this.accessControlRepository.replaceUserGroups(createdUser.uuid, normalizedGroupUuids);
      }

      return createdUser;
    } catch (error) {
      if (createdUser.databaseId) {
        await this.repository.delete(createdUser.databaseId);
      }

      throw error;
    }
  }
}
