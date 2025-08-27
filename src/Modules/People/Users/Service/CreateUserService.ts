import prismaClient from '../../../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest {
  id_person: number
  password: string
}

class CreateUserService {
  async execute({ id_person, password }: UserRequest) {
    if (!id_person) {
        throw new Error("ID da pessoa obrigatório!")
    }
    if (!password) {
        throw new Error("Senha obrigatória!")
    }

    // Verifica se já existe usuário para essa pessoa
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { id_person }
    })
    if (userAlreadyExists) {
        throw new Error("Usuário já existe para esta pessoa!")
    }

    // Hash da senha
    const passwordHash = await hash(password, 8)

    // Criação do usuário
    const user = await prismaClient.user.create({
      data: {
        password: passwordHash,
        id_person
      },
      include: {
        person: true
      }
    })

    return user
  }
}

export { CreateUserService }
