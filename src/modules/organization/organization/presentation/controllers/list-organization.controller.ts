import { Request, Response } from 'express';
import { ListOrganizationUseCase } from '../../application/use-cases/list-organization.use-case';

export class ListOrganizationController {
  constructor(private readonly useCase: ListOrganizationUseCase) {}

  handle = async (_req: Request, res: Response): Promise<Response> => {
    const organizations = await this.useCase.execute();
    return res.status(200).json(organizations);
  };
}
