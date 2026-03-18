import { Request, Response } from 'express';
import { UpdateUserOrganizationAccessesUseCase } from '../../application/use-cases/update-user-organization-accesses.use-case';
import { UpdateUserOrganizationAccessesValidator } from '../validators/update-user-organization-accesses.validator';

export class UpdateUserOrganizationAccessesController {
  constructor(
    private readonly useCase: UpdateUserOrganizationAccessesUseCase,
    private readonly validator: UpdateUserOrganizationAccessesValidator,
  ) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    if (!this.validator.validate(req.body)) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    await this.useCase.execute(req.params.userUuid, req.body, req.activeOrganizationId);
    return res.status(204).send();
  };
}
