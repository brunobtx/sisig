import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { DeletePersonUseCase } from '../../application/use-cases/delete-person.use-case';

export class DeletePersonController {
  constructor(private readonly useCase: DeletePersonUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const uuid: string = req.params.uuid;
      const person = await this.useCase.execute(uuid, req.activeOrganizationId);
      return res.status(200).json(person);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
