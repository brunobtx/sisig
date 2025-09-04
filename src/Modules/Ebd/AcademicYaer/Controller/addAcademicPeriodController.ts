import { AddAcademicPeriodService } from '../Service/addAcademicPeriodService';
import { Request, Response } from 'express';

export class AddAcademicPeriodController {
  async handle(req: Request, res: Response) {
    const { id_academy_year, name, dt_start, dt_end, id_person_create} = req.body;

    const addAcademicPeriodService = new AddAcademicPeriodService();
    const academicPeriod = await addAcademicPeriodService.execute({
     id_academy_year, 
     name,
     dt_start,
     dt_end,
     id_person_create
    });
    
    return res.json(academicPeriod);
  }
}
