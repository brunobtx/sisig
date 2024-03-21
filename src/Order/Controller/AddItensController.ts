import { Request, Response } from "express";
import { AddItensService } from "../Service/AddItensService";

class AddItensController{
    async handle(req: Request, res: Response){
        const {order_id, product_id, amount} = req.body
        
        const addItens = new AddItensService();
        

        const order = await addItens.execute({
            order_id,
            product_id,
            amount
        });
        return res.json(order);
    }
}

export { AddItensController }