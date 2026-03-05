import { compare } from 'bcryptjs';
import { decode, sign, type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { AppError } from '../../../../../shared/errors/AppError';
import { getPermissionsFromKeys, isValidRole } from '../../../../../shared/auth/rbac';
import { AccessControlRepository } from '../../../../settings/access-control/domain/repositories/access-control.repository';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthUserInputDto } from '../dtos/auth-user-input.dto';
import { AuthUserOutputDto } from '../dtos/user-output.dto';

export class AuthUserUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly accessControlRepository: AccessControlRepository,
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

    const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];
    const normalizedRole = isValidRole(user.role) ? user.role : 'viewer';
    if (!user.databaseId) {
      throw new AppError('Usuario invalido para autenticacao.', 400);
    }
    const groupPermissionKeys = await this.accessControlRepository.listPermissionKeysByUserDatabaseId(
      user.databaseId,
    );
    const permissions = getPermissionsFromKeys(groupPermissionKeys);

    const token = sign(
      {
        name: person.name,
        email: person.email,
        role: normalizedRole,
        permissions,
      },
      process.env.JWT_SECRET,
      {
        subject: String(user.uuid ?? user.id),
        expiresIn: jwtExpiresIn,
      },
    );

    const payload = decode(token) as JwtPayload | null;
    const issuedAt = payload?.iat;
    const expiresAt = payload?.exp;
    const expiresIn =
      typeof issuedAt === 'number' && typeof expiresAt === 'number'
        ? Math.max(expiresAt - issuedAt, 1)
        : 60 * 60 * 24;

    return {
      id: user.uuid ?? user.id,
      name: person.name,
      email: person.email,
      role: normalizedRole,
      permissions,
      token,
      expiresIn,
    };
  }
}
