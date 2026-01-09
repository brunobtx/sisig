import { Request, Response } from "express";
import { DetailPersonService } from "../../../Application/UseCases/detailPersonUseCase";

export class DetailPersonController {
  handle = async (req: Request, res: Response): Promise<Response> => {
    const idNumeric = Number(req.params.id);

    if (!idNumeric || isNaN(idNumeric)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const service = new DetailPersonService();

    try {
      const person = await service.execute(idNumeric);
      return res.status(200).json(person);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };
}
