import { createHash, randomBytes } from 'crypto';
import { PersonRepository } from '../../../person/domain/repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository';
import { PasswordResetMailer } from '../services/password-reset-mailer';
import { RequestPasswordResetInputDto } from '../dtos/password-reset.dto';

export class RequestUserPasswordResetUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly passwordResetMailer: PasswordResetMailer,
  ) {}

  async execute({ email }: RequestPasswordResetInputDto): Promise<void> {
    const person = await this.personRepository.findByEmail(email);

    if (!person?.databaseId || !person.email) {
      return;
    }

    const user = await this.userRepository.findByIdPerson(person.databaseId);

    if (!user?.databaseId) {
      return;
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

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await this.passwordResetMailer.send({
      to: person.email,
      name: person.name,
      resetLink,
      expiresInMinutes: safeExpiresInMinutes,
    });
  }
}
