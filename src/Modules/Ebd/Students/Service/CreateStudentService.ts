import prismaClient from '../../../../prisma'

interface StudentRequest {
    id_person: number
}

export class CreateStudentService {
    async execute(data: StudentRequest) {
        const { id_person} = data

        if (!id_person) {
            throw new Error("É Obrigatório selecionar uma pessoa!")
        }

        const student = await prismaClient.student.findFirst({
            where: { id_person }
        })

        if (student) {
            throw new Error("Pessoa já é um aluno!")
        }

        const newStudent = await prismaClient.student.create({
            data: {
                id_person
    
            },
            select: {
                id_person: true,
                id: true
            }
        })

        return newStudent
    }
}