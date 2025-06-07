import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DeleteUserervice } from '../../services/user/DeleteUserService'
import { AppError } from '../../errors/AppError'

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    if (!user_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Parâmetro "user_id" é obrigatório na query.' })
    }

    const deleteUserService = new DeleteUserervice()

    try {
      const result = await deleteUserService.execute(user_id)
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

export { DeleteUserController }
