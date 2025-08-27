import prismaClient from "../../../../prisma";

interface AddTeacherToClassRequest {
  id_teacher: number; // ou uuid, depende de como você vai usar
  id_class: number;
}

export class AddTeacherToClassService {
  async execute({ id_teacher, id_class }: AddTeacherToClassRequest) {
    const alreadyLinked = await prismaClient.classTeacher.findFirst({
      where: { id_teacher, id_class }
    });

    if (!id_teacher) {
      throw new Error("É obrigatório selecionar um professor");
    }
    if (!id_class) {
      throw new Error("É obrigatório selecionar uma classe");
    }
    if (alreadyLinked) {
      throw new Error("Esse professor já está vinculado a essa classe");
    }

    const relation = await prismaClient.classTeacher.create({
      data: { id_teacher, id_class },
      include: {
        teacher: { include: { person: true } },
        class: true
      }
    });

    return relation;
  }
}
