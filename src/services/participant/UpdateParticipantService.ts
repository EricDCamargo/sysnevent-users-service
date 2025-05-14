import prismaClient from '../../prisma'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { hash } from 'bcryptjs'

interface UpdateParticipantRequest {
  user_id: string
  name?: string
  email?: string
  password?: string
}

class UpdateParticipantService {
  async execute({
    user_id,
    name,
    email,
    password
  }: UpdateParticipantRequest): Promise<AppResponse> {
    const participant = await prismaClient.participant.findUnique({
      where: { id: user_id }
    })

    if (!participant) {
      throw new AppError('Usuário não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (email && email !== participant.email) {
      const emailExists = await prismaClient.participant.findUnique({
        where: { email }
      })

      if (emailExists && emailExists.id !== user_id) {
        throw new AppError(
          'E-mail já cadastrado por outro participante!',
          StatusCodes.CONFLICT
        )
      }
    }

    let passwordHash: string | undefined
    if (password) {
      passwordHash = await hash(password, 8)
    }

    const updatedParticipant = await prismaClient.participant.update({
      where: { id: user_id },
      data: {
        name: name || participant.name,
        email: email || participant.email,
        password: passwordHash || participant.password
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return {
      data: updatedParticipant,
      message: 'Usuário atualizado com sucesso!'
    }
  }
}

export { UpdateParticipantService }
