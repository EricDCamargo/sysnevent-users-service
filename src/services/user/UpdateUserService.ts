import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { hash } from 'bcryptjs'

interface UpdateUserRequest {
  user_id: string
  name?: string
  email?: string
  password?: string
}

class UpdateUserervice {
  async execute({
    user_id,
    name,
    email,
    password
  }: UpdateUserRequest): Promise<AppResponse> {
    const User = await prismaClient.user.findUnique({
      where: { id: user_id }
    })

    if (!User) {
      throw new AppError('Usuário não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (email && email !== User.email) {
      const emailExists = await prismaClient.user.findUnique({
        where: { email }
      })

      if (emailExists && emailExists.id !== user_id) {
        throw new AppError(
          'E-mail já cadastrado por outro Usere!',
          StatusCodes.CONFLICT
        )
      }
    }

    let passwordHash: string | undefined
    if (password) {
      passwordHash = await hash(password, 8)
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: {
        name: name || User.name,
        email: email || User.email,
        password: passwordHash || User.password
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return {
      data: updatedUser,
      message: 'Usuário atualizado com sucesso!'
    }
  }
}

export { UpdateUserervice }
