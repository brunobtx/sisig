import { CreateTeacherService } from '../Service/CreateTeacherService';
import { Request, Response } from 'express';

export class CreateTeacherController {
  async handle(req: Request, res: Response) {
    const { id_person} = req.body;

    const createTeacherService = new CreateTeacherService();
    const teacher = await createTeacherService.execute({
    id_person
    });

    return res.json(teacher);
  }
}
