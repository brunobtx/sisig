import { Request, Response } from "express";
import { DetailPersonService } from "../../../Application/UseCases/detailPersonUseCase";

export class DetailPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const service = new DetailPersonService();

    try {
        const idNumeric = Number (id); 
      const person = await service.execute(idNumeric);
      return res.status(200).json(person);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}
