import { Request, Response } from 'express';
import { AccessControlOutputMapper } from '../../application/dtos/access-control-output.dto';
import { ListAccessControlUseCase } from '../../application/use-cases/list-access-control.use-case';

export class ListAccessControlController {
  constructor(private readonly useCase: ListAccessControlUseCase) {}

  handle = async (_req: Request, res: Response): Promise<Response> => {
    const groups = await this.useCase.execute();
    return res.status(200).json(groups.map(AccessControlOutputMapper.toOutput));
  };
}
