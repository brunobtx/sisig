import prismaClient from '../../../../prisma'

interface PersonRequest {
    name: string
    cpf: string
    email: string
    phone: string
    dt_nasc: Date
    sexo: string
    situacao: boolean
}

export class CreatePersonService {
    async execute(data: PersonRequest) {
        const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data

        const emailAlreadyExists = await prismaClient.person.findFirst({
            where: { email }
        })

        const personAllreadyExists = await prismaClient.person.findFirst({
            where: { cpf }
        })

        if (emailAlreadyExists) {
            throw new Error("Email já existe!")
        }
        if (personAllreadyExists) {
            throw new Error("CPF já existe!")
        }

        const dt_nasc_date = new Date(dt_nasc)

        const member = await prismaClient.person.create({
            data: {
                name,
                cpf,
                email,
                phone,
                dt_nasc: dt_nasc_date,
                sexo,
                situacao
            },
            select: {
                uuid: true,
                name: true,
                cpf: true,
                email: true
            }
        })

        return member
    }
}