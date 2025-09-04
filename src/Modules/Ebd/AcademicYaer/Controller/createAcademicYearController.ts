import { CreateAcademicYearService } from '../Service/createAcademicYaerService';
import { Request, Response } from 'express';

export class CreateAcademicYearController {
  async handle(req: Request, res: Response) {
    const { year, id_person_create} = req.body;

    const createAcademicYearService = new CreateAcademicYearService();
    const academicYear = await createAcademicYearService.execute({
     year, 
     id_person_create
    });

    return res.json(academicYear);
  }
}
