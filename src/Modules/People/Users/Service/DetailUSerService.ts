
import prismaClient from "../../../../prisma";

class DetailUserService{
    async execute(userId: string){

        const user = await prismaClient.user.findFirst({
            where:{
                uuid: userId
            }
        })
        const person = await prismaClient.person.findFirst({
            where:{
                id: user.id_person
            },
            select:{
                id: true,
                name: true,
                email: true
            }
        })
        return user
    }
}

export { DetailUserService }