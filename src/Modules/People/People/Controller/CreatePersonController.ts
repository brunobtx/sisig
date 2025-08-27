import { CreatePersonService } from '../Service/CreatePersonService';
import { Request, Response } from 'express';

export class CreatePersonController {
  async handle(req: Request, res: Response) {
    const { name, cpf, email, phone, dt_nasc, sexo, situacao } = req.body;

    const createPersonService = new CreatePersonService();
    const user = await createPersonService.execute({
      name,
      cpf,
      email,
      phone,
      dt_nasc,
      sexo,
      situacao
    });

    return res.json(user);
  }
}
