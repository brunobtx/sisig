import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlOutputMapper } from '../../application/dtos/access-control-output.dto';
import { DetailAccessControlUseCase } from '../../application/use-cases/detail-access-control.use-case';

export class DetailAccessControlController {
  constructor(private readonly useCase: DetailAccessControlUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { groupUuid } = req.params;

    try {
      const entity = await this.useCase.execute(groupUuid);
      return res.status(200).json(AccessControlOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
