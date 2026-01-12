import { Request, Response } from "express";
import { DeletePersonService } from "../../../Application/UseCases/deletePersonUseCase";

export class DeletePersonController {
  async handle(req: Request, res: Response) {
    try {
      const uuid: string = req.params.uuid;
      const deletePerson = new DeletePersonService();
      const person = await deletePerson.execute(uuid);
      return res.json(person);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
