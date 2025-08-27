import { Request, response, Response } from "express";
import { CreateUserService } from  '../Service/CreateUserService'
class CreateUserController 
{
    async headle(req: Request, res: Response){
       // return res.json({ok: true})
      const {password, id_person }= req.body

      const createUserService = new CreateUserService();
      const user =  await createUserService.execute({password,id_person});

      return res.json(user)

    }
}

export {CreateUserController}