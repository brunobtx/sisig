import { Request, Response } from "express";
import { AuthUSerService } from "../Service/AuthUserService";

class AuthUSerController{
    async handle(req: Request, res: Response){
        const {email, password} = req.body;

        const authUSerService = new AuthUSerService;
        const auth =  await authUSerService.execute({
            email, 
            password
        })

        return res.json(auth)
    }
}

export { AuthUSerController }