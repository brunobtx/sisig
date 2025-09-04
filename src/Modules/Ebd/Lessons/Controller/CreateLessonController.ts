import { CreateLessonService } from '../Service/createLessonService';
import { Request, Response } from 'express';

export class CreateLessonController {
  async handle(req: Request, res: Response) {
    const { id_class, dt_lesson, nr_lesson, title, description, id_period, id_person_create} = req.body;

    const createClassService = new CreateLessonService();
    const lesson = await createClassService.execute({
     id_class, 
     dt_lesson, 
     nr_lesson, 
     title, 
     description, 
     id_period, 
     id_person_create
    });

    return res.json(lesson);
  }
}
