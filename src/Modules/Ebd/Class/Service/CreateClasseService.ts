import prismaClient from '../../../../prisma'

interface ClassRequest {
    name: string
    idade_in: number
    idade_fn: number
}

export class CreateClassService {
    async execute(data: ClassRequest) {
        const { name, idade_in, idade_fn} = data

        if (!name) {
            throw new Error("Nome deve ser obrigatório!")
        }
         if (!idade_in) {
            throw new Error("Idade Inicial deve ser obrigatório!")
        }
         if (!idade_fn) {
            throw new Error("Idade Final deve ser obrigatório!")
        }

        const classe = await prismaClient.class.create({
            data: {
                name,
                idade_in,
                idade_fn,
            },
            select: {
                uuid: true,
                name: true,
            }
        })

        return classe
    }
}