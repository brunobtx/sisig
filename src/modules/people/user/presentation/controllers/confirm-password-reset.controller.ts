import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { ConfirmUserPasswordResetUseCase } from '../../application/use-cases/confirm-user-password-reset.use-case';

export class ConfirmPasswordResetController {
  constructor(private readonly useCase: ConfirmUserPasswordResetUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { token, password } = req.body;

    try {
      req.auditContext = await this.useCase.execute({ token, password });
      return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
