import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DeleteParticipantService } from '../../services/participant/DeleteParticipantService'
import { AppError } from '../../errors/AppError'

class DeleteParticipantController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    if (req.user_id !== user_id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({
          error: 'Ação não permitida! Você só pode excluir sua própria conta.'
        })
    }

    const deleteParticipantService = new DeleteParticipantService()

    try {
      const result = await deleteParticipantService.execute(user_id)
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao excluir participante' })
    }
  }
}

export { DeleteParticipantController }
