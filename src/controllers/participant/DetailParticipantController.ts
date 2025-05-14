import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DetailParticipantService } from '../../services/participant/DetailParticipantService'
import { AppError } from '../../errors/AppError'

class DetailParticipantController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id

    const detailParticipantService = new DetailParticipantService()

    try {
      const participant = await detailParticipantService.execute(user_id)
      return res.status(StatusCodes.OK).json(participant)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno no servidor' })
    }
  }
}

export { DetailParticipantController }
