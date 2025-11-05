import {Request, Response} from 'express'
import { DeletePersonService } from '../Service/deletePersonService'
import { PersonInput } from '../Dto/deletePersonInput'
import prismaClient from "../../../../prisma";
import { BadRequestError } from '../../../../Common/Application/Errors/badRequestError';

export class DeletePersonController{
    async handle(req: Request, res: Response){
        const idPerson: PersonInput = req.body;

        const personData = await prismaClient.person.findUnique({ where:  idPerson  });
        if (!personData) {
            throw new BadRequestError('Pessoa não existe na base de dados')
        }
        const deletePerson = new DeletePersonService();

        const person = await deletePerson.execute(idPerson);

        return res.json(person);
    }
}