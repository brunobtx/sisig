import { CreateClassSessionService } from '../Service/CreateClassSessionService';
import { Request, Response } from 'express';

export class CreateClassController {
  async handle(req: Request, res: Response) {
    const { id_class, dt_session, nr_lesson, topic, id_teacher, notes, id_person } = req.body;

    const createClassService = new CreateClassSessionService();
    const user = await createClassService.execute({
     id_class, 
     dt_session, 
     nr_lesson, 
     topic, 
     id_teacher, 
     notes, 
     id_person
    });

    return res.json(user);
  }
}
