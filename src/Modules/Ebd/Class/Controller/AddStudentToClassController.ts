import { AddStudentToClassService } from '../Service/AddStudentToClasseService';
import { Request, Response } from 'express';

export class AddStudentToClassController {
  async handle(req: Request, res: Response) {
    const { id_class, id_student} = req.body;

    const addStudentToClassService = new AddStudentToClassService();
    const user = await addStudentToClassService.execute({
      id_class,
      id_student
    });

    return res.json(user);
  }
}
