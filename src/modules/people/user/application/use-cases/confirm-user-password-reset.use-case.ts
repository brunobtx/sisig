import { createHash } from 'crypto';
import { hash } from 'bcryptjs';
import { AppError } from '../../../../../shared/errors/AppError';
import { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ConfirmPasswordResetInputDto } from '../dtos/password-reset.dto';

export class ConfirmUserPasswordResetUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
  ) {}

  async execute({ token, password }: ConfirmPasswordResetInputDto): Promise<void> {
    if (!token?.trim()) {
      throw new AppError('Token inválido.', 400);
    }

    if (!password || password.length < 6) {
      throw new AppError('A senha deve ter no mínimo 6 caracteres.', 400);
    }

    const tokenHash = createHash('sha256').update(token.trim()).digest('hex');
    const now = new Date();
    const resetToken = await this.passwordResetTokenRepository.findValidByTokenHash(tokenHash, now);

    if (!resetToken) {
      throw new AppError('Token inválido ou expirado.', 400);
    }

    const user = await this.userRepository.findById(resetToken.userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const passwordHash = await hash(password, 8);
    user.changePassword(passwordHash);

    await this.userRepository.update(user);
    await this.passwordResetTokenRepository.markAsUsed(resetToken.id);
    await this.passwordResetTokenRepository.invalidateAllByUserId(resetToken.userId);
  }
}
