import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

interface ParticipantRequest {
  name: string
  email: string
  password: string
}

class CreateParticipantService {
  async execute({
    name,
    email,
    password
  }: ParticipantRequest): Promise<AppResponse> {
    if (!name || !email || !password) {
      throw new AppError(
        'Nome, e-mail e senha são obrigatórios!',
        StatusCodes.BAD_REQUEST
      )
    }

    const participantExists = await prismaClient.participant.findUnique({
      where: { email }
    })

    if (participantExists) {
      throw new AppError(
        'E-mail já cadastrado por outro participante!',
        StatusCodes.CONFLICT
      )
    }

    const passwordHash = await hash(password, 8)

    try {
      const participant = await prismaClient.participant.create({
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
        data: participant,
        message: 'Participante cadastrado com sucesso!'
      }
    } catch (error) {
      throw new AppError(
        'Erro ao criar participante!',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export { CreateParticipantService }
