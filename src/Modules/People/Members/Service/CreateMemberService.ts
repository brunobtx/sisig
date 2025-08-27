import prismaClient from '../../../../prisma'

interface MemberRequest {
    name: string
    cpf: string
    email: string
    phone: string
    dt_nasc: Date
    sexo: string
    situacao: boolean
}

export class CreateMemberService {
    async execute(data: MemberRequest) {
        const { name, cpf, email, phone, dt_nasc, sexo, situacao } = data

        if (!email) {
            throw new Error("Email deve ser obrigatório!")
        }

        const memberAlreadyExists = await prismaClient.member.findFirst({
            where: { email }
        })

        const cpfAllreadyExists = await prismaClient.member.findFirst({
            where: { cpf }
        })

        if (memberAlreadyExists) {
            throw new Error("Email já existe!")
        }
        if (cpfAllreadyExists) {
            throw new Error("CPF já existe!")
        }

        const member = await prismaClient.member.create({
            data: {
                name,
                cpf,
                email,
                phone,
                dt_nasc,
                sexo,
                situacao
            },
            select: {
                uuid: true,
                name: true,
                cpf: true,
                email: true,
                phone: true,
                dt_nasc: true,
                sexo: true,
                situacao: true
            }
        })

        return member
    }
}