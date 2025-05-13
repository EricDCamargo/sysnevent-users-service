import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

class DetailParticipantService {
  async execute(user_id: string): Promise<AppResponse> {
    const participant = await prismaClient.participant.findFirst({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    if (!participant) {
      throw new AppError('Usuario não encontrado!', StatusCodes.NOT_FOUND)
    }

    return {
      data: participant,
      message: 'Usuario autenticado!'
    }
  }
}

export { DetailParticipantService }
