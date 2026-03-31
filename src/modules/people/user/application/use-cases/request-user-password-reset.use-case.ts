import { createHash, randomBytes } from 'crypto';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository';
import { PasswordResetMailer } from '../services/password-reset-mailer';
import { RequestPasswordResetInputDto } from '../dtos/password-reset.dto';
import { UserOrganizationContextService } from '../services/user-organization-context.service';
import { AppError } from '../../../../../shared/errors/AppError';

export type RequestPasswordResetAuditContext = {
  email: string;
  userUuid: string | null;
  personUuid: string | null;
  organizationId: number | null;
  matchedUser: boolean;
};

export class RequestUserPasswordResetUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly passwordResetMailer: PasswordResetMailer,
    private readonly userOrganizationContextService: UserOrganizationContextService,
  ) {}

  async execute({ email }: RequestPasswordResetInputDto): Promise<RequestPasswordResetAuditContext> {
    this.passwordResetMailer.assertConfigured();

    const frontendUrl = getPasswordResetFrontendUrl();
    const person = await this.personRepository.findByEmail(email);

    if (!person?.databaseId || !person.email) {
      return {
        email,
        userUuid: null,
        personUuid: null,
        organizationId: null,
        matchedUser: false,
      };
    }

    const user = await this.userRepository.findByIdPerson(person.databaseId);

    if (!user?.databaseId) {
      return {
        email,
        userUuid: null,
        personUuid: person.uuid ?? null,
        organizationId: person.id_organization ?? null,
        matchedUser: false,
      };
    }

    const expiresInMinutes = Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN_MINUTES ?? 30);
    const safeExpiresInMinutes = Number.isFinite(expiresInMinutes) && expiresInMinutes > 0
      ? Math.floor(expiresInMinutes)
      : 30;

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + safeExpiresInMinutes * 60 * 1000);

    await this.passwordResetTokenRepository.deleteExpired(now);
    await this.passwordResetTokenRepository.invalidateAllByUserId(user.databaseId);
    await this.passwordResetTokenRepository.create({
      userId: user.databaseId,
      tokenHash,
      expiresAt,
    });

    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await this.passwordResetMailer.send({
        to: person.email,
        name: person.name,
        resetLink,
        expiresInMinutes: safeExpiresInMinutes,
      });
    } catch (error) {
      await this.passwordResetTokenRepository.invalidateAllByUserId(user.databaseId);
      throw error;
    }

    const organizationContext =
      await this.userOrganizationContextService.resolveRequiredByUser(
        user.databaseId,
        user.id_person,
      );

    return {
      email,
      userUuid: user.uuid ?? null,
      personUuid: person.uuid ?? null,
      organizationId: organizationContext.activeOrganizationId,
      matchedUser: true,
    };
  }
}

function getPasswordResetFrontendUrl(): string {
  const frontendUrl = process.env.FRONTEND_URL?.trim();

  if (frontendUrl) {
    return frontendUrl.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV?.trim() === 'production') {
    throw new AppError(
      'FRONTEND_URL nao configurado para redefinicao de senha.',
      500,
    );
  }

  return 'http://localhost:3000';
}
