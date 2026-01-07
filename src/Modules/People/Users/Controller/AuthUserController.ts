import { Request, Response } from "express";
import { AuthUserService } from "../Service/authUserService";
import { PrismaPersonRepository } from "../../People/Domain/Repository/personRepository";
import { PrismaUserRepository } from "../Repository/userRepository";

export class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authUserService = new AuthUserService(
      new PrismaPersonRepository(),
      new PrismaUserRepository()
    );
    const auth = await authUserService.execute({
      email,
      password,
    });

    return res.json(auth);
  }
}
