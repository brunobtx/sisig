import { Request, Response } from 'express';
import { ListPersonUseCase } from '../../application/use-cases/list-person.use-case';

export class ListPersonController {
  constructor(private readonly useCase: ListPersonUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const people = await this.useCase.execute(req.activeOrganizationId);
    return res.status(200).json(people);
  };
}
