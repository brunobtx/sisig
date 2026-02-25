import { AppError } from '../../../../../shared/errors/AppError';
import { UserRepository } from '../../domain/repositories/user.repository';

export class ResetUserPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(_email: string): Promise<void> {
    void this.userRepository;
    throw new AppError('Fluxo legado desativado. Use /password/forgot e /password/reset.', 400);
  }
}
