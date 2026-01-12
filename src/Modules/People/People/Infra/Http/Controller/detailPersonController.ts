import { Request, Response } from "express";
import { DetailPersonService } from "../../../Application/UseCases/detailPersonUseCase";

export class DetailPersonController {
  handle = async (req: Request, res: Response): Promise<Response> => {
    const uuid = req.params.uuid;

    if (!uuid) {
      return res.status(400).json({ message: "UUID inválido" });
    }

    const service = new DetailPersonService();

    try {
      const person = await service.execute(uuid);
      return res.status(200).json(person);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };
}
