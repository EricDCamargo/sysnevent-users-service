import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

class DeleteUserervice {
  async execute(user_id: string): Promise<AppResponse> {
    const User = await prismaClient.user.findUnique({
      where: { id: user_id }
    })

    if (!User) {
      throw new AppError('Usuário não encontrado!', StatusCodes.NOT_FOUND)
    }

    await prismaClient.user.delete({
      where: { id: user_id }
    })

    return {
      message: 'Usuário excluído com sucesso!'
    }
  }
}

export { DeleteUserervice }
