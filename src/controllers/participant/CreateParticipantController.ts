// src/controllers/participant/CreateParticipantController.ts
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { CreateParticipantService } from '../../services/participant/CreateParticipantService'

class CreateParticipantController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body
    const service = new CreateParticipantService()

    try {
      const result = await service.execute({ name, email, password })
      return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao cadastrar participante' })
    }
  }
}

export { CreateParticipantController }
