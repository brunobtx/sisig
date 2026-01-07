import prismaClient from "../../../../../prisma";
import { PersonInput } from "../Dto/deletePersonInput"; 


export class DeletePersonService{
    async execute({id}: PersonInput){

        const person = await prismaClient.person.update({
            where: { id },
            data: { situacao: false },
        });

        return person;
    }
}