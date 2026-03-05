import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { AccessControlOutputMapper } from '../../application/dtos/access-control-output.dto';
import { UpdateAccessControlUseCase } from '../../application/use-cases/update-access-control.use-case';
import { AccessControlValidator } from '../validators/access-control.validator';

export class UpdateAccessControlController {
  constructor(
    private readonly useCase: UpdateAccessControlUseCase,
    private readonly validator: AccessControlValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body);

    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    const { groupUuid } = req.params;

    try {
      const entity = await this.useCase.execute(groupUuid, req.body);
      return res.status(200).json(AccessControlOutputMapper.toOutput(entity));
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
