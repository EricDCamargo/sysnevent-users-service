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

class AuthUserervice {
  async execute({ email, password }: AuthRequest): Promise<AppResponse> {
    const user = await prismaClient.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new AppError(
        'Usuario não encontrado, credenciais incoretas!',
        StatusCodes.BAD_REQUEST
      )
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      throw new AppError('Senha incorreta!', StatusCodes.BAD_REQUEST)
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    )

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        needsSecretWordSetup: !user.secretWord
      },
      message: user.secretWord
        ? 'Login realizado com sucesso!'
        : 'Palavra secreta ainda não cadastrada, cadastre para prosseguir!'
    }
  }
}

export { AuthUserervice }
