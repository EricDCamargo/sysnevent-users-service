import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

class DeleteParticipantService {
  async execute(user_id: string): Promise<AppResponse> {
    const participant = await prismaClient.participant.findUnique({
      where: { id: user_id }
    })

    if (!participant) {
      throw new AppError('Usuário não encontrado!', StatusCodes.NOT_FOUND)
    }

    await prismaClient.participant.delete({
      where: { id: user_id }
    })

    return {
      message: 'Usuário excluído com sucesso!'
    }
  }
}

export { DeleteParticipantService }
