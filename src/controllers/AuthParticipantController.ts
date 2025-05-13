import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../errors/AppError'
import { AuthParticipantService } from '../services/participant/AuthParticipantService'

class AuthParticipantController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body
    const authService = new AuthParticipantService()

    try {
      const result = await authService.execute({ email, password })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      console.error('Erro ao autenticar participante:', error)
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno ao autenticar'
      })
    }
  }
}

export { AuthParticipantController }
