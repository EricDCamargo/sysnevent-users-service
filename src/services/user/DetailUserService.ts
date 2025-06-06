import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class DetailUserervice {
  async execute(user_id: string): Promise<AppResponse> {
    const User = await prismaClient.user.findFirst({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!User) {
      throw new AppError('Usuario não encontrado!', StatusCodes.NOT_FOUND)
    }

    return {
      data: User,
      message: 'Usuario autenticado!'
    }
  }
}

export { DetailUserervice }
