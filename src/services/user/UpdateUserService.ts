import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { hash } from 'bcryptjs'
import { Role } from '@prisma/client'
import { passwordRegex } from '../../utils'

interface UpdateUserRequest {
  user_id: string
  name: string
  email: string
  role: Role
  password?: string
}

class UpdateUserervice {
  async execute({
    user_id,
    name,
    email,
    role,
    password
  }: UpdateUserRequest): Promise<AppResponse> {
    const user = await prismaClient.user.findUnique({
      where: { id: user_id }
    })

    if (!user) {
      throw new AppError('Usuario não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (email) {
      const userAlreadyExists = await prismaClient.user.findFirst({
        where: {
          email,
          NOT: {
            id: user_id
          }
        }
      })
      if (userAlreadyExists) {
        throw new AppError(
          'Email já cadastrado em outro usuario!',
          StatusCodes.CONFLICT
        )
      }
    }

    const dataToUpdate: {
      name: string
      email: string
      role: Role
      updated_at: Date
      password?: string
    } = {
      name,
      email,
      role,
      updated_at: new Date()
    }

    if (password) {
      if (!passwordRegex.test(password)) {
        throw new AppError(
          'A nova senha deve conter no mínimo 6 caracteres, incluindo letras, números e pelo menos um caractere especial.',
          StatusCodes.BAD_REQUEST
        )
      }
      dataToUpdate.password = await hash(password, 8)
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return {
      data: updatedUser,
      message: 'Usuario editado com sucesso!'
    }
  }
}

export { UpdateUserervice }
