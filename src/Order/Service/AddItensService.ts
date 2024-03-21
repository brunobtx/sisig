import prismaClient from "../../prisma";

interface ItensResquest{
    order_id: string;
    product_id: string;
    amount: number;
}
class AddItensService{
    async execute({order_id, product_id, amount}: ItensResquest){

        const order = await prismaClient.item.create({
            data:{
                order_id: order_id,
                product_id: product_id,
                amount
            }
        })
        return order;
    }
}

export { AddItensService }