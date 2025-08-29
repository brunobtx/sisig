import prismaClient from '../../../../prisma'

interface ClassSessionRequest {
    id_class: number
    dt_session: Date
    nr_lesson: number
    topic: string
    id_teacher: number
    notes?: string
    id_person: number
}

export class CreateClassSessionService {
    async execute(data: ClassSessionRequest) {
        const { id_class, dt_session, nr_lesson, topic, id_teacher, notes, id_person} = data

        if (!id_class) {
            throw new Error("Classe deve ser obrigatório!")
        }
         if (!dt_session) {
            throw new Error("Data da Aula deve ser obrigatório!")
        }
        if (!nr_lesson) {
            throw new Error("Número da Lição deve ser obrigatório!")
        }
        if (!topic) {
            throw new Error("Tópico da Lição deve ser obrigatório!")
        }
        if (!id_teacher) {
            throw new Error("Número da Lição deve ser obrigatório!")
        }

        const classeSession = await prismaClient.classSession.create({
            data: {
                id_class, 
                dt_session, 
                nr_lesson, 
                topic, 
                id_teacher, 
                notes, 
                id_person
            },
            select: {
                id_class: true,
                dt_session: true,
                nr_lesson: true,
            }
        })

        return classeSession
    }
}