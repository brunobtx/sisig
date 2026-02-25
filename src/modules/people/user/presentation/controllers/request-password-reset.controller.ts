import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { RequestUserPasswordResetUseCase } from '../../application/use-cases/request-user-password-reset.use-case';

export class RequestPasswordResetController {
  constructor(private readonly useCase: RequestUserPasswordResetUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    try {
      await this.useCase.execute({ email });

      return res.status(200).json({
        message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.',
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
