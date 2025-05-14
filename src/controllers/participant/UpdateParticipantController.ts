import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UpdateParticipantService } from '../../services/participant/UpdateParticipantService'
import { AppError } from '../../errors/AppError'

class UpdateParticipantController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string
    const { name, email, password } = req.body

    if (req.user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Ação não permitida! Você só pode editar sua própria conta.'
      })
    }

    const updateParticipantService = new UpdateParticipantService()

    try {
      const result = await updateParticipantService.execute({
        user_id,
        name,
        email,
        password
      })
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao atualizar participante' })
    }
  }
}

export { UpdateParticipantController }
