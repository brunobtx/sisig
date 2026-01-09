import { Request, Response } from "express";
import { DetailUserService } from "../../../Application/UseCases/detailUserUseCase";

class DetailUserController{
    async handle(req: Request, res: Response){

        const userId = req.userId

        const DetailUSerService = new DetailUserService();
        const user = await DetailUSerService.execute(userId);
    return res.json(user)}
}

export { DetailUserController }