import prismaClient from '../../prisma'
import { hash, compare } from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

class ResetPasswordService {
  async registerSecretWord(user_id: string, secretWord: string): Promise<AppResponse> {
    if (!secretWord) {
      throw new AppError('Palavra-chave é obrigatória!', StatusCodes.BAD_REQUEST)
    }

    const user = await prismaClient.user.findUnique({ where: { id: user_id } })

    if (!user) {
      throw new AppError('Usuário não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (user.secretWord) {
      throw new AppError(
        'Palavra-chave já foi cadastrada!',
        StatusCodes.CONFLICT
      )
    }

    const hashedSecret = await hash(secretWord, 8)

    await prismaClient.user.update({
      where: { id: user_id },
      data: { secretWord: hashedSecret }
    })

    return { message: 'Palavra-chave cadastrada com sucesso!' }
  }

  async resetPassword(email: string, secretWord: string, newPassword: string): Promise<AppResponse> {
    const user = await prismaClient.user.findUnique({ where: { email } })

    if (!user || !user.secretWord) {
      throw new AppError(
        'Usuário não encontrado ou sem palavra-chave cadastrada.',
        StatusCodes.NOT_FOUND
      )
    }

    const isMatch = await compare(secretWord, user.secretWord)

    if (!isMatch) {
      throw new AppError('Palavra-chave inválida!', StatusCodes.UNAUTHORIZED)
    }

    const newPasswordHash = await hash(newPassword, 8)

    await prismaClient.user.update({
      where: { email },
      data: { password: newPasswordHash }
    })

    return { message: 'Senha redefinida com sucesso!' }
  }
}

export { ResetPasswordService }
