import { Request, Response } from 'express';
import { AppError } from '../../../../../shared/errors/AppError';
import { UpdateUserAccessControlsUseCase } from '../../application/use-cases/update-user-access-controls.use-case';
import { UpdateUserAccessControlsValidator } from '../validators/update-user-access-controls.validator';

export class UpdateUserAccessControlsController {
  constructor(
    private readonly useCase: UpdateUserAccessControlsUseCase,
    private readonly validator: UpdateUserAccessControlsValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const isValid = this.validator.validate(req.body ?? {});

    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    const { userUuid } = req.params;

    try {
      await this.useCase.execute(userUuid, {
        groupUuids: Array.isArray(req.body?.groupUuids) ? req.body.groupUuids : [],
      }, req.activeOrganizationId);

      return res.status(204).send();
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };
}
