import { Request, Response } from 'express';
import { ListClassUseCase } from '../../application/use-cases/list-class.use-case';

export class ListClassController {
  constructor(private readonly useCase: ListClassUseCase) {}

  handle = async (req: Request, res: Response): Promise<Response> => {
    const classes = await this.useCase.execute();
    return res.status(200).json(classes);
  };
}
