import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { Role } from '@prisma/client'

interface UserRequest {
  name: string
  email: string
  role: Role
  password: string
}

class CreateUserervice {
  async execute({
    name,
    email,
    role,
    password
  }: UserRequest): Promise<AppResponse> {
    if (!name || !email || !role || !password) {
      throw new AppError(
        'Nome, e-mail, função e senha são obrigatórios!',
        StatusCodes.BAD_REQUEST
      )
    }

    const UserExists = await prismaClient.user.findUnique({
      where: { email }
    })

    if (UserExists) {
      throw new AppError(
        'Email já cadastrado em outro usuario!',
        StatusCodes.CONFLICT
      )
    }

    const passwordHash = await hash(password, 8)

    try {
      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          role,
          password: passwordHash
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })

      return { data: user, message: 'Usuario criado com sucesso!' }
    } catch (error) {
      throw new AppError(
        'Erro ao criar usuario!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export { CreateUserervice }
