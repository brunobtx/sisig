import { AddTeacherToClassService } from '../Service/AddTeacherToClassService';
import { Request, Response } from 'express';

export class AddTeacherToClassController {
  async handle(req: Request, res: Response) {
    const { id_class, id_teacher} = req.body;

    const addTeacherToClassService = new AddTeacherToClassService();
    const user = await addTeacherToClassService.execute({
      id_class,
      id_teacher
    });

    return res.json(user);
  }
}
