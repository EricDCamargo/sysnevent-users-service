import { Request, Response } from 'express'
import { ResetPasswordService } from '../../services/user/ResetPasswordService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ResetPasswordController {
  async registerSecretWord(req: Request, res: Response) {
    const user_id = req.user_id
    const { secretWord } = req.body

    const service = new ResetPasswordService()

    try {
      const result = await service.registerSecretWord(user_id, secretWord)
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, secretWord, newPassword } = req.body

    const service = new ResetPasswordService()

    try {
      const result = await service.resetPassword(email, secretWord, newPassword)
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { ResetPasswordController }
