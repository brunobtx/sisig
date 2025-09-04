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

        const sessionDate = new Date(dt_session)

        const classeSession = await prismaClient.classSession.create({
            data: {
                id_class, 
                dt_session: sessionDate,
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