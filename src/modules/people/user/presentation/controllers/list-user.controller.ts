import { Request, Response } from 'express';
import { ListUserUseCase } from '../../application/use-cases/list-user.use-case';

export class ListUserController {
  constructor(private readonly useCase: ListUserUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(user);
  };
}
