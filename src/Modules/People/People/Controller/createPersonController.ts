import { Request, Response } from "express";
import { PersonValidatorFactory } from "../Validator/PersonValidator";
import { CreatePersonService } from "../Service/createPersonService";
import { PrismaPersonRepository } from "../Repository/personRepository";
import { PersonOutputMapper } from "../Dto/personOutput";

export class CreatePersonController {
  private service: CreatePersonService;
  private validator = PersonValidatorFactory.create();

  constructor() {
    const repository = new PrismaPersonRepository();
    this.service = new CreatePersonService(repository);
  }

  async handle(req: Request, res: Response): Promise<Response> {
    // ✅ Converte e valida
    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    try {
      const person = await this.service.execute(req.body);
      return res.status(201).json(PersonOutputMapper.toOutput(person));
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
