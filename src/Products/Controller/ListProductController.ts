import { Request, Response } from "express";

import { ListProductByCategoryService } from "../Service/ListProductService";

class ListProductByCategoryController{
    async handle(req: Request, res: Response){
        const category_id = req.query.category_id as string;
        const listProductByCategory = new ListProductByCategoryService();

    const products = await listProductByCategory.execute({
        category_id
    });

    return res.json(products);
    }
}

export { ListProductByCategoryController }