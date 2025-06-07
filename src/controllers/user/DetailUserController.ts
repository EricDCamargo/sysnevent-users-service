import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DetailUserervice } from '../../services/user/DetailUserService'
import { AppError } from '../../errors/AppError'

class DetailUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id

    if (!user_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Parâmetro "user_id" é obrigatório.' })
    }
    const detailUserervice = new DetailUserervice()

    try {
      const User = await detailUserervice.execute(user_id)
      return res.status(StatusCodes.OK).json(User)
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

export { DetailUserController }
