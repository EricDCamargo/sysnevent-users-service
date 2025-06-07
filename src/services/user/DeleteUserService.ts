import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

class DeleteUserervice {
  async execute(user_id: string): Promise<AppResponse> {
    if (!user_id) {
      throw new AppError(
        'Necessario informar ID do usuario!',
        StatusCodes.BAD_REQUEST
      )
    }
    const userExists = await prismaClient.user.findUnique({
      where: { id: user_id }
    })

    if (!userExists) {
      throw new AppError('Usuario não foi encontrado!', StatusCodes.NOT_FOUND)
    }

    await prismaClient.user.delete({
      where: { id: user_id }
    })

    return {
      message: 'Usuario removido com sucesso!'
    }
  }
}

export { DeleteUserervice }
