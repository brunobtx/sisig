import { CreateStudentService } from '../Service/CreateStudentService';
import { Request, Response } from 'express';

export class CreateStudentController {
  async handle(req: Request, res: Response) {
    const { id_person} = req.body;

    const createStudentService = new CreateStudentService();
    const teacher = await createStudentService.execute({
    id_person
    });

    return res.json(teacher);
  }
}
