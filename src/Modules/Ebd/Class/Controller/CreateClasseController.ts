import { CreateClassService } from '../Service/CreateClasseService';
import { Request, Response } from 'express';

export class CreateClassController {
  async handle(req: Request, res: Response) {
    const { name, idade_in, idade_fn } = req.body;

    const createClassService = new CreateClassService();
    const user = await createClassService.execute({
      name,
      idade_in,
      idade_fn,
    });

    return res.json(user);
  }
}
