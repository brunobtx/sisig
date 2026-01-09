import { Request, Response } from 'express';
import { CreateUserService } from '../../../Application/UseCases/createUserUseCase';
import { PrismaUserRepository } from '../../../Domain/Repository/userRepository';
import { UserValidatorFactory } from '../Validator/userValidator';

export class CreateUserController {
  private validator = UserValidatorFactory.create();
  
  handle = async (req: Request, res: Response) => {
    const { password, id_person } = req.body;

    const repository = new PrismaUserRepository();
    const createUserService = new CreateUserService(repository);

    const isValid = this.validator.validate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: this.validator.errors });
    }

    const user = await createUserService.execute({ password, id_person });

    return res.status(201).json(user);
  }
}
