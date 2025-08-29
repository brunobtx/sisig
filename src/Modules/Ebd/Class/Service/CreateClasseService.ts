import prismaClient from "../../../../prisma";
import {
  MAX_IDADE,
  MIN_IDADE,
} from "../../../../Common/Domain/Enum/Class/classEnum";

interface ClassRequest {
  name: string;
  idade_in: number;
  idade_fn: number;
}

export class CreateClassService {
  async execute(data: ClassRequest) {
    const { name, idade_in, idade_fn } = data;

    if (idade_fn < idade_in) {
      throw new Error("Idade Inicial Não pode ser maior que Idade Final!");
    }

    if (idade_in < MIN_IDADE || idade_fn < MIN_IDADE) {
      throw new Error(`Idade não pode ser menor que ${MIN_IDADE}!`);
    }

    if (idade_in > MAX_IDADE || idade_fn > MAX_IDADE) {
      throw new Error(`Idade não pode ser maior que ${MAX_IDADE}!`);
    }

    const classe = await prismaClient.class.create({
      data: {
        name,
        idade_in,
        idade_fn,
      },
      select: {
        uuid: true,
        name: true,
      },
    });

    return classe;
  }
}
