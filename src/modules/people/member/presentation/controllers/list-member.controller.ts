import { Request, Response } from 'express';
import { ListMemberUseCase } from '../../application/use-cases/list-member.use-case';

export class ListMemberController {
  constructor(private readonly useCase: ListMemberUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const members = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(members);
  };
}
