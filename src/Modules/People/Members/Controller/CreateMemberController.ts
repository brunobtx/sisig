import { Request, response, Response } from "express";
import { CreateUserService } from  '../Service/CreateUserService'
class CreateUserController 
{
    async headle(req: Request, res: Response){
       // return res.json({ok: true})
      const {name, email, password }= req.body

      const createUserService = new CreateUserService();
      const user =  await createUserService.execute({name, email, password});

      return res.json(user)

    }
}

export {CreateUserController}