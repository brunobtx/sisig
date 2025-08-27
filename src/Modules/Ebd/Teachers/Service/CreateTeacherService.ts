import prismaClient from '../../../../prisma'

interface TeacherRequest {
    id_person: number
}

export class CreateTeacherService {
    async execute(data: TeacherRequest) {
        const { id_person} = data

        if (!id_person) {
            throw new Error("É Obrigatório selecionar uma pessoa!")
        }

        const teacher = await prismaClient.teacher.findFirst({
            where: { id_person }
        })

        if (teacher) {
            throw new Error("Pessoa já é um professor!")
        }


        const newTeacher = await prismaClient.teacher.create({
            data: {
                id_person
            },
            select: {
                id_person: true
            }
        })

        return newTeacher
    }
}