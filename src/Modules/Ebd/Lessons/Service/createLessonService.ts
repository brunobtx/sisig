import prismaClient from '../../../../prisma'

interface LessonRequest {
    id_class: number
    dt_lesson: Date
    nr_lesson: number
    title:     string
    description: string
    id_period: number
    id_person_create: number
}

export class CreateLessonService {
    async execute(data: LessonRequest) {
        const { id_class, dt_lesson, nr_lesson, title, description, id_period, id_person_create} = data

        const lessonDate = new Date(dt_lesson)

        const lesson = await prismaClient.lesson.create({
            data: {
                id_class, 
                dt_lesson: lessonDate,
                nr_lesson, 
                title, 
                description,
                id_period,
                id_person_create
            },
            select: {
                id_class: true,
                dt_lesson: true,
                nr_lesson: true,
            }
        })

        return lesson
    }
}