import { Request, Response } from "express";
import { DetailUserService } from "../../../Application/UseCases/detailUserUseCase";

class DetailUserController{
    async handle(req: Request, res: Response){

        const userId = req.params.uuid;

        const detailUserService = new DetailUserService();
        const user = await detailUserService.execute(userId);
    return res.json(user)}
}

export { DetailUserController }