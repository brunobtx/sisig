import prismaClient from "../../../../prisma";

interface AddStudentToClassRequest {
  id_student: number;
  id_class: number;
}

export class AddStudentToClassService {
  async execute({ id_student, id_class }: AddStudentToClassRequest) {
    const studentToClass = await prismaClient.classStudent.findFirst({
      where: { id_student },
    });

    if (!id_student) {
      throw new Error("É obrigatório selecionar um Aluno");
    }
    if (!id_class) {
      throw new Error("É obrigatório selecionar uma classe");
    }
    if (studentToClass && studentToClass.id_class === id_class) {
      throw new Error("Esse Aluno já está vinculado a essa classe");
    }
    if (studentToClass) {
      throw new Error("Esse Aluno já está vinculado a uma classe");
    }

    const relation = await prismaClient.classStudent.create({
      data: { id_student, id_class },
      include: {
        student: { include: { person: true } },
        class: true,
      },
    });

    return relation;
  }
}
