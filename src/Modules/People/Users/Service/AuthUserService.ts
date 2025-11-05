import prismaClient from "../../../../prisma";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken'
import { BadRequestError } from "../../../../Common/Application/Errors/badRequestError";


interface AuthRequest{
 email: string;
 password: string;
}

 export class AuthUSerService {
    async execute({email, password}:AuthRequest){

        const person = await prismaClient.person.findFirst({
            where:{
                email: email
            }
        })
        if (!person){
            throw new BadRequestError("Email Não Cadastrado no Sistema")
        }   
        const user = await prismaClient.user.findFirst({
            where:{
                id_person: person.id
            }
        })
        if (!user){
            throw new BadRequestError("Usuário Não existe no Sistema")
        }
        const passwordMath = await compare(password, user.password)

        if (!passwordMath){
            throw new BadRequestError("Usuario/Senha Incorretas")
        }

        const token = sign({
            name: person.name,
            email: person.email
        },
        process.env.JWT_SECRET,
        {
            subject:user.uuid,
            expiresIn:'30d'
        }
        )
        return {
            id:user.id,
            name: person.name,
            email: person.email,
            token: token
        }
    }

}