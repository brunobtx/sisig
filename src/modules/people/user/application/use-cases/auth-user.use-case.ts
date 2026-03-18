import { compare } from 'bcryptjs';
import { AppError } from '../../../../../shared/errors/AppError';
import { getPermissionsFromKeys, isValidRole } from '../../../../../shared/auth/rbac';
import { AccessControlRepository } from '../../../../settings/access-control/domain/repositories/access-control.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthUserInputDto } from '../dtos/auth-user-input.dto';
import { AuthUserOutputDto } from '../dtos/user-output.dto';
import { UserOrganizationAccessOutputMapper } from '../dtos/user-organization-access.dto';
import { AuthSessionService } from '../services/auth-session.service';
import { UserOrganizationContextService } from '../services/user-organization-context.service';

export class AuthUserUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly accessControlRepository: AccessControlRepository,
    private readonly userOrganizationContextService: UserOrganizationContextService,
    private readonly authSessionService: AuthSessionService,
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

    const normalizedRole = isValidRole(user.role) ? user.role : 'viewer';

    if (!user.databaseId) {
      throw new AppError('Usuario invalido para autenticacao.', 400);
    }

    const groupPermissionKeys = await this.accessControlRepository.listPermissionKeysByUserDatabaseId(
      user.databaseId,
    );
    const permissions = getPermissionsFromKeys(groupPermissionKeys);
    const organizationContext =
      await this.userOrganizationContextService.resolveRequiredByUser(
        user.databaseId,
        user.id_person,
      );
    const session = this.authSessionService.issue({
      userId: String(user.uuid ?? user.id),
      name: person.name,
      email: person.email,
      role: normalizedRole,
      permissions,
      organizationAccessMode: organizationContext.organizationAccessMode,
      activeOrganizationId: organizationContext.activeOrganizationId,
      organizationAccesses: organizationContext.organizationAccesses,
    });

    return {
      id: user.uuid ?? user.id,
      name: person.name,
      email: person.email,
      role: normalizedRole,
      organizationAccessMode: organizationContext.organizationAccessMode,
      activeOrganizationId: organizationContext.activeOrganizationId,
      organizationAccesses: organizationContext.organizationAccesses.map((access) =>
        UserOrganizationAccessOutputMapper.toOutput(access),
      ),
      permissions,
      token: session.token,
      expiresIn: session.expiresIn,
    };
  }
}
