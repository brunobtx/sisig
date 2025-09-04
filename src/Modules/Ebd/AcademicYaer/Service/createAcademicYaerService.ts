import prismaClient from '../../../../prisma'

interface AcademicYear {
    year: number
    id_person_create: number
}

export class CreateAcademicYearService {
    async execute(data: AcademicYear) {
        const { year, id_person_create} = data

        const academicYear = await prismaClient.academicYear.create({
            data: {
                year, 
                id_person_create
            },
            select: {
                year: true,
                id_person_create: true,
                createdAt: true
            }
        })

        return academicYear
    }
}