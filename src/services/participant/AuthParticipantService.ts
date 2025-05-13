import prismaClient from '../../prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'

interface AuthRequest {
  email: string
  password: string
}

class AuthParticipantService {
  async execute({ email, password }: AuthRequest): Promise<AppResponse> {
    const participant = await prismaClient.participant.findUnique({
      where: { email }
    })

    if (!participant) {
      throw new AppError(
        'Participante não encontrado, credenciais incorretas!',
        StatusCodes.BAD_REQUEST
      )
    }

    const passwordMatch = await compare(password, participant.password)
    if (!passwordMatch) {
      throw new AppError('Senha incorreta!', StatusCodes.BAD_REQUEST)
    }

    const token = sign(
      {
        name: participant.name,
        email: participant.email
      },
      process.env.JWT_SECRET as string,
      {
        subject: participant.id,
        expiresIn: '30d'
      }
    )

    return {
      data: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        token
      },
      message: 'Login realizado com sucesso!'
    }
  }
}

export { AuthParticipantService }
