import { Request, Response } from "express";
import { ListPersonService } from "../../../Application/UseCases/listPersonUseCase";

export class ListPersonController {
  async handle(req: Request, res: Response): Promise<Response> {
    const service = new ListPersonService();
    const people = await service.execute();
    return res.status(200).json(people);
  }
}
