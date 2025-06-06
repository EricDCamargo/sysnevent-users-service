import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

interface UserRequest {
  name: string
  email: string
  password: string
}

class CreateUserervice {
  async execute({ name, email, password }: UserRequest): Promise<AppResponse> {
    if (!name || !email || !password) {
      throw new AppError(
        'Nome, e-mail e senha são obrigatórios!',
        StatusCodes.BAD_REQUEST
      )
    }

    const UserExists = await prismaClient.user.findUnique({
      where: { email }
    })

    if (UserExists) {
      throw new AppError(
        'E-mail já cadastrado por outro Usere!',
        StatusCodes.CONFLICT
      )
    }

    const passwordHash = await hash(password, 8)

    try {
      const User = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })

      return {
        data: User,
        message: 'Usere cadastrado com sucesso!'
      }
    } catch (error) {
      throw new AppError(
        'Erro ao criar Usere!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export { CreateUserervice }
