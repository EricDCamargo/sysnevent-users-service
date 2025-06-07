import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UpdateUserervice } from '../../services/user/UpdateUserService'
import { AppError } from '../../errors/AppError'

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string

    if (!user_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Parâmetro "user_id" é obrigatório na query.' })
    }

    const { name, email, role, password } = req.body

    const updateUserervice = new UpdateUserervice()

    try {
      const updatedUser = await updateUserervice.execute({
        user_id,
        name,
        email,
        role,
        password
      })
      return res.status(StatusCodes.OK).json(updatedUser)
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

export { UpdateUserController }
