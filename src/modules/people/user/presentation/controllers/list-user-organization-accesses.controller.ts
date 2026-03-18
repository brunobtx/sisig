import { Request, Response } from 'express';
import { ListUserOrganizationAccessesUseCase } from '../../application/use-cases/list-user-organization-accesses.use-case';

export class ListUserOrganizationAccessesController {
  constructor(private readonly useCase: ListUserOrganizationAccessesUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.useCase.execute(req.params.userUuid, req.activeOrganizationId);
    return res.status(200).json(response);
  };
}
