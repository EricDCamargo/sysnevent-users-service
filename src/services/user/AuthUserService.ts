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
    const User = await prismaClient.user.findUnique({
      where: { email }
    })

    if (!User) {
      throw new AppError(
        'Usere não encontrado, credenciais incorretas!',
        StatusCodes.BAD_REQUEST
      )
    }

    const passwordMatch = await compare(password, User.password)
    if (!passwordMatch) {
      throw new AppError('Senha incorreta!', StatusCodes.BAD_REQUEST)
    }

    const token = sign(
      {
        name: User.name,
        email: User.email
      },
      process.env.JWT_SECRET as string,
      {
        subject: User.id,
        expiresIn: '30d'
      }
    )

    return {
      data: {
        id: User.id,
        name: User.name,
        email: User.email,
        token
      },
      message: 'Login realizado com sucesso!'
    }
  }
}

export { AuthUserervice }
