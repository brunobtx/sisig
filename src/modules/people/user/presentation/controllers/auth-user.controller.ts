import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';

export class AuthUserController {
  constructor(private readonly useCase: AuthUserUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const auth = await this.useCase.execute({ email, password });
      return res.status(200).json(auth);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
